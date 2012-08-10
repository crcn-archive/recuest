var server = require("./server"),
structr    = require("structr"),
Db         = require("./db");


var Recuest = structr({

	/**
	 */

	"__construct": function(options) {
		this.options = options;
		this.db      = new Db(options.db);
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