var _ = require("underscore");

module.exports = function(options) {


	var cfg = {
		port: 8080,
		profile: "default",
		db: {
			driver: "Mongo",
			port: 27017,
			host: "127.0.0.1",
			database: "recuest"
		}
	},
	env = options.env;

	var fcfg = require(options.path);

	for(var i = 0, n = env.length; i < n; i++) {
		cfg = _.extend(cfg, fcfg[env[i]]);
	}

	return cfg;

}

