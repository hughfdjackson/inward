var Inward = require('../..');
var Response = Inward.Response; // contains constructors to use in our route handler
var Route = Inward.Route; // contains constructors for creating routes
var Middleware = Inward.Middleware;

var isoDate = function(){
    return (new Date()).toISOString();
};

var accessLogging = Middleware.wrap(function(handler, request){
    var startTime = Date.now();

    return handler(request)
        .then(function(response){
            var timeRequestHasTaken = Date.now() - startTime;
            var logString = [isoDate(), request.get('path'),
                             response.get('statusCode'), response.get('statusMessage'),
                             timeRequestHasTaken + 'ms'].join(' ');

            console.log(logString);

            return response;
        });
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