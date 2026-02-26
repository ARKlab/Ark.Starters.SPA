var Task = require('data.task');
var R = require('ramda');
var chain = R.chain;

var orElse = f => M => M.orElse(f);

function resultHandler(reject, resolve, connection) {
  return function(err) {
    if (err) {
      connection.err = err;
      reject(connection);
    } else resolve(connection);
  };
}

function beginTransaction(connection) {
  return new Task(function(reject, resolve) {
    connection.beginTransaction(resultHandler(reject, resolve, connection));
  });
}

function commitTransaction(connection) {
  return new Task(function(reject, resolve) {
    connection.commitTransaction(function() {
      connection.release();
      resolve();
    });
  });
}

function rollbackTransaction(connection) {
  return new Task(function(reject) {
    connection.rollbackTransaction(function() {
      connection.release();
      reject(connection.err);
    });
  });
}

function wrapInTransaction(requestFunction) {
	return R.compose(orElse(rollbackTransaction), chain(commitTransaction), requestFunction, chain(beginTransaction));
}

module.exports = {
  wrapInTransaction: wrapInTransaction,
  resultHandler: resultHandler
};