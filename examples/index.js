require("../").injectProxy({
	host: "http://localhost:8080"
});
var request = require("request");

request("http://google.com", function(err, response, body) {
	console.log(body);
});