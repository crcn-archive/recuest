var server = require("./server"),
structr    = require("structr"),
Db         = require("./db"),
Proxy      = require("./proxy");


var Recuest = structr({

	/**
	 */

	"__construct": function(options) {
		this.options = options;
		this.db      = new Db(options.db);
		this.proxy   = new Proxy(this, options);

	},

	/**
	 * starts the http server
	 */

	"start": function() {
		server.start(this);
		return this;
	}

});

module.exports = function(options) {
	return new Recuest(options);
}

