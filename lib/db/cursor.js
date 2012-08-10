var structr = require("structr"),
sift = require("sift"),
fiddle = require("fiddle");


/**
 * Examples:
 * db.find({ host: "amazon.com" }).watch().set({ response: "404" });
 */

module.exports = structr({

	/**
	 */

	"__construct": function(db, selector, collection) {
		this.selector   = selector;
		this.db = db;
		this.tester     = sift(selector);
		this.collection = collection;
		this.cursor     = collection.find(this.selector);

	},

	/**
	 */

	"toArray": function(callback) {
		return this.cursor.toArray(callback);
	},

	/**
	 * listens for anything added into the database
	 */

	"watch": function() {
		this.db.watcher.watch(this);
	},

	/**
	 */

	"twiddle": function(item) {
		fiddle({ $set: this._data }, null, item);
	}

	/**
	 * sets data to the given query
	 */

	"set": function(data) {
		this._data = data;
		this.collection.update({ _id: { $ne: undefined }}, { $set: data }, { multi: true });
		return this;
	},

	/**
	 * prints the items into console.log
	 */

	"print": function() {
		this.cursor.each(function(err, item) {
			if(!err) return;
			console.log(item.url);
		});
		return this;
	}
});