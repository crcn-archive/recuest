var deepExtend = require("deep-extend");

module.exports = function(options) {


	var cfg = {
		port: 8080,
		profile: "default",
		db: {
			driver: "Mongo",
			port: 27017,
			host: "127.0.0.1",
			database: "recuest"
		},
		twiddle: {
			request: [],
			response: []
		}
	},
	env = options.env,
	fcfg = {};

	for(var i = 0, n = options.paths.length; i < n; i++) {
		fcfg = deepExtend(fcfg, require(options.paths[i]));
	}


	for(var i = 0, n = env.length; i < n; i++) {

		var cpConfig = fcfg[env[i]];

		if(cpConfig.twiddle) {
			cfg.twiddle.request  = cfg.twiddle.request.concat(cpConfig.twiddle.request || []);
			cfg.twiddle.response = cfg.twiddle.response.concat(cpConfig.twiddle.response || []);

			delete cpConfig.twiddle;
		}

		cfg = deepExtend(cfg, cpConfig);
	}


	return cfg;

}

