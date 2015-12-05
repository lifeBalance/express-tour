# Templates
[Express][1] has built-in support for the [JADE][2] templating engine. Once it's installed:

```bash
npm i -S jade
```

Using it is just a matter of setting a couple of lines in our `index.js`, (no need to require it):

```js
app.set('views', './views');
app.set('view engine', 'jade');
```

In the first line we set the folder where we're gonna keep our templates, and the second one which template engine we intend to use. If the `view engine` property is not set, you must specify the extension of the view file(in our routes). Otherwise, you can omit it.

## But I don't like Jade
If we're not happy using [JADE][2], we can always use another engin. The process is a bit different depending on if you are using the [Express generator][4] to create your application, or if you are working on an already existing app.

### Using the generator
At the moment of writing this, the [Express generator][4] includes support out of the box for the following templating engines:

Templating Engine | Options          | Package used
------------------|------------------|--------------
[JADE][2]         | **Default**      | [jade][2a]
[Handlebars][3]   | `--hbs`          | [hbs][5]
[EJS][9]          | `--ejs` (`-e`)   | [ejs][10] (TJ's implementation)
[Hogan][11]       | `--hogan` (`-H`) | [hulk-hogan][12]

For any of these engines, once the app has been generated, we just have to use `npm install` to take care of all the dependencies, including the templating engine, no need of installing manually, and no need of requiring it in our entry point either. For example, for using [Handlebars][3] we would do:

```bash
$ express myapp --hbs
```

If you have used the [Express generator][4] to create your app, but don't want to use any of the above listed engines, no problem, there are a lot more possibilities. Check [here][13] for a full list. The only thing, is that you'll have to install the engine manually, in the next section we explain how.

### I already have an app
Since we already have an app in place, we can't use the generator so we'll have to install manually the engine of choice. We want to use [Handlebars][3], and there are several Handlebars engines available for [Express][1]:

* [hbs][5], this package adapts [Handlebars][3] to be used with [Express][1].
* [express-handlebars][6], the same with support for layouts.
* [consolidate][7], let's talk about this next.

### Consolidate
The last one is not a template engine per se, but an adaptor library that allows us to use a long list of engines in [Express][1]. Check the list of supported engines in the [consolidate][8] repo. Let's install it:

```bash
npm i -S consolidate
```
And don't forget to require it. We are gonna use a variable named `engines`:

```js
var engines = require('consolidate');
```
The engines themselves are not included, so we still have to **install the engine** we intend to use. Let's go with [Handlebars][3]:

```bash
npm i -S handlebars
```

> No need to require the engine itself, we sort of did that when requiring `consolidate`.

And add a couple of settings to use the engine:
```js
app.engine('hbs', engines.handlebars);

app.set('views', './views');
app.set('view engine', 'hbs');
```

Note that we still can use **jade templates** in those routes we choose to, we just have to specify the `.jade` extension at the end of the template's filename. For example, check the following route:

```js
app.get('/:username', function (req, res) {
  var username = req.params.username;
  res.render('user.jade', {user: username});
});
```
See that last line? even though we are using `handlebars` as our default engine, we can still use Jade templates, we just have to specify the extension, that's all.

## Give it a go
To try out the project at this point, you can do:
```bash
$ git checkout tags/v0.3
$ npm run dev
```

---
[:arrow_backward:][back] ║ [:house:][home] ║ [:arrow_forward:][next]

<!-- navigation -->
[home]: ../README.md
[back]: routing.md
[next]: static-files.md

<!-- links -->
[1]: http://expressjs.com/en/index.html
[2]: http://jade-lang.com/
[2a]: https://github.com/jadejs/jade
[3]: http://handlebarsjs.com/
[4]: http://expressjs.com/en/starter/generator.html
[5]: https://github.com/donpark/hbs
[6]: https://github.com/ericf/express-handlebars
[7]: https://github.com/tj/consolidate.js
[8]: https://github.com/tj/consolidate.js#supported-template-engines
[9]: http://ejs.co/
[10]: https://github.com/tj/ejs
[11]: http://twitter.github.io/hogan.js/
[12]: https://github.com/quangv/hulk-hogan
[13]: https://github.com/strongloop/express/wiki#template-engines
