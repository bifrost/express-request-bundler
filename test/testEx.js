var request = require('supertest')
	, express = require('express')
	, erb = require("../index.js");

var app = express();


app.get('/api/a', function (req, res) {
	res.setHeader("Content-Type", 'application/json');

	res.write('{"a": "');
	var count = 0;
	function aaa() {
		res.write('aaa');

		count++;
		if (count>10) {
			res.end('"}');
		} else {
			setTimeout(aaa, 10);
		}
	}

	aaa();
});

app.get('/api/b', function (req, res) {
	res.setHeader("Content-Type", 'application/json');

	res.write('{"b": "');
	var count = 0;
	function bbb() {
		res.write('bbb');

		count++;
		if (count>10) {
			res.end('"}');
		} else {
			setTimeout(bbb, 10);
		}
	}

	bbb();
});


app.get('/api/bundle', erb());


describe('when smoke', function() {


	describe('api/a', function () {
		it('should return {"a": "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"}', function (done) {
			request(app)
				.get('/api/a')
				.set('Accept', 'application/json')
				.expect({"a": "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"}, done);
		});
	});

	describe('api/b', function () {
		it('should return {"b": "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb"}', function (done) {
			request(app)
				.get('/api/b')
				.set('Accept', 'application/json')
				.expect({"b": "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb"}, done);
		});
	});

	describe('api/bundle', function() {

		it('should respond with 200', function(done){
			request(app)
				.get('/api/bundle?a=api/a&b=api/b')
				.set('Accept', 'application/json')
				.expect(200)
				.end(done);
		});
	});
});