const _ = require('lodash');
const logger = require('../logger');

module.exports = {
  'does-not-exist': (val, requestedParserName) => {
    logger.error('requested parser name "%s" is invalid', requestedParserName);
    return val;
  },
  integer: (val, radix) => parseInt(val, radix || 10),
  date: (val) => new Date(val),
  dateParse: (val) => Date.parse(val),
  lowercase: (val) => {
    if (!typeof val === String) {
      return val;
    }
    return val.toLowerCase();
  },
  uppercase: (val) => {
    if (!typeof val === String) {
      return val;
    }
    return val.toUpperCase();
  },
  trim: (val, chars) => _.trim(val, chars),
};
