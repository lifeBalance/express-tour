# HTTP Verbs
So far we've been working with just a couple of routes that respond to `GET` requests. Obviously [Express][1] is able of handling other HTTP verbs such as `PUT` or `DELETE`.

First of all we have added a new folder named `users` with a bunch of JSON files (one per user) containing info pertaining to each user. This way we are gonna be reading and writing information about users in each of these files and in some cases even deleting them.

## Showing User Location
We want to add more info about the location of each user(Coordinates, city, state and zip code) in each **User Detail** page. But before even thinking about touching the template, we have to extract the information we want to show from our data source, in this case a bunch of JSON files in the recently added `users` folder.

### Getting the path to the files
First we are going to use a function that returns the location of each user's file in our filesystem. Since each of these files is named `<username>.json`, the resulting filenames look something like `bigkahuna69.json`, `yellowdow123.json` and so on. The function receives as an **argument** a `username`, and builds up the path to the file concatenating:

* The `users` directory.
* The `username` argument.
* The `.json` extension.

```js
function getUserFilePath (username) {
  return path.join(__dirname, 'users', username) + '.json';
}
```

This function to work requires the `path` module, so don't forget to add it at the top:

```js
var path = require('path');
```

### Extracting the info
The `getUser` function is gonna be called from a route, which will pass a `username` obtained from the request. This is what the function looks like:

```js
function getUser (username) {
  var user = JSON.parse(fs.readFileSync(getUserFilePath(username), {encoding: 'utf8'}));
  user.name.full = _.startCase(user.name.first + ' ' + user.name.last);
  _.keys(user.location).forEach(function (key) {
    user.location[key] = _.startCase(user.location[key]);
  });
  return user;
}
```

* In the first line we are parsing the JSON file.
* The second builds up a `full` property out of the `first` and `last` properties.
* Then we use **lodash** for iterating over the properties of the `location` object and attach them to a `user` object that we return in the last line. This is how one of these `user` objects would look like:

```json
{
  "name": {
    "full": "John Doe"
  },
  "location": {
    "street": "2125 taylor st",
    "city": "el paso",
    "state": "arkansas",
    "zip": "65375"
  }
}
```

### Modifying the route
Now we are going to modify the route to add the call to the function we just defined:

```js
app.get('/:username', function (req, res) {
  var username = req.params.username;
  var user = getUser(username);
  res.render('user', {
    user: user,
    address: user.location
  });
});
```

First of all we are getting the `username` out of a request variable, and then we pass it as an argument in the call to `getUser()`. All the info returned by this call is stored in the `user` variable which we use inside the `render` method.

### Retouching the templates
We have added some markup to our `user.hbs` view, which uses a bit of [Bootstrap][2] magic. Check the source code [here][] to see the whole thing, here's an excerpt of the **Name** field:
```html
<div class="form-group">
  <label for="name" class="col-sm-2 control-label">Name</label>
  <div class="col-sm-10 view">
    <p class="form-control-static">{{user.name.full}}</p>
  </div>

  <div class="col-sm-10 edit">
    <input type="email" class="form-control" id="name" placeholder="{{user.name.full}}">
  </div>
</div>
```
It's a [Bootstrap][2] **form-group** component, with 2 divs inside:

1. The first div has the `info` class, and it's the user's info that the page shows by default.
2. We have given the `edit` class to the second div, and added a style in our `main.css` file to hide this div using a `display: none;` rule, meaning that by default this div is invisible. This second div contains an input field that allows us to edit the **Name** property.

As you can see we have added two buttons under the user's picture:

1. The **Edit** button
2. The **Delete** button

### Wiring up the Edit and Cancel buttons
Clicking the **Edit** button will enable the input fields with the `edit` class and will disable the divs with the `info` class. It will also enable the **Save** and **Cancel** buttons under the user's info.

This is the function that accomplish that:
```js
<script>
  function edit () {
    $('.info').hide();
    $('.edit').show();
    $('input[value="Save"], input[value="Cancel"]').prop('disabled', false);
    $('button:contains(Edit), button:contains(Delete)').prop('disabled', true);
  }

  ...
</script>
```
Once the form to edit the user's info is enabled, the user can change her mind and click the **Cancel** button, which will trigger this function:
```js
<script>
  ...

  function cancelIt () {
    $('.info').show()
    $('.edit').hide()
    $('input[value="Save"], input[value="Cancel"]').prop('disabled', true);
    $('button:contains(Edit), button:contains(Delete)').prop('disabled', false);
  }
</script>
```

Now could be a good moment to run our app and see how it's looking:
```bash
$ npm run dev
```

## Updating User information
Once the user has filled the form and clicks the **Save** button, the browser will **URL encode** all the info before submitting it to the server.

