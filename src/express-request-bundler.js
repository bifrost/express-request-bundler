/*
	Express middleware for bundling requests in Express.
*/

var http = require('http');
var url = require('url');

function getParameters(query) {
	var parameters = Object.keys(query).map(function(key) {
		return {
			name: key,
			value: query[key]
		};
	});

	return parameters;
}

function createOptions(originalRequest, newPath) {
	var originalRequestUrl = url.parse(originalRequest.protocol + '://' + originalRequest.headers.host + originalRequest.url);

	var options = {
		method: 'GET',
		path: newPath,
		hostname: originalRequestUrl.hostname,
		port: originalRequestUrl.port,
		headers: originalRequest.headers
	}

	return options;
}

function createPromise(options, output, key) {
	var promise = new Promise(function (resolve, reject) {
		var request = http.request(options, function(response) {
			var statusCode = response.statusCode;

			output.write('"' + key + '": {');
			output.write('"statusCode":' + statusCode + ',');
			output.write('"headers":' + JSON.stringify(response.headers));
			 
			if (statusCode === 200)
				output.write(',"body":');

	      	response
	      		.on('data', function(data) {
	      			if (statusCode === 200)
						output.write(data);		
	      		})
				.on('end', function() {
					output.write('},');

					resolve(statusCode);	
	      		})	
				.on('error', function() {
					resolve(statusCode);
	      		});	
		});


		request.end();
	});

	return promise;
};

function errors(statusCodes)  {
	return statusCodes.filter(function(statusCode) { 
		return statusCode !== 200; 
	}) > 0;
}

var create = function() {
	return function(request, response, next) {
		response.write('{');

		var query = request.query;
		var parameters = getParameters(query);

		var promises = parameters
			.map(function(parameter) {
				var path = '/' + parameter.value;
				var key = parameter.name;
				var options = createOptions(request, path);
				var promise = createPromise(options, response, key);

				return promise;
			});

		Promise.all(promises)
			.then(errors)
			.then(function(errors) {
				response.write('"errors":' + errors);
				response.write('}');
				response.end();

				next();
			});
	}
};

module.exports = create;