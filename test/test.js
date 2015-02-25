var request = require('supertest')
  , express = require('express')
  , erb = require("../src/express-request-bundler");

var app = express();

var users = [		
	{ id: 0, username: 'dave' },
	{ id: 1, username: 'jessica' },
	{ id: 2, username: 'simon' },
	{ id: 3, username: 'sarah'	}
];

app.get('/api/users/:id', function (req, res, next) {
	res.setHeader("Content-Type", /json/);
	res.json(users[req.params.id]);
    next();
});

app.get('/api/users', function (req, res, next) {
	res.setHeader("Content-Type", /json/);
	res.json(users);
    next();
});

app.get('/api/bundle', erb());


describe('app', function() {
	describe('GET /api/users', function(){
		it('should respond with 200', function(done){
			request(app)
				.get('/api/users')
				.set('Accept', 'application/json')
				.expect('Content-Type', /json/)
				.expect(200, done);
		});
	});
	describe('GET /api/users/1', function(){
		it('should respond with 200', function(done){
			request(app)
				.get('/api/users')
				.set('Accept', 'application/json')
				.expect('Content-Type', /json/)
				.expect(200, done);
		});
	});
});

describe('express-request-bundler', function() {
	describe('GET /api/bundle?users=/api/users&user1=/api/users/1', function(){
		it('should respond with 200', function(done){
			request(app)
				.get('/api/bundle?users=/api/users&user1=/api/users/1')
				.set('Accept', 'application/json')
				.expect(200)
				.end(function(err, res){
			        if (err) 
			        	return done(err);

			    	done();
			    });
		});
	});
});