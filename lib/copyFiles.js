'use strict';

const fs = require('fs-extra');
const path = require('path');

function createPublicDir(publicDir) {
  return new Promise((resolve, reject) => {
    fs.ensureDir(publicDir, err => {
      if (err) {
        reject(err);
      } else {
        resolve({});
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
        reject(err);
      } else {
        resolve({});
      }
    });
  });
}

function getPublicDir(name, version) {
  return path.join('./public', name, version);
}

function handler(data) {
  let reposInfo = data.reposInfo;
  let tmpDir = data.tmpDir;
  let publicDir = getPublicDir(reposInfo.repos.name, reposInfo.version);
  return createPublicDir(publicDir)
    .then(copyFileToPublicDir.bind(null, path.join(tmpDir, 'build'), publicDir))
    .then(deleteDir.bind(null, tmpDir));
}

module.exports = handler;
