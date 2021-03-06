var Inward = require('../..');
var Response = Inward.Response; // contains constructors to use in our route handler
var Route = Inward.Route; // contains constructors for creating routes
var Middleware = Inward.Middleware;

var isoDate = function(){
    return (new Date()).toISOString();
};

// We want the middleware to run *before* the handler runs,
// so we'll use the `before` helper function.
var accessLogging = Middleware.before(function(request){
    var logString = [isoDate(), request.get('method'), request.get('path')].join(' ');
    console.log(logString);

    // we leave the request untouched - just pass it on to the next processing step
    return request;
});


var pingPongHandler = function(request) {
    return Response.OK('pong');
};

var server = Inward.Server({
    routes: [
        // In addition to the ping pong handler, we're adding logging here too
        Route.Get('/ping', accessLogging(pingPongHandler))
    ]
});

Inward.runHttp(server, 4000);