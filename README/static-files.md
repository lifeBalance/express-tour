# Serving Static Files
Serving static files with [Express][1] is pretty easy. First of all, we have added a bunch of images in a folder named `images` at the root of our project. Now we have to tell Express about this folder:

```js
app.use(express.static('images'));
```

That should be enough to start using the images on our templates, for example:
```html
<img src="{{username}}_sm.jpg">
```

Notice how we have named our image files with the username plus a suffix, in this case `_sm` for smaller images.

## Adding a prefix
Sometimes we may want to use a more descriptive name for some files. A way to do that is add a prefix in our express file:

```js
app.use('/profile-pics', express.static('images'));
```
This way we are sort of mapping a descriptive name in our request path, to an arbitrary directory, in this case `images`.

```html
<img src="profile-pics/{{username}}_sm.jpg">
```

## Styling with Bootstrap
We are gonna take the chance to add some styling to our app using [Bootstrap][2]. It's gonna be just a matter of adding the CDN links for the CSS and scripts to both our pages. Check the source code of any of the templates([here][3] or [here][4]) to see what we've done, nothing too fancy.

## Give it a go
To try out the project at this point, you can do:
```bash
$ git checkout tags/v0.4
$ npm run dev
```

---
[:arrow_backward:][back] ║ [:house:][home] ║ [:arrow_forward:][next]

<!-- navigation -->
[home]: ../README.md
[back]: templates.md
[next]: #

<!-- links -->
[1]: http://expressjs.com/en/index.html
[2]: http://getbootstrap.com/
[3]: https://github.com/lifeBalance/express-tour/blob/v0.4/views/index.hbs
[4]: https://github.com/lifeBalance/express-tour/blob/v0.4/views/user.hbs
