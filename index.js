var express = require('express');
var app = express();
var fs = require('fs');
var _ = require('lodash');
var engines = require('consolidate');
var users = [];

// Reading from our JSON file
fs.readFile('users.json', {encoding: 'utf8'}, function (err, data) {
  if (err) throw err;

  JSON.parse(data).forEach(function (user) {
    user.name.full = _.startCase(user.name.first + ' ' + user.name.last);
    users.push(user);
  });
});

// Templating engine
app.engine('hbs', engines.handlebars);

app.set('views', './views');
app.set('view engine', 'hbs');

app.get('/', function (req, res) {
  res.render('index', {users: users});
});

// Using path variables
app.get('/:username', function (req, res) {
  var username = req.params.username;
  res.render('user.jade', {user: username});
});

var server = app.listen(3000, function () {
  console.log('Listening on http://localhost:' + server.address().port);
  console.log("Hit 'Ctrl + C' to stop the server");
});
