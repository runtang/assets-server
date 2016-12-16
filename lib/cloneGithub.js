'use strict';

const nodegit = require('nodegit');
const path = require('path');
const logger = require('log4js').getLogger();

function getCloneOption(reposInfo) {
  return {
    checkoutBranch: reposInfo.branch,
    fetchOpts: {
      callbacks: {
        certificateCheck: function() {
          return 1;
        },
        credentials: function(url, userName) {
          return nodegit.Cred.userpassPlaintextNew(process.env.GITHUB_TOKEN, 'x-oauth-basic');
          // return nodegit.Cred.sshKeyFromAgent(userName);
        }
      }
    }
  };
}

function getTmpDir() {
  return path.join('./tmp', new Date().getTime().toString());
}

function handler(data) {
  let reposInfo = data.reposInfo;
  let tmpDir = getTmpDir();
  logger.debug('Clone start:', reposInfo.repos.clone_url, reposInfo.branch);
  return nodegit.Clone(reposInfo.repos.clone_url, tmpDir, getCloneOption(reposInfo))
    .then(repos => {
      logger.debug('Clone end:', reposInfo.repos.clone_url);
      return new Promise((resolve, reject) => {
        data.tmpDir = tmpDir;
        resolve(data);
      });
    });
}

module.exports = handler;
