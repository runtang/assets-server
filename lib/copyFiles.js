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

function uploadToS3(s3Cfg) {
  let client = s3.createClient({
    maxAsyncS3: 20,
    s3RetryCount: 3,
    s3RetryDelay: 1000,
    multipartUploadThreshold: 20971520,
    multipartUploadSize: 15728640,
    s3Options: {
      accessKeyId: s3Cfg.accessKeyId,
      secretAccessKey: s3Cfg.secretAccessKey
    }
  });
  let params = {
    localDir: s3Cfg.localDir,
    deleteRemoved: true,
    s3Params: {
      Bucket: s3Cfg.bucket,
      Prefix: s3Cfg.dirPrefix
    },
  };
  let uploader = client.uploadDir(params);
  logger.debug('Copy S3 Start:', s3Cfg.localDir, s3Cfg.bucket, s3Cfg.dirPrefix);
  uploader.on('error', err => {
    s3Cfg.onError && s3Cfg.onError(err);
    logger.debug('Copy S3 Failed:', s3Cfg.localDir, s3Cfg.bucket, s3Cfg.dirPrefix);
  });
  uploader.on('progress', () => {
    s3Cfg.onProgress && s3Cfg.onProgress();
    logger.debug('Copy S3 InProgress:', s3Cfg.localDir, s3Cfg.bucket, s3Cfg.dirPrefix, uploader.progressAmount, uploader.progressTotal);
  });
  uploader.on('end', () => {
    logger.debug('Copy S3 Finished:', s3Cfg.localDir, s3Cfg.bucket, s3Cfg.dirPrefix);
    s3Cfg.onEnd && s3Cfg.onEnd();
  });
}

function handler(data) {
  let reposInfo = data.reposInfo;
  let tmpDir = data.tmpDir;
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
          uploadToS3({
            accessKeyId: process.env.ACCESS_KEY_ID,
            secretAccessKey: process.env.SECRET_ACCESS_KEY,
            localDir: publicDir,
            bucket: process.env.BUCKET,
            dirPrefix: path.join(reposInfo.repos.name, reposInfo.version),
            onEnd: () => {
              resolve();
            },
            onError: (err) => {
              reject(err.stack);
            },
            onProgress: () => {}
          });
        }
      });
  });
}

module.exports = handler;
