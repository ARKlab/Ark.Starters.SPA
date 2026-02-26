var tedious = require('tedious');
var Connection = tedious.Connection;
var Request = tedious.Request;
var config = require('./config');
var Task = require('data.task');
var genericPool = require('generic-pool');

// Create connection pool
var pool = genericPool.createPool({
  create: function() {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Connection timeout'));
      }, 30000);
      
      var connection = new Connection(config);
      
      connection.on('connect', function(err) {
        clearTimeout(timeout);
        if (err) {
          reject(err);
        } else {
          resolve(connection);
        }
      });
      
      connection.on('error', function(err) {
        clearTimeout(timeout);
        reject(err);
      });
      
      // Connect MUST be called after event handlers are attached
      connection.connect();
    });
  },
  destroy: function(connection) {
    return new Promise((resolve) => {
      connection.on('end', resolve);
      connection.close();
    });
  },
  validate: function(connection) {
    try {
      return Promise.resolve(
        connection && 
        connection.state && 
        connection.state.name === 'LoggedIn' &&
        !connection.closed &&
        !connection.cleanupCalled
      );
    } catch (e) {
      return Promise.resolve(false);
    }
  }
}, {
  max: 200,
  min: 2,
  testOnBorrow: false,
  acquireTimeoutMillis: 200000,
  idleTimeoutMillis: 200000
});

function connect() {
  return new Task((reject, resolve) => {
    pool.acquire()
      .then(connection => {
        resolve(connection);
      })
      .catch(err => {
        reject(err);
      });
  });
}

//close connection after request
function createRequest(request) {
  return function(connection) {
    return new Task(function(reject, resolve) {
      var released = false;
      var collectedRows = [];
      
      var releaseConnection = function(isError) {
        if (!released) {
          released = true;
          setImmediate(function() {
            if (isError) {
              pool.destroy(connection).catch(function() {});
            } else {
              pool.release(connection).catch(function() {});
            }
          });
        }
      };
      
      var requestObj = new Request(request.sql, function(err, rowCount) {
        if (err) {
          releaseConnection(true);
          reject(err);
        } else {
          releaseConnection(false);
          resolve(collectedRows);
        }
      });
      
      // Tedious 8 with rowCollectionOnRequestCompletion: false requires event-based row handling
      requestObj.on('row', function(columns) {
        var obj = {};
        columns.forEach(function(col) {
          obj[col.metadata.colName] = col.value;
        });
        collectedRows.push(obj);
      });
      
      requestObj.on('error', function(err) {
        releaseConnection(false);
        reject(err);
      });
      
      request.parameters.forEach(function(parameter) {
        requestObj.addParameter(parameter.name, parameter.type, parameter.value, parameter.options);
      });
      connection.execSql(requestObj);
    });
  };
}

var DbRequest = {
  _getRequest: function() {
    if (!this._request) throw "Must create a request";
    return this._request;
  },
  Create: function(request) {
    var obj = Object.create(DbRequest);
    obj._request = {
      sql: request,
      parameters: []
    };
    return obj;
  },
  AddParameter: function(name, type, value, options) {
    this._getRequest().parameters.push({
      name: name,
      type: type,
      value: value,
      options: options
    });
    return this;
  },
  getExecuter: function() {
    return connect()
      .chain(createRequest(this._getRequest()));
  }
};
module.exports = {
  DbRequest: DbRequest,
  GetConnection: connect,
  createRequest: createRequest
};