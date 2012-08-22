Rec-uest helps you better debug API's by allowing you to record, and twiddle http requests on the fly.

### Purpose

- Faster debugging since testing is done locally
- Automated testing made easier
- Easier to debug any outlying issues with API responses
- Simulate server states 
	- server outages

### Requirements

- [node.js](http://nodejs.org/)

### Installation

```
npm install recuest -g
```

### Terminal Usage

```
Usage: --env=[env] [config paths]

Options:
  --env  [default: "default"]
```

### Example:

Here's an example where the proxy might simulate a 500 internal server error:

```
recuest --env=default,500 /path/to/config.json
```

And here's `/path/to/config.json`:

```javascript
{
    "default": {
        "port": 8080,
        "profile": "default",
        "db": {
            "driver": "Mongo",
            "port": 27017,
            "host": "127.0.0.1",
            "database": "recuest"
        }
    },
    "500": {
    	"profile": "500",
    	"twiddle": {
    		"response": [
    			{
    				"fiddle": {
    					"$set": {
    						"statusCode": 500,
    						"body": "A 500 internal server error has occurred."
    					}
    				}	
    			}	
    		]
    	}
    }
}
    
}
```

In your node.js app, make sure to use this chunk of code:

```javascript

//monkey-patches the http module so all requests redirect through the proxy
require("recuest").injectProxy({
	host: "http://localhost:8080"
});

var request = require("request");

//redirects through the proxy
request.get("http://google.com", function(err, response, body) {
	console.log(body);
});
```

Finally, call `node ./my/app.js`, and you should see `A 500 internal server error has occurred`.

