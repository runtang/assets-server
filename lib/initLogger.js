const log4js = require('log4js');
log4js.configure({
  appenders: [{
    type: 'DateFile',
    filename: 'log/',
    pattern: 'yyyy-MM-dd.log',
    alwaysIncludePattern: true
  }]
});

module.exports = log4js;
