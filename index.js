var express = require('express');
var app = express();
var fs = require('fs');
var _ = require('lodash');
var users = [];

// Reading from our JSON file
fs.readFile('users.json', {encoding: 'utf8'}, function (err, data) {
  if (err) throw err;

  JSON.parse(data).forEach(function (user) {
    user.name.full = _.startCase(user.name.first + ' ' + user.name.last);
    users.push(user);
  });
});

app.get('/', function (req, res) {
  var linkList = '';
  users.forEach(function (user) {
    linkList += '<a href="/' + user.username + '" >' + user.name.full + '</a><br>';
  });
  res.send(linkList);
});

// Using regular expressions in routes
app.get(/big.*/, function (req, res, next) {
  console.log('BIG USER ACCESS');
  next(); // Passing control to the next route handler
});

// Using path variables
app.get('/:username', function (req, res) {
  var username = req.params.username;
  res.send('<h1>' + username + '</h1>');
});

var server = app.listen(3000, function () {
  console.log('Listening on http://localhost:' + server.address().port);
  console.log("Hit 'Ctrl + C' to stop the server");
});
