'use strict';
const parseReposInfo = require('./parseReposInfo');
const cloneGithub = require('./cloneGithub');

function handler(req, res) {
  let reposInfo = parseReposInfo(req.body);
  cloneGithub(reposInfo);
  res.send('push');
}

module.exports = handler;
