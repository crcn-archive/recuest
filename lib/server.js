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

	server.get("/proxy", function(req, res) {

		var q = req.query;

		if(!q.url) {
			return res.end("url must be provided");
		}


		recuest.proxy.request({
			url: q.url,
			method: req.method,
			headers: req.headers,
			profile: q.profile,
			name: q.name,
			response: q.response,
		}, function(err, result) {

			if(err) return res.end(err.message);

			result.headers["content-length"] = result.body.length;
			
			res.set(result.headers);
			res.write(result.body);
			res.end();
		});

	});

	server.listen(port);
}