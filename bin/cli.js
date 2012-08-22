#!/usr/bin/env node

var recuest = require("../")
cli        = require("optimist").
usage("Usage: --env=[env] [config paths]").
default("env", "default"),
argv = cli.argv,
vm = require("vm");

argv._.unshift("/usr/local/etc/recuest/config");


if(argv.help) {
	cli.showHelp();
	process.exit();
}

var rc = recuest(require("./config")({
	env: argv.env.split(","),
	paths: argv._
})).start();


process.openStdin().on("data", function(chunk) {

	var db = rc.db,
	twiddler = rc.proxy.twiddler;

	try {
		eval(String(chunk));
	} catch(e) {
		console.error(e.message);
	}
})