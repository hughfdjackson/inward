# Inward

HttpServer - handling inbound requests with Promises and Immutable.js.
 

## Hello World


```javascript
var Inward = require('inward');
var Response = Inward.Response;
var Route = Inward.Route;

var http = require('http');

var helloRoute = Route.Get('/hello/:name', function(request){
    return Response.Ok({ 
      body: 'hi, ' + request.get(['params', 'name']) 
    });
});

var server = Server({
    routes: [helloRoute]
});

Inward.runWith(server, http.createServer, 8080);
```



