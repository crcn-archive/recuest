var http = require("http"),
url      = require("url"),
qs       = require("querystring");


//monkey patches http & https so it proxies through the given host
module.exports = function(options) {

	var oldRequest = http.request,
	proxyHost      = options.host;

	http.request = function(options, cb) {

		if(typeof options !== "string") {
			options = url.format(options.uri);
		}

		var newOptions = [
			proxyHost,
			"/proxy",
			"?url=",
			options
		];

		return oldRequest.call(http, newOptions.join(""), cb);
	}
}