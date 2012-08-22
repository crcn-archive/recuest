#!/usr/bin/env node

var recuest = require("../")
cli        = require("optimist").
usage("Usage: --port=[num]").
default("port", 8080),
argv = cli.argv,
vm = require("vm");


if(argv.help) {
	cli.showHelp();
	process.exit();
}


var rc = recuest({
	port: argv.port,
	db: {
		driver: "Mongo",
		port: 27017,
		host: "127.0.0.1",
		database: "recuest"
	}
}).start();



process.openStdin().on("data", function(chunk) {

	var db = rc.db,
	twiddler = rc.proxy.twiddler;
	
	try {
		eval(String(chunk));
	} catch(e) {
		console.error(e.message);
	}
})