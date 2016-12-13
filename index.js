const express = require('express');
const app = express();

app.use(express.static(__dirname + '/public'));

app.post('/publish', (req, res) => {
  res.send('GET request to the homepage');
});

app.post('/update', (req, res) => {
  res.send('POST request to the homepage');
});

app.listen(3000, () => {
  console.log('Assets server start');
});
