# Inward

HttpServer - handling inbound requests with Promises and Immutable.js.
 

## Hello World

```javascript
var Inward = require('inward');
var Response = Inward.Response;
var Route = Inward.Route;

var http = require('http');

var helloWorldHandler = function(request){
    var params = request.get('params');
    return Response.OK('hi, ' + params.get('name'));
};

var route404 = function(){
    return Response.NotFound("ain't nothing to see here");
};

var server = Inward.Server({
    routes: [
        Route.Get('/hello/:name', helloWorldHandler),
        Route.Any('*', route404)
    ]
});

Inward.runWith(server, http.createServer, 3000);
```

## What??

Having been through the process of building small Node.js http servers that grow into larger ones, maintained by several teams, two things are clear. 

Mutable data causes hard-to-find, tear-your-hair-out bugs; Promises, once you're used to them, are far more powerful and readable than the call-back based alternative.

Since Promises are coming as part of the JavaScript language spec, and [facebook have made a fantastic immutable collections library](https://github.com/facebook/immutable-js), now's the time to take advantage.

`Inward` is a Http server that (finally) delivers an app environment that is Promise and immutable-first by default.




