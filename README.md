# Express Request Bundler

[![Build Status](https://travis-ci.org/jonatanpedersen/express-request-bundler.svg?branch=master)](https://travis-ci.org/jonatanpedersen/express-request-bundler)

## Install

```bash
$ npm install express-request-bundler --save
```

## Usage

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