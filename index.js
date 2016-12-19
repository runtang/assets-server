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

app.post('/push', pushHandler);

app.get('/saveToS3', (req, res) => {
  const copyFiles = require('./lib/copyFiles');
  console.log('saveToS3');
  copyFiles({
    reposInfo: {
      type: 'tag',
      ref: 'refs/heads/dev/0.0.1',
      branch: 'dev/0.0.1',
      cloneBranch: 'dev/0.0.1',
      version: '0.0.1',
      repos: {
        name: 'InceptionPadNews-front-end',
        ssh_url: 'git@github.com:tanlukang/InceptionPadNews-front-end.git',
        clone_url: 'https://github.com/tanlukang/InceptionPadNews-front-end.git'
      }
    },
    tmpDir: './tmp/InceptionPadNews-front-end'
  }).then(data => {
    logger.debug('Finished');
    res.send('copy files finish');
  });
});

app.get('/cloneBranch', (req, res) => {
  const cloneGithub = require('./lib/cloneGithub');
  cloneGithub({
    reposInfo: {
      type: 'branch',
      ref: 'refs/heads/dev/0.0.1',
      branch: 'dev/0.0.1',
      cloneBranch: 'dev/0.0.1',
      version: '0.0.1',
      repos: {
        name: 'InceptionPadNews-front-end',
        ssh_url: 'git@github.com:tanlukang/InceptionPadNews-front-end.git',
        clone_url: 'https://github.com/tanlukang/InceptionPadNews-front-end.git'
      }
    }
  }).then(data => {
    logger.debug('Finished');
    res.send('clone branch finished');
  });
});

// app.get('/cloneTag', (req, res) => {
//   const cloneGithub = require('./lib/cloneGithub');
//   cloneGithub({
//     reposInfo: {
//       type: 'tag',
//       ref: 'refs/heads/publish/0.0.1',
//       cloneBranch: 'master',
//       branch: 'publish/0.0.1',
//       version: '0.0.1',
//       repos: {
//         name: 'InceptionPadNews-front-end',
//         ssh_url: 'git@github.com:tanlukang/InceptionPadNews-front-end.git',
//         clone_url: 'https://github.com/tanlukang/InceptionPadNews-front-end.git'
//       }
//     }
//   }).then(data => {
//     logger.debug('Finished');
//     res.send('clone tag finished');
//   });
// });

app.listen(process.env.SERVER_PORT, () => {
  logger.debug('Assets Server start at ' + process.env.SERVER_PORT);
});
