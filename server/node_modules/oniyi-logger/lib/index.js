'use strict';

// load dependencies

// node core modules
const util = require('util');

// define avaliable loglevels
const logLevels = [{
  label: 'INFO',
  sink: 'out',
}, {
  label: 'WARN',
  sink: 'out',
}, {
  label: 'ERROR',
  sink: 'err',
}];

function Logger(label, options) {
  const self = this;
  const loggerOptions = options || {};
  // default sink to process.stdout
  self.outSink = loggerOptions.outSink && loggerOptions.outSink.write ? loggerOptions.outSink : process.stdout;
  self.errSink = loggerOptions.errSink && loggerOptions.errSink.write ? loggerOptions.errSink : process.stderr;

  // use template based on weather label was provided or not
  if (typeof label === 'string' && label) {
    self.template = util.format('%%s [%s] %%s', label); // level, label, message
    self.label = label;
  } else {
    self.template = '%s %s'; // level, message
  }

  // create methods for each logLevel, writing to the preferred sink
  logLevels.forEach((logLevel) => {
    const sinkName = logLevel.sink ? `${logLevel.sink}Sink` : 'outSink';
    const sink = self[sinkName];
    self[logLevel.label.toLowerCase()] = function writeLevel() {
      self.write(util.format(self.template, logLevel.label, util.format.apply(util, arguments)), sink);
    };
  });

  // Debug logging
  // Note: debug log statements will go th to errSink
  // disable debug per default
  self.debug = function noop() {
    return self;
  };

  // enable debug logging only on loggers with label and if `NODE_DEBUG` contains `label`
  // in a comma or space separated list
  const re = new RegExp(`[\s,]{0,1}${self.label}[\s,]{0,1}`, 'i');
  if (self.label && (loggerOptions.debug || process.env.NODE_DEBUG && re.test(process.env.NODE_DEBUG))) {
    self.debug = function debug() {
      self.write(util.format(self.template, 'DEBUG', util.format.apply(util, arguments)), self.errSink);
      return self;
    };
  }
}

Logger.prototype.write = function loggerWrite(message, sink) {
  // default to outSink
  const activeSink = sink || this.outSink;
  activeSink.write(`${message}\n`);
  return this;
};

Logger.prototype.enableDebug = function enableDebug() {
  const self = this;
  if (!self.label) {
    self.error('can not enable debugging on logger without label');
    return self;
  }
  self.debug = function debug() {
    self.write(util.format(self.template, 'DEBUG', util.format.apply(util, arguments)), self.errSink);
  };
  return self;
};

Logger.prototype.disableDebug = function disableDebug() {
  const self = this;
  self.debug = function noop() {
    return self;
  };
  return self;
};

module.exports = function loggerFactory(label, options) {
  return new Logger(label, options);
};
