'use strict';

const oniyiLogger = require('oniyi-logger');
const pkg = require('../package.json');

module.exports = oniyiLogger(pkg.name);
