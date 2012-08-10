var structr = require("structr"),
step = require("step"),
outcome = require("outcome"),
request = require("request");

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
					return this._returnResponse(options, content, callback);
				}

				//otherwise make a new http request
				request({
					url: options.url,
					method: options.method,
					headers: options.headers
				}, this);
			}),

			/**
			 * after a request has been made, save it to the DB, and return the twiddled response
			 */

			on.success(function(response, body) {

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
					body: body
				}, next = this;

				db.update(data, function() {
					self._returnResponse(options, data, next);
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

	"_returnResponse": function(options, data, callback) {
		this.db.collection.find({$or:[{ response: options.response }, { url: options.url }]}, outcome.error(callback).success(function(data) {
			callback(null, data);
		}));
	},


	/**
	 */

	"_getCached": function(options, callback) {
		step(
			function() {

				//use the cached version?
				if(options.cache === false) {
					return callback();
				}


				db.find({ url: options.url, suite: options.suite, name: options.name }, this);
			},

			callback
		);
	}
});