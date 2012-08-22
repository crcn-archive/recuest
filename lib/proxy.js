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
		this.twiddler = new Twiddler();

		this.twiddler.set({
			profile: undefined
		}, {
			$set: {
				profile: "default"
			}
		});

		if(options.twiddle)
		for(var i = options.twiddle.length; i--;) {
			var tw = options.twiddle[i];
			this.twiddler.set(tw.sift, tw.fiddle);
		}
	},


	/**
	 */

	"request": function(options, callback) {

		this.twiddler.twiddle(options);

		console.log(options);

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
				if(content) {
					return self._returnResponse(options, callback);
				}

				logger.logAction("fetch live data");
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

					//the content
					body: new Buffer(body, 'binary').toString('base64')
				}, next = this;

				db.update(data, function() {
					self._getCached(options, next);
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

		this.recuest.db.collection.find({ url: options.url }).nextObject(callback);
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