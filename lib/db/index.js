var structr = require("structr"),
mongodblite = require("mongodblite"),
Cursor      = require("./cursor"),
crc32       = require("crc32"),
step        = require("step"),
outcome     = require("outcome");


module.exports = structr({

	/**
	 */

	"__construct": function(options) {
		this.db = mongodblite.db(new mongodblite.drivers[options.driver || "Memory"](options));
		this.collection = this.db.collection(options.collection || "profile");
	},


	/**
	 */


	"request": function(options) {

	},

	/**
	 * finds an endpoint based on the search query given
	 */

	"find": function(query)  {
		return new Cursor(query, this.collection);
	},

	/**
	 */

	"remove": function(query, callback) {
		this.collection.remove(query, callback);
	},


	/**
	 */

	"update": function(item, onInsert) {

		var key = crc32(item.url), self = this, col = this.collection,
		on = outcome.error(onInsert);


		item.key = key;


		step(

			/**
			 * first check if the item exists based on the given key
			 */

			function() {
				col.findOne({ key: key }, this);
			},

			/**
			 */

			on.success(function(item) {

				//doesn't exist? insert it.
				if(!item) {
					return self._insert(item, this)
				}

				//otherwise update it
				return col.update({ key: key }, { $set: item }, this);
			}),


			/**
			 */

			onInsert
		);
	},


	/**
	 */

	"_insert": function(item, onInsert) {
		this.collection.insert(item, onInsert);
	}

});