'use strict';

const logger = require('log4js').getLogger();

function getBranchType(ref) {
  let type = '';
  switch (true) {
    case !!ref.match('refs/heads/dev/'):
      type = 'dev'
      break;
    case !!ref.match('refs/tags/'):
      type = 'tag'
      break;
  }
  return type;
}

function handler(body) {
  return new Promise((resolve, reject) => {
    let ref = body.ref;
    let type = getBranchType(ref);
    let branch;
    let version;
    if (type === 'dev') {
      branch = ref.substring(11);
      version = branch.split('/')[1];
    } else if (type === 'tag') {
      branch = body.base_ref.substring(11);
      version = branch.split('/')[1];
    }
    if (!(type && branch && version)) {
      reject('payload invalid');
    } else {
      logger.debug('Parse end:', branch, version, new Date());
      resolve({
        reposInfo: {
          ref,
          type,
          repos: body.repository || {},
          // repos: JSON.parse(body.repository || "{}"),
          branch,
          version
        }
      });
    }
  });
}

module.exports = handler;
