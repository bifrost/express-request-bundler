# Express Request Bundler

## Install

```bash
$ npm install express-request-bundler --save
```

## Usage

_Notice_ that express-ab requires the [cookie-parser](https://www.npmjs.org/package/cookie-parser) middleware to remember which variant the user was served.

```javascript

var app = require('express')();
var erb = require('./src/express-request-bundler');

app.get('/api/users/:id', function (req, res, next) {
  db.users(req.params.id).then(user) {
    res.json(user);
  }
});

app.get('/api/users', function (req, res, next) {
  db.users().then(users) {
    res.json(users);
  }
});

app.get('/api/bundle', erb());

var server = app.listen(3000);
```

## Licence
The MIT License (MIT)