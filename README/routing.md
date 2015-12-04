# Routing
In this section we are gonna define dynamic routes and see how to extract route parameters from requests.

## Installing lodash
Even though it's not strictly required, the [lodash][4] utility library comes in handy for a lot of things. We are gonna use it, so install it with:
```bash
npm i -S lodash
```

And require it in your `index.js`:
```js
var _ = require('lodash');
```

## Reading files from disk
Also we're going to be using some [Node.js][2] functionality to read files from our disk, so be sure to require the [File System module][3]:
```js
var fs = require('fs');
```

The `readFile` method reads **asynchronously** the entire contents of a file:

```js
fs.readFile('users.json', {encoding: 'utf8'}, function (err, data) {
  if (err) throw err;

  // Do some stuff
});
```

There are 3 **arguments** being passed to this method:

1. Obviously the **file** we intend to open.
2. As a second argument we can pass some **options**:

  * As a **string** with the encoding we want to open the file. If no encoding is specified, then the raw buffer is returned.
  * As an **object**, with different options, in this case the encoding.

3. The callback function is passed two arguments: `err` and `data`, where data is the contents of the file and `err` stands for any error that may arise during the reading operation.

## Parsing JSON
Since the file we are opening contains `JSON` data, we are gonna need to parse it. We don't need any external module for that since the [V8 engine][5] has a built-in **JSON global object** which is available in [Node.js][2].

This is how we are dealing with the file:
```js
JSON.parse(data).forEach(function (user) {
  user.name.full = _.startCase(user.name.first + ' ' + user.name.last);
  users.push(user);
});
```
1. We `parse` the contents of the `data` variable (Contains the data we read from the file).
2. Iterate over the array of objects and pass each `user` to an anonymous function.
3. Inside this function notice the use of the `_.startCase` method (from lodash) for capitalizing the users `first` and `last` names into a new property called `user.name.full`.
4. Finally, on each iteration we push each user into the `users` array.

Check here the [JSON file](../users.json) we are using.

## The root route
For the root route we want to generate a list of links with the **full names** of every user in the `users` array. Each of these links will take us for a detail view of each of these users. This is the root route:

```js
app.get('/', function (req, res) {
  var linkList = '';
  users.forEach(function (user) {
    linkList += '<a href="/' + user.username + '" >' + user.name.full + '</a><br>';
  });
  res.send(linkList);
});
```

The `linkList` variable is a string that we'll increment gradually. On every iteration over the `users` array, we build an **anchor** HTML element and add it to `linkList`. This list is what we send on the response.

## Dynamic routes
We have several ways of creating dynamic routes: using path variables or regular expressions.

### Path variables
Each of the links of the root page points to a different path, for example:
```html
<a href="/crazypeacock512" >Mary Jones</a><br>
<a href="/crazytiger134" >Alan Walters</a><br>
<a href="/blackpanda974" >Miriam Wallace</a><br>
...
```
If we click of the first one we are taken to `http://localhost:3000/crazypeacock512`. So what if at any give point we want to extract part of the path. We can do that using **path variables**, which are created preceding a segment of the path with a **colon**. These segments will be available in the `params` object:

```js
app.get('/:username', function (req, res) {
  var username = req.params.username;
  res.send('<h1>' + username + '</h1>');
});
```
The value of the variable `username` is extracted from the `params` object. Then we are just sending this value back wrapped in an `h1` tag.

### Regular expressions in route definitions
We can also use regular expressions in route definitions. Routes defined this way will work on any request that matches the regular expression, for example:

```js
app.get(/big.*/, function (req, res, next) {
  console.log('BIG USER ACCESS');
  next(); // Passing control to the next route handler
});
```
The above route will match requests to:

* http://localhost:3000/bigkoala328
* http://localhost:3000/bigladybug498

and so on...

Every time we receive a matching request we print the message `'BIG USER ACCESS'` to the console. It's important to put this route above the `app.get('/:username',` route, otherwise all requests will be handled by this route and we'll never get a match in our regular expression route.

> You may be asking yourself, then all requests that match the regular expression will not be handled by the routes below. Keep reading to find out.

### The next() method
In the route from previous section, notice the use of the `next()` method. The `next()` method is defined in the [connect][6] which is the HTTP server framework in which [Express][1] is built upon.

This method is passing control to the next route match if any, so in our example, a request to say `/bigkahuna69` will be matched by the regular expression route and then passed along to our `app.get('/:username',` route which will respond sending the username in an `h1` element.

## Give it a go
To try out the project at this point, you can do:
```bash
$ git checkout tags/v0.2
$ npm run dev
```

---
[:arrow_backward:][back] ║ [:house:][home] ║ [:arrow_forward:][next]

<!-- navigation -->
[home]: ../README.md
[back]: hello-world.md
[next]: templates.md

<!-- links -->
[1]: http://expressjs.com/en/index.html
[2]: https://nodejs.org/en/
[3]: https://nodejs.org/api/fs.html#fs_fs_open_path_flags_mode_callback
[4]: https://lodash.com/
[5]: https://code.google.com/p/v8/
[6]: https://github.com/senchalabs/connect
