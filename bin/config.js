var fs = require("fs");

var cfg = {};


try {
	module.exports = require("/usr/local/etc/recuest/config");
} catch(e) {
	module.exports = {
		default: {
			port: 8080,
			db: {
				driver: "Mongo",
				port: 27017,
				host: "127.0.0.1",
				database: "recuest"
			}
		}
	};
}