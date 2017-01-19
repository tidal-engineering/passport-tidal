# passport-tidal [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url] [![Coverage percentage][coveralls-image]][coveralls-url]

[Passport](http://passportjs.org/) strategy for authenticating with [Tidal](https://www.tidal.com/)
using the OAuth 2.0 API.

This module lets you authenticate using Tidal in your Node.js applications.
By plugging into Passport, Tidal authentication can be easily and
unobtrusively integrated into any application or framework that supports
[Connect](http://www.senchalabs.org/connect/)-style middleware, including
[Express](http://expressjs.com/).

## Install

    $ npm install passport-tidal

## Usage

#### Create an Application

Before using `passport-tidal`, you must be registered with an application on
Tidal. Please contact us for more information.

#### Configure Strategy

The Tidal authentication strategy authenticates users using a Tidal
account and OAuth 2.0 tokens.  The app ID and secret obtained when creating an
application are supplied as options when creating the strategy.  The strategy
also requires a `verify` callback, which receives the access token and optional
refresh token, as well as `profile` which contains the authenticated user's
Tidal profile.  The `verify` callback must call `cb` providing a user to
complete authentication.

```js
passport.use(new TidalStrategy({
    clientID: TIDAL_APP_ID,
    clientSecret: TIDAL_APP_SECRET,
    callbackURL: "http://localhost:3000/auth/tidal/callback"
  },
  function(accessToken, refreshToken, profile, cb) {
    User.findOrCreate({ tidalId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));
```

#### Authenticate Requests

Use `passport.authenticate()`, specifying the `'tidal'` strategy, to
authenticate requests.

For example, as route middleware in an [Express](http://expressjs.com/)
application:

```js
app.get('/auth/tidal',
  passport.authenticate('tidal'));

app.get('/auth/tidal/callback',
  passport.authenticate('tidal', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });
```

## Examples

Developers using the popular [Express](http://expressjs.com/) web framework can
refer to an [example](https://github.com/passport/express-4.x-facebook-example)
as a starting point for their own web applications.

## License

Apache-2.0 © [TIDAL]()


[npm-image]: https://badge.fury.io/js/passport-tidal.svg
[npm-url]: https://npmjs.org/package/passport-tidal
[travis-image]: https://travis-ci.org/tidal-engineering/passport-tidal.svg?branch=master
[travis-url]: https://travis-ci.org/tidal-engineering/passport-tidal
[daviddm-image]: https://david-dm.org/tidal-engineering/passport-tidal.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/tidal-engineering/passport-tidal
[coveralls-image]: https://coveralls.io/repos/github/tidal-engineering/passport-tidal/badge.svg?branch=master
[coveralls-url]: https://coveralls.io/github/tidal-engineering/passport-tidal?branch=master
