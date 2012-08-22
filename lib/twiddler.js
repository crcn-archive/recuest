var structr = require("structr"),
sift        = require("sift"),
fiddle      = require("fiddle");

var Watcher = structr({

	/**
	 */

	"__construct": function(query) {
		this._query = query;
	},

	/**
	 */

	"set": function(set) {
		this._set = set;
		this._fiddle = fiddle(set, this._query);
		return this;
	},

	/**
	 */

	"twiddle": function(item) {
		this._fiddle(item);
		return this;
	},

	/**
	 */

	"print": function() {
		console.log("match=%s set=%s", JSON.stringify(this._query, null, 2), JSON.stringify(this._set, null, 2));
	}

});

module.exports = structr({

	/**
	 */

	"__construct": function(options) {
		this._watchers = [];


		if(options.twiddle)
		for(var i = options.twiddle.length; i--;) {
			var tw = options.twiddle[i];
			this.set(tw.sift, tw.fiddle);
		}
	},

	/**
	 */

	"set": function(query, set) {
		var watcher = new Watcher(query).set(set);
		this._watchers.unshift(watcher);
		return watcher;
	},

	/**
	 */

	"print": function() {
		for(var i = this._watchers.length; i--;) {
			this._watchers[i].print();
		}
	},

	/**
	 */

	"removeAt": function(index, count) {
		this._watcher.splice(index, count || 1);
	},

	/**
	 */

	"twiddle": function(request) {
		for(var i = this._watchers.length; i--;) {
			this._watchers[i].twiddle(request);
		}
	}
});