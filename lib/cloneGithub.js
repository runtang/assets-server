'use strict';

const nodegit = require('nodegit');
const path = require('path');

function getCloneOption(reposInfo) {
  return {
    checkoutBranch: reposInfo.branch,
    fetchOpts: {
      callbacks: {
        certificateCheck: function() {
          return 1;
        },
        credentials: function(url, userName) {
          return nodegit.Cred.sshKeyFromAgent(userName);
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
  return nodegit.Clone(reposInfo.repos.ssh_url, tmpDir, getCloneOption(reposInfo))
    .then(repos => {
      return new Promise((resolve, reject) => {
        data.tmpDir = tmpDir;
        resolve(data);
      });
    });
}

module.exports = handler;
