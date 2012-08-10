var structr = require("structr"),
mongodblite = require("mongodblite"),
Cursor      = require("./cursor"),
crc32       = require("crc32"),
step        = require("step"),
outcome     = require("outcome"),
Watcher     = require("./watcher");


module.exports = structr({

	/**
	 */

	"__construct": function(options) {
		this.db = mongodblite.db(new mongodblite.drivers[options.driver || "Memory"](options));
		this.collection = this.db.collection(options.collection || "profile");
		this.watcher = new Watcher(this);
	},


	/**
	 * finds an endpoint based on the search query given
	 */

	"find": function(query)  {
		return new Cursor(this, query, this.collection);
	},

	/**
	 */

	"findOne": function(query, callback) {
		return this.collection.findOne(query, callback);
	},

	/**
	 */

	"remove": function(query, callback) {
		this.collection.remove(query, callback);
	},


	/**
	 */

	"update": function(item, onInsert) {

		var self = this, col = this.collection,
		on = outcome.error(onInsert);


		item.name = item.name || crc32(item.url);


		step(

			/**
			 * first check if the item exists based on the given key
			 */

			function() {
				col.findOne({ name: item.name }, this);
			},

			/**
			 */

			on.success(function(cachedItem) {


				//doesn't exist? insert it.
				if(!cachedItem) {

					return self._insert(item, this);
				}

				//otherwise update it
				return col.update({ name: item.name }, { $set: item }, this);
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