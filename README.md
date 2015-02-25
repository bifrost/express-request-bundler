# Express Request Bundler [![Build Status](https://travis-ci.org/jonatanpedersen/express-request-bundler.svg?branch=master)](https://travis-ci.org/jonatanpedersen/express-request-bundler)

Express middleware for bundling requests. 


## Install
```bash
$ npm install express-request-bundler --save
```

## Usage
Imagine you have a REST based API and a SPA that need to access a lot of different endpoints when rendering a page. You would probably want to bundle up some of these requests in order to reduce overall overhead and latency.

Request:
```bash
http://localhost:8080/api/bundle?user1=api/users/1&user2=api/users/2
```

Response:
```json
{
  "user1": {
    "statusCode": 200,
    "headers": {
      "x-powered-by": "Express",
      "content-type": "application/json; charset=utf-8",
      "content-length": "26",
      "etag": "W/\"1a-56b04a0c\"",
      "date": "Wed, 25 Feb 2015 18:02:21 GMT",
      "connection": "keep-alive"
    },
    "body": {
      "id": 1,
      "username": "dave"
    }
  },
  "user2": {
    "statusCode": 200,
    "headers": {
      "x-powered-by": "Express",
      "content-type": "application/json; charset=utf-8",
      "content-length": "29",
      "etag": "W/\"1d-d580b515\"",
      "date": "Wed, 25 Feb 2015 18:02:21 GMT",
      "connection": "keep-alive"
    },
    "body": {
      "id": 2,
      "username": "jessica"
    }
  },
  "errors": false
}
```

The middleware plugs directly in to your existing Express app. You just need to require the module.
```javascript
var erb = require("express-request-bundler");
```

And add a bundle endpoint to your app.
```javascript
app.get('/api/bundle', erb());
```

And you are done.

## Licence
The MIT License (MIT)