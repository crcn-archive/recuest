#!/usr/bin/env node

var recuest = require("../")
cli        = require("optimist").
usage("Usage: --env=[env] --path=[configPath]").
default("env", "default").
default("path",  "/usr/local/etc/recuest/config"),
argv = cli.argv,
vm = require("vm");


if(argv.help) {
	cli.showHelp();
	process.exit();
}

var rc = recuest(require("./config")({
	env: argv.env.split(","),
	path: argv.path
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