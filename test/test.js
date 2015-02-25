var request = require('supertest')
  , express = require('express')
  , erb = require("../index.js");

var app = express();

var users = [		
	undefined,
	{ id: 1, username: 'dave' },
	{ id: 2, username: 'jessica' },
	{ id: 3, username: 'simon' },
	{ id: 4, username: 'sarah' }
];

app.get('/api/users/:id', function (req, res, next) {
	var user = users[req.params.id];
	
	if (user) {
		res.setHeader("Content-Type", 'application/json');	
		res.json(user);
	} else {
		res.sendStatus(404);
	}

    next();
});

app.get('/api/users', function (req, res, next) {
	res.setHeader("Content-Type", 'application/json');
	res.json(users);
    next();
});

app.get('/api/bundle', erb());


describe('api', function() {
	describe('GET /api/users', function(){
		it('should respond with users', function(done){
			request(app)
				.get('/api/users')
				.expect(users, done);
		});		
		it('should respond with 200', function(done){
			request(app)
				.get('/api/users')
				.set('Accept', 'application/json')
				.expect(200, done);
		});
		it('should respond with content-type application/json', function(done){
			request(app)
				.get('/api/users')
				.set('Accept', 'application/json')
				.expect('Content-Type', /json/, done);
		});		
	});
	describe('GET /api/users/1', function(){
		it('should respond with users[1]', function(done){
			request(app)
				.get('/api/users/1')
				.expect(users[1], done);
		});
		it('should respond with status code 200', function(done){
			request(app)
				.get('/api/users/1')
				.expect(200, done);
		});
		it('should respond with content-type application/json', function(done){
			request(app)
				.get('/api/users')
				.set('Accept', 'application/json')
				.expect('Content-Type', /json/, done);
		});			
	});
	describe('GET /api/users/0', function(){
		it('should respond with status code 404', function(done){
			request(app)
				.get('/api/users/0')
				.expect(404, done);
		});	
		it('should respond with Not Found in body', function(done){
			request(app)
				.get('/api/users/0')
				.expect('Not Found', done);
		});		
	});	
});

describe('express-request-bundler', function() {
	describe('GET /api/bundle?users=/api/users&user1=/api/users/1', function(){
		
		it('should respond with 200', function(done){
			request(app)
				.get('/api/bundle?users=/api/users&user1=/api/users/1')
				.set('Accept', 'application/json')
				.expect(200, done);
		});
		it('should respond with content-type application/json', function(done){
			request(app)
				.get('/api/bundle?users=/api/users&user1=/api/users/1')
				.set('Accept', 'application/json')
				.expect('Content-Type', /json/, done);
		});
		it('should set errors to false when all resources are found', function(done){
			request(app)
				.get('/api/bundle?users=api/users&user1=api/user/1&user3=api/user/3')
				.expect(hasErrors)
			    .end(done);

			    function hasErrors(res) {
			    	if (res.body.errors)
			    		return "errors should be false";
			    }
		});
		it('should set errors to true when one resource is not found', function(done){
			request(app)
				.get('/api/bundle?users=api/users&roles=api/roles')
				.expect(hasErrors)
			    .end(done);

			    function hasErrors(res) {
			    	if (!res.body.errors)
			    		return "errors should be true";
			    }
		});
		it('should set resource statusCode to 200 when resource was found', function(done){
			request(app)
				.get('/api/bundle?user=api/users/3')
				.expect(isOk)
			    .end(done);

			    function isOk(res) {
			    	if (res.body.user.statusCode !== 200)
			    		return 'expected 200, found ' + res.body.user.statusCode;
			    }
		});
		it('should set resource statusCode to 404 when resource was not found', function(done){
			request(app)
				.get('/api/bundle?user=api/users/0')
				.expect(isOk)
			    .end(done);

			    function isOk(res) {
			    	if (res.body.user.statusCode !== 404)
			    		return 'expected 404, found ' + res.body.user.statusCode;
			    }
		});
		it('should set not set resource body when resource was not found', function(done){
			request(app)
				.get('/api/bundle?user=api/users/0')
				.expect(isOk)
			    .end(done);

			    function isOk(res) {
			    	if (res.body.user.body !== undefined)
			    		return 'expected undefined, found ' + res.body.user.body;
			    }
		});
	});
});