'use strict';

require('dotenv').config();
require('./lib/initLogger');
const express = require('express');
const bodyParser = require('body-parser');
const updateHandler = require('./lib/updateHandler');
const app = express();
const logger = require('log4js').getLogger();

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.get('/publish', (req, res) => {
  res.send('publish');
});

app.post('/push', updateHandler);

app.listen(process.env.SERVER_PORT, () => {
  logger.debug('Assets Server start at ' + process.env.SERVER_PORT, new Date());
});
