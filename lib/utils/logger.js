var index = 0;

exports.coloredLogger = function() {

	var colors = ['green', 'blue', 'white', 'yellow', 'magenta'],
	color      = colors[index++ % colors.length];


	function unshiftArrow(arrow, args) {
		args = Array.prototype.slice.call(args, 0);
		var msg = args.shift();

		return [arrow[color] + msg].concat(args);
	}


	return {
		"logAction": function() {
			console.log.apply(console, unshiftArrow("--> ", arguments));
		},

		"logHeader": function() {
			console.log.apply(console, unshiftArrow("> ", arguments));
		}
	}
}