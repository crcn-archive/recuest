var express = require("express"),
logger      = require("winston").loggers.get("server"),
sprintf     = require("sprintf").sprintf,
path        = require("path"),
request     = require("request"),
step        = require("step");

exports.start = function(recuest) {

	var options = recuest.options,
        port    = Number(options.port || 8080),
        db      = recuest.db;

	logger.info(sprintf("starting server on port %d", port));

	var server = express();


	server.use(function(req, res) {

		var q = req.query;

		if(!q.url) {
			return res.end();
		}

		recuest.proxy.request({
			url: q.url,
			method: req.method,
			headers: req.headers,
			suite: q.suite || "default",
			name: q.name,
			response: q.response,
			cache: q.cache !== "false"
		}, function(err, result) {

			if(err) return res.end(err.message);

			res.set(result.headers);
			res.end(new Buffer(result.body, 'base64').toString('binary'));
		});

	});


	

	server.listen(port);
}