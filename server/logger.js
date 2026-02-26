var tedious = require('tedious');
var types = tedious.TYPES;
var Connection = tedious.Connection;
var Task = require('data.task');
var util = require('util');
var winston = require('winston');
var moment = require('moment');
var os = require('os');
var nlogConnectionString = require('./Request/config').nlogConnectionString;
var Request = require('./Request/Request');


var config;
if (nlogConnectionString) {
  config = {
    server: nlogConnectionString.match(/source=([^,]*),/)[1],
    authentication: {
      type: 'default',
      options: {
        userName: nlogConnectionString.match(/id=([^;]*);/)[1],
        password: nlogConnectionString.match(/password=([^;]*);/)[1]
      }
    },
    options: {
      encrypt: true,
      database: nlogConnectionString.match(/catalog=([^;]*);/)[1],
      trustServerCertificate: false
    }
  };
}

function connect() {
  if (!config) {
    return new Task((reject, resolve) => {
      reject(new Error('Database pool not configured'));
    });
  }
  return new Task((reject, resolve) => {
    var connection = new Connection(config);
    connection.on('connect', function(err) {
      if (err) reject(err);
      else resolve(connection);
    });
    connection.connect();
  });
}

var CustomLogger = winston.transports.CustomLogger = function(file) {
  this.name = 'customLogger';
  this.file = file;
  this.level = 'info';
};

//
// Inherit from `winston.Transport` so you can take advantage
// of the base functionality and `.handleExceptions()`.
//
util.inherits(CustomLogger, winston.Transport);

CustomLogger.prototype.log = function(level, msg, meta, callback) {
  var request = Request.DbRequest.Create(`insert into [K4View_Admin] (
            [TimestampUtc]
           ,[LogLevel]
           ,[Logger]
           ,[Callsite]
           ,[AppName]
           ,[RequestID]
           ,[Host]
           ,[Message])
     VALUES
           (@timestamp
           ,@loglevel
           ,@logger
           ,@stack
           ,@app
           ,@reqId
           ,@host
           ,@message)`)
    .AddParameter("timestamp", types.DateTime, new Date())
    .AddParameter("loglevel", types.NVarChar, level)
    .AddParameter("logger", types.NVarChar, this.file.split("\\").slice(-1)[0])
    .AddParameter("app", types.NVarChar, "Admin")
    .AddParameter("reqId", types.UniqueIdentifier, meta.req ? meta.req.id : null)
    .AddParameter("host", types.NVarChar, os.hostname())
    .AddParameter("stack", types.NVarChar, meta.stack)
    .AddParameter("message", types.NVarChar, meta.message || msg);

  connect()
  .chain(Request.createRequest(request._getRequest()))
  .fork(callback, () => callback(null, true));
};
var logger = function(file) {
   var logger = new(winston.Logger)({
     exitOnError: false,
     transports: [
       new(winston.transports.Console)({}),
       new(winston.transports.CustomLogger)(file),
       new(winston.transports.File)({
         App: "Admin",
         handleExceptions: true,
         json: false,
         filename: 'debug.log',
         formatter: function(options) {
           return JSON.stringify({
             TimestampUTC: moment.utc().format("YYYY-MM-DD HH:MM:ss.SSS"),
             loglevel: options.level,
             AppName: 'test',
             location: file.split("\\").slice(-1)[0],
             Callsite: options.meta.stack,
             Host: os.hostname(),
             Message: options.meta.message
           }, null, 2);
         }
       })
     ]
   });
   return logger;
 };
 module.exports = logger;