'use strict';

const logger = require('log4js').getLogger();

function getBranchType(ref) {
  let type = '';
  switch (true) {
    case !!ref.match('refs/heads/dev/'):
      type = 'branch'
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
    let branch, cloneBranch, version;
    if (type === 'branch') {
      branch = ref.substring(11);
      cloneBranch = branch;
      version = branch.split('/')[1];
    } else if (type === 'tag') {
      branch = ref.substring(10);
      cloneBranch = 'master';
      version = branch.split('/')[1];
    }
    if (!(type && branch && version)) {
      reject('payload invalid');
    } else {
      logger.debug('Parse end:', branch, version);
      resolve({
        reposInfo: {
          ref,
          type,
          repos: body.repository || {},
          // repos: JSON.parse(body.repository || "{}"),
          branch,
          cloneBranch,
          version
        }
      });
    }
  });
}

module.exports = handler;
