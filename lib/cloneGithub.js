'use strict';

const nodegit = require('nodegit');
const path = require('path');
const fs = require('fs-extra');

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

function createPublicDir(publicDir) {
  return new Promise((resolve, reject) => {
    fs.ensureDir(publicDir, err => {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        resolve({
          publicDir
        });
      }
    });
  });
}

function copyFileToPublicDir(srcDir, dstDir) {
  return new Promise((resolve, reject) => {
    fs.move(srcDir, dstDir, {
      clobber: true
    }, err => {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        resolve({});
      }
    });
  });
}

function deleteDir(tmpDir) {
  return new Promise((resolve, reject) => {
    fs.remove(tmpDir, err => {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        resolve({});
      }
    });
  });
}

function clone(reposInfo) {
  console.log(reposInfo);
  let tmpDir = getTmpDir();
  nodegit.Clone(reposInfo.repos.ssh_url, tmpDir, getCloneOption(reposInfo))
    .then(repos => {
      createPublicDir(path.join('./public', reposInfo.repos.name, reposInfo.version))
        .then(data => copyFileToPublicDir(path.join(tmpDir, 'build'), data.publicDir))
        .then(deleteDir.bind(null, tmpDir))
    })
    .catch(function(err) {
      console.log(err);
    });
}

module.exports = clone;
