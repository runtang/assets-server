'use strict';

const fs = require('fs-extra');
const path = require('path');
const logger = require('log4js').getLogger();
const s3 = require('s3');

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

  // let publicDir = getPublicDir(reposInfo.repos.name, reposInfo.version);
  // logger.debug('Copy start:', reposInfo.repos.name, reposInfo.version);
  // return createPublicDir(publicDir)
  //   .then(copyFileToPublicDir.bind(null, path.join(tmpDir, 'build'), publicDir))
  //   .then(deleteDir.bind(null, tmpDir));

  let publicDir = getPublicDir(reposInfo.repos.name, reposInfo.version);
  logger.debug('Copy start:', reposInfo.repos.name, reposInfo.version);
  return new Promise((resolve, reject) => {
    createPublicDir(publicDir)
      .then(copyFileToPublicDir.bind(null, path.join(tmpDir, 'build'), publicDir))
      .then(deleteDir.bind(null, tmpDir))
      .then(() => {
        if (reposInfo.type === 'branch') {
          resolve();
        } else {
          let client = s3.createClient({
            maxAsyncS3: 20,
            s3RetryCount: 3,
            s3RetryDelay: 1000,
            multipartUploadThreshold: 20971520,
            multipartUploadSize: 15728640,
            s3Options: {
              accessKeyId: process.env.ACCESS_KEY_ID,
              secretAccessKey: process.env.SECRET_ACCESS_KEY
            }
          });
          let params = {
            localDir: publicDir,
            deleteRemoved: true,
            s3Params: {
              Bucket: process.env.BUCKET,
              Prefix: path.join(reposInfo.repos.name, reposInfo.version)
            },
          };
          let uploader = client.uploadDir(params);
          uploader.on('error', function(err) {
            reject(err.stack);
            // console.error("unable to sync:", err.stack);
          });
          uploader.on('progress', function() {
            // console.log("progress", uploader.progressAmount, uploader.progressTotal);
          });
          uploader.on('end', function() {
            resolve();
            // console.log("done uploading");
          });
        }
      });
  });
}

module.exports = handler;
