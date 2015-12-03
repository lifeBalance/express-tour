# Hello World app
In this first iteration we are gonna start with a simple *"Hello World"* app.

## A package file
First things first let's initialize a `package.json` file:

```bash
$ npm init -y
```
> The `--yes` (`-y` for short) option initializes a project with the default options and without prompting us with questions.

## Installing Express
Right after let's install [Express.js][l1]:

```bash
$ npm i -S Express
```

> The `--save` (`-S` for short) option saves the package to our `dependencies` list section in `package.json`.

## Entry point
Next let's create an `index.js` file:
```bash
$ touch index.js
```
Where we'll start adding code for a basic *"Hello World"* app:

```js
var express = require('express');
var app = express();

app.get('/', function (req, res) {
  res.send('<h1>Hello World</h1>');
});

var server = app.listen(3000, function () {
  console.log('Listening on http://localhost:' + server.address().port);
  console.log("Hit 'Ctrl + C' to stop the server");
});
```
## npm configuration
Before wrapping up this section let's fill the `scripts` section of our `package.json` file so users of our project can type `npm start` to start our app:

```json
"scripts": {
  "start": "node index.js"
},
```

## Installing nodemon
When developing in [Node.js][l2] we have to restart the server every time we make changes to our configuration, which is pretty often. A way to avoid that is installing [nodemon][l3], which will watch for any changes in the files and will automatically restart our node application every time we save. So:

```bash
$ npm i -D nodemon
```

> The `--save-dev` (`-D` for short) option saves the package to our `devdependencies` list section.

Let's add [nodemon][l3] to our `npm` configuration:
```json
"scripts": {
  "start": "node index.js",
  "dev": "nodemon index.js"
},
```
This way we can run `npm run dev` and have [nodemon][l3] restarting our app when any change is saved.

## Give it a go
To try out the project at this point, you can do:
```bash
$ git checkout tags/v0.1
$ npm run dev
```

---
[:arrow_backward:][back] ║ [:house:][home] ║ [:arrow_forward:][next]

<!-- navigation -->
[home]: ../README.md
[back]: ../README.md
[next]: routing.md

<!-- links -->
[l1]: http://expressjs.com/en/index.html
[l2]: https://nodejs.org/en/
[l3]: http://nodemon.io/
