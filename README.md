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


First install via NPM:

```
npm intall recuest`
```

Next, add your first API proxy:

```
recuest add --name=youtube --endpoint=https://gdata.youtube.com
```

Then start recuest:

```
recuest start --port=8080
```

Finally, go to your browser and type in:

```
http://localhost:8080/youtube
```

That's it! Now you can access the youtube API via that endpoint. Here's an example:

```
http://localhost:8080/youtube/feeds/api/users/default/subscriptions?v=2&alt=json
```

