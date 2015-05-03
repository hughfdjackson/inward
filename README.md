# Inward

HttpServer - handling inbound requests with Promises and Immutable.js.
 

## Hello World


```javascript
var Inward = require('inward');
var Response = Inward.Response;
var Route = Inward.Route;

var http = require('http');

var helloRoute = Route.Get('/hello/:name', function(request){
    var params = request.get('params');
    return Response.Ok('hi, ' + params.get('name')); 
});

var server = Server({
    routes: [helloRoute]
});

Inward.runWith(server, http.createServer, 8080);
```
