'use strict';

const parseReposInfo = require('./parseReposInfo');
const cloneGithub = require('./cloneGithub');
const copyFiles = require('./copyFiles');
const logger = require('log4js').getLogger();

function handler(req, res) {
  logger.debug('Webhook:', req.body, new Date());
  parseReposInfo(req.body).then(cloneGithub).then(copyFiles).then(data => {
    logger.debug('Finished:', new Date());
    res.send('push finished');
  }).catch(err => {
    logger.debug('Error:', err, new Date());
    res.send(err);
  });
  // res.send('push finished, prosessing...');
}

module.exports = handler;
