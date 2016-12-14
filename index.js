'use strict';

require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const updateHandler = require('./lib/updateHandler');
const app = express();

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.post('/publish', (req, res) => {
  res.send('publish');
});

app.post('/push', updateHandler);

app.listen(process.env.SERVER_PORT, () => {
  console.log('Assets Server start at ' + process.env.SERVER_PORT);
});
