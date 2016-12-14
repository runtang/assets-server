'use strict';

const sha1 = require('sha1');

module.exports = (req) => {
  let sign = req.get('X-Hub-Signature');
  return sign ? (sign === `sha1=${sha1(process.env.WEBHOOK_SECRET)}`) : true;
};
