const express = require('express');
const bodyParser = require('body-parser');
const updateHandler = require('./lib/updateHandler');
const app = express();
const port = 4567;

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.post('/publish', (req, res) => {
  res.send('publish');
});

app.post('/push', updateHandler);

app.listen(port, () => {
  console.log('Assets Server start at ' + port);
});
