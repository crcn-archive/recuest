var structr = require("structr");


/**
 * fiddles data before it's inserted into the database
 */

module.exports = structr({

	/**
	 */

	"__construct": function() {
		this._watch = [];
	},

	/**
	 */

	"watch": function(cursor) {
		this._watch.push(cursor);
	},

	/**
	 */

	"twiddle": function(item) {
		for(var i = this._watch.length; i--;) {
			var cursor = this._watch[i],
			tester = cursor.tester;

			if(tester.test(item)) {
				cursor.twiddle(item);
			}		
		}
	}
});