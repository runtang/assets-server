'use strict';

require('dotenv').config();
require('./lib/initLogger');
const express = require('express');
const bodyParser = require('body-parser');
const pushHandler = require('./lib/pushHandler');
const app = express();
const logger = require('log4js').getLogger();

app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/log'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.get('/ping', (req, res) => {
  res.send('200');
});

app.get('/clone', (req, res) => {
  const cloneGithub = require('./lib/cloneGithub');
  cloneGithub({
    reposInfo: {
      ref: 'refs/heads/dev/0.0.1',
      branch: 'dev/0.0.1',
      version: '0.0.1',
      repos: {
        name: 'InceptionPadNews-front-end',
        ssh_url: 'git@github.com:tanlukang/InceptionPadNews-front-end.git'
      }
      // ref: 'refs/heads/master',
      // branch: 'master',
      // version: '',
      // repos: {
      //   name: 'assets-server',
      //   ssh_url: 'git@github.com:runtang/assets-server.git'
      // }
    }
  }).then(data => {
    logger.debug('Finished:', new Date());
    res.send('clone finished');
  });
});

app.post('/push', pushHandler);

app.listen(process.env.SERVER_PORT, () => {
  logger.debug('Assets Server start at ' + process.env.SERVER_PORT, new Date());
});
