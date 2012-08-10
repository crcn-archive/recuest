var structr = require("structr");


/**
 * Examples:
 * db.find({ host: "amazon.com" }).watch().set({ response: "404" });
 */

module.exports = structr({

	/**
	 */

	"__construct": function(selector, collection) {
		this.selector = selector;
		this.collection = collection;
		this.cursor   = collection.find(this.selector);

	},

	/**
	 * listens for anything added into the database
	 */

	"watch": function() {

		var self = this;
		this.observer = this.cursor.observe();
		this.observer.on("insert", function(item) {
			if(!self._data) return;
			self.collection.update({ _id: item._id }, { $set: self._data }, { multi: true });
		});

		return this;
	},

	/**
	 * sets data to the given query
	 */

	"set": function(data) {
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