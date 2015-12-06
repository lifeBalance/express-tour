var express = require('express');
var app = express();
var fs = require('fs');
var path = require('path');
var _ = require('lodash');
var engines = require('consolidate');
var bodyParser = require('body-parser');

/********************
* Accessing the data
********************/

// Path to the user file
function getUserFilePath (username) {
  return path.join(__dirname, 'users', username) + '.json';
}

// Reading the users files
function getUser (username) {
  var user = JSON.parse(fs.readFileSync(getUserFilePath(username), {encoding: 'utf8'}));
  user.name.full = _.startCase(user.name.first + ' ' + user.name.last);
  _.keys(user.location).forEach(function (key) {
    user.location[key] = _.startCase(user.location[key]);
  });
  return user;
}

// Updating the user file
function saveUser (username, data) {
  var fp = getUserFilePath(username);
  fs.unlinkSync(fp); // delete the file
  fs.writeFileSync(fp, JSON.stringify(data, null, 2), {encoding: 'utf8'});
}


// Templating engine
app.engine('hbs', engines.handlebars);

app.set('views', './views');
app.set('view engine', 'hbs');


// Middleware A: Static Files
app.use(express.static('public'));

// Middleware B: Parsing Body requests
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.get('/', function (req, res) {
  var users = [];
  fs.readdir('users', function (err, files) {
    files.forEach(function (file) {
      fs.readFile(path.join(__dirname, 'users', file), {encoding: 'utf8'},
        function (err, data) {
          var user = JSON.parse(data);
          user.name.full = _.startCase(user.name.first + ' ' + user.name.last);
          users.push(user);
          if (users.length === files.length ) res.render('index', {users: users});
        }
      );
    });
  });
});

// GET request
app.get('/:username', function (req, res) {
  var username = req.params.username;
  var user = getUser(username);
  res.render('user', {
    user: user,
    address: user.location
  });
});

// PUT request
app.put('/:username', function (req, res) {
  var username = req.params.username;
  var user = getUser(username);
  user.location = req.body;
  saveUser(username, user);
  res.end();
});

// DELETE request
app.delete('/:username', function (req, res) {
  var fp = getUserFilePath(req.params.username);
  fs.unlinkSync(fp); // Deleting the file
  res.sendStatus(200);
});

var server = app.listen(3000, function () {
  console.log('Listening on http://localhost:' + server.address().port);
  console.log("Hit 'Ctrl + C' to stop the server");
});