### Url Encoding
This is because URLs can only be sent over the Internet using the ASCII character-set. Since URLs often contain characters outside the ASCII set, the URL has to be encoded into a valid ASCII format suitable to be transferred.

> **URL encoding** replaces unsafe ASCII characters with a `%` followed by two hexadecimal digits. Spaces are replaced with space with a plus  sign (`+`) or with `%20`.

### Url Decoding
The encoded info travels to the server in the body of the request, once it's received in the server we need a way of parsing the request body to extract all this info.

There's a package named [body-parser][4] that got us covered. Let's install it:
```bash
$ npm i -S body-parser
```
And require it:
```js
var bodyParser = require('body-parser');
```

We also have configuration setting to make `bodyParser` decode the request body. It's something like this:
```js
app.use(bodyParser.urlencoded({ extended: true });
```
> It's important to make sure we place this middleware **after** our static files middleware.

### A PUT Route
Now it's time to define a route to handle `PUT` requests:

```js
app.put('/:username', function (req, res) {
  var username = req.params.username;
  var user = getUser(username);
  user.location = req.body;
  saveUser(username, user);
  res.end();
});
```
Notice that we are using a function named `saveUser` that will update the user's info in the server's filesystem, this is what it looks like:

```js
function saveUser (username, data) {
  var fp = getUserFilePath(username);
  fs.unlinkSync(fp); // delete the file
  fs.writeFileSync(fp, JSON.stringify(data, null, 2), {encoding: 'utf8'});
}
```

This function receives two arguments:

1. A `username`, passed to the `getUserFilePath` to get back the user's file.
2. The `data` received in the request, automatically decoded by `bodyParse`.

The next to last line deletes the file and the last line writes a new one in JSON format.

### A jQuery script
In order to send the data when the **Save** button is push, we have added a jQuery script which uses AJAX to submit the data and update the user info without refreshing the whole page. This is the contents:

```js
function saveIt () {
  $.ajax('/{{user.username}}', {
    method: 'PUT',
    data: {
      // name: $('#name').val(),
      street: $('#street').val() || $('#streetVal').text(),
      city:   $('#city').val()   || $('#cityVal').text(),
      state:  $('#state').val()  || $('#stateVal').text(),
      zip:    $('#zip').val()    || $('#zipVal').text()
    },
    complete: function () {
      data.reload();
      cancelIt();
    }
  })
}
```
## Deleting a User
Finally, we are going to add functionality for deleting a user. This is the route:

```js
app.delete('/:username', function (req, res) {
  var fp = getUserFilePath(req.params.username);
  fs.unlinkSync(fp); // Deleting the file
  res.sendStatus(200);
});
```
And  this is the jQuery script we have used in the `user.hbs` template:

```js
function del () {
  $.ajax('/{{user.username}}', {
    method: 'DELETE',
    complete: function () {
      location = '/'
    }
  })
}
```
:bomb: Problem is that just with these two functions, even though the user gets deleted, if we go to our index page, we'll be able to see listed the user we just deleted, and if we click on it we'll get an error because that file doesn't exist. :interrobang:

### Refactoring
The reason is that we have to :negative_squared_cross_mark: **delete the old function** that preloads the list of users when the app starts up:

```js
var users = [];
...

fs.readFile('users.json', {encoding: 'utf8'}, function (err, data) {
  if (err) throw err;

  JSON.parse(data).forEach(function (user) {
    user.name.full = _.startCase(user.name.first + ' ' + user.name.last);
    users.push(user);
  });
});
```
#### The new root route
And we also have to modify the **root route** so check this code:
```js
app.get('/', function (req, res) {
  var users = [];
  fs.readdir('users', function (err, files) {
    files.forEach(function (file) {
      fs.readFile(path.join(__dirname, 'users', file), {encoding: 'utf8'}, function (err, data) {
        var user = JSON.parse(data);
        user.name.full = _.startCase(user.name.first + ' ' + user.name.last);
        users.push(user);
        if (users.length === files.length ) res.render('index', {users: users});
      });
    });
  });
});
```

Now when a user is deleted we are redirected to the root route, and that user is not there anymore. :shipit:

## Give it a go
To try out the project at this point, you can do:
```bash
$ git checkout tags/v0.5
$ npm run dev
```

---
[:arrow_backward:][back] ║ [:house:][home] ║ [:arrow_forward:][next]

<!-- navigation -->
[home]: ../README.md
[back]: static-files.md
[next]: #

<!-- links -->
[1]: http://expressjs.com/en/index.html
[2]: http://getbootstrap.com/
[3]: https://github.com/lifeBalance/express-tour/blob/v0.5/views/user.hbs
[4]: https://www.npmjs.com/package/body-parser
