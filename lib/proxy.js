var structr = require("structr"),
step = require("step"),
outcome = require("outcome"),
request = require("request"),
_ = require("underscore");

module.exports = structr({


	/**
	 */

	"__construct": function(recuest) {
		this.recuest = recuest;
	},


	/**
	 */

	"request": function(options, callback) {

		if(!options.suite) options.suite = "default";

		var db = this.recuest.db, on = outcome.error(callback),
		self = this;

		step(

			/**
			 * first check if the data is cached in the given url
			 */


			function() {

				self._getCached(options, this);
			},

			/**
			 */

			on.success(function(content) {

				//content exists? return the twiddled version
				if(content) {
					console.log("returning cached data");
					return self._returnResponse(options, callback);
				}

				console.log("fetching live data...");
				//otherwise make a new http request
				request({
					url: options.url,
					method: options.method,
					headers: _.extend(options.headers, {
						'accept-encoding': 'none'
					})
				}, this);
			}),

			/**
			 * after a request has been made, save it to the DB, and return the twiddled response
			 */

			on.success(function(response, body) {


				console.log("caching response");

				var data = {

					//the url we're proxying
					url: options.url,


					//the suite we're testing - this is the testing group
					suite: options.suite,

					//the short name for the url - used for twiddling responses
					name: options.name,

					//the headers of the response
					headers: response.headers,

					//200? 404?
					statusCode: response.statusCode,

					//the content
					body: new Buffer(body, 'binary').toString('base64')
				}, next = this;

				db.update(data, function() {
					self._returnResponse(options, next);
				});
			}),

			/**
			 */

			callback
		);
	},


	/**
	 * returns the twiddled target response. E.g sending a rate-limited response for testing
	 */

	"_returnResponse": function(options, callback) {
		this.recuest.db.collection.find({$or: [ { name: options.response },{ url: options.url } ]}).toArray(outcome.error(callback).success(function(data) {

			var result = data.pop();
			console.log(result.headers)
			if(!result) return callback(new Error("response does not exist"));

			callback(null, result);
		}));
	},


	/**
	 */

	"_getCached": function(options, callback) {
		var self = this;
		step(
			function() {

				//use the cached version?
				if(options.cache === false) {
					console.log("skip fetch cache");
					return callback();
				}


				console.log("finding cached version of %s", options.url);
				self.recuest.db.findOne({ url: options.url, suite: options.suite, name: options.name }, callback);
			}
		);
	}
});