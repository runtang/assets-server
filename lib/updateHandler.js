'use strict';

const parseReposInfo = require('./parseReposInfo');
const cloneGithub = require('./cloneGithub');
const copyFiles = require('./copyFiles');

function handler(req, res) {
  parseReposInfo(req.body).then(cloneGithub).then(copyFiles).then(data => {
    res.send('push finished');
  }).catch(err => {
    console.log(err);
    res.send(err);
  });
}

module.exports = handler;
