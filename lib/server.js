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

	var server = express.createServer();


	server.use(function(req, res) {

		var q = req.query;

		console.log("R")

		var url    = q.url,
		testSuite  = q.suite, //test suite to use against the proxy (assigned by name). Ommitted will record the response
		record     = q.record === "false", //record the proxy response
		max        = q.max || 10, //max recordings
		name       = q.name, //name of the suite e.g: rate-limited (twitter)
		statusCode = Number(q.statusCode || 0); //status code to return (overridden)


		db.proxy({

		})

		res.end("G");
	});


	

	server.listen(port);
}