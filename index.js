var express = require('express');
var app = express();

app.get('/', function (req, res) {
  res.send('<h1>Hello World!</h1>');
});

var server = app.listen(3000, function () {
  console.log('Listening on http://localhost:' + server.address().port);
  console.log("Hit 'Ctrl + C' to stop the server");
});
