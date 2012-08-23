var structr = require("structr"),
step = require("step"),
outcome = require("outcome"),
request = require("request"),
_ = require("underscore"),
logger = require("./utils/logger"),
Twiddler = require("./twiddler");

module.exports = structr({


	/**
	 */

	"__construct": function(recuest, options) {
		this.recuest = recuest;
		this._logger = logger.coloredLogger();

		var twiddle = options.twiddle || {};

		this.requestTwiddler = new Twiddler({
			twiddle: twiddle.request
		});

		this.responseTwiddler = new Twiddler({
			twiddle: twiddle.response
		});


		this.requestTwiddler.set({
			profile: undefined
		}, {
			$set: {
				profile: options.profile
			}
		});
	},

	/**
	 */

	"request": function(options, callback) {

		this.requestTwiddler.twiddle(options);

		var db = this.recuest.db, on = outcome.error(callback),
		self = this,
		logger = this._logger;

		logger.logHeader("proxying %s", options.url);

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
				if(content && content.cache !== false) {
					return self._returnResponse(options, callback);
				}

				logger.logAction("fetch live data");
				//otherwise make a new http request


				delete options.headers.host;

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


				logger.logAction("cache response");

				var data = {

					//the url we're proxying
					url: options.url,


					//the profile we're testing - this is the testing group
					profile: options.profile,

					//the short name for the url - used for twiddling responses
					name: options.name,

					//the headers of the response
					headers: response.headers,

					//200? 404?
					statusCode: response.statusCode,

					cache: true,

					//the content
					body: body,

					//timeout for the response data
					timeout: 1,
				}, next = this;


				self.responseTwiddler.twiddle(data);



				data.body = new Buffer(data.body, 'binary').toString('base64')


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

		this._logger.logAction("return response");

		var self = this;

		self.recuest.db.collection.find({ url: options.url, profile: options.profile }).nextObject(outcome.error(callback).success(function(item) {
			if(!item) return callback();
			self._logger.logAction("timeout %d", item.timeout);
			setTimeout(function() {
				item.body = new Buffer(item.body, 'base64').toString('binary');
				console.log("response body=%s", item.body.substr(0, 500) + "...");
				callback(null, item);
			}, item.timeout || 1);

		}));
	},


	/**
	 */

	"_getCached": function(options, callback) {
		var self = this, logger = this._logger;
		step(
			function() {

				//use the cached version?
				if(options.cache === false) {
					logger.logAction("skip fetch cache");
					return callback();
				}

				var query = { profile: options.profile };

				if(options.response) {
					query.name = options.response;
				} else
				if(options.name) {
					query.name = options.name;
				} else {
					query.url  = options.url;
				}

				logger.logAction("find cached response");
				self.recuest.db.findOne(query, callback);
			}
		);
	}
});