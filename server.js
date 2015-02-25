
var util = require('util');
var express = require('express');
var app = express();
var multi = require('../src/multi2');
var db = require('../test/db');
var http = require('http');

function createResourceEndPoints(resourceType) {
  app.get('/api/' + resourceType, function (req, res, next) {
    db().getData().then(function(data) {
      var resources = data[resourceType];
    
      if (resources) {
        res.send(resources);
      } else {
        res.sendStatus(404);
      }

      next();
    });
  });

  app.get('/api/' + resourceType + '/:id', function (req, res, next) {
     var resourceId = req.params.id;

    db().getData().then(function(data) {
      var resource = data[resourceType].filter(function(resource) { 
        return resource.id == resourceId; 
      })[0];

      if (resource) {
        res.send(resource);

      } else {
        res.sendStatus(404);
      }

      next();
    });
  });
}

function peeker(label) {
  return function before(request, response, next) {
    console.info(label, ':', request.url);
    next();
  }
}

app.use('/api', peeker('before'));
db().getTypes().forEach(createResourceEndPoints);
app.get('/api/multi', multi());
app.use('/api', peeker('after'));

var server = app.listen(3000);