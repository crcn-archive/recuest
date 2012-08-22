#!/usr/bin/env node

var recuest = require("../")
cli        = require("optimist").
usage("Usage: --env=[env]").
default("env", "default"),
argv = cli.argv,
vm = require("vm");


if(argv.help) {
	cli.showHelp();
	process.exit();
}

var config = require("./config"),
configEnv = config[argv.env];

if(!configEnv) {
	console.error("env \"%s\" does not exist", argv.env);
	process.exit();
}


var rc = recuest(configEnv).start();



process.openStdin().on("data", function(chunk) {

	var db = rc.db,
	twiddler = rc.proxy.twiddler;

	try {
		eval(String(chunk));
	} catch(e) {
		console.error(e.message);
	}
})