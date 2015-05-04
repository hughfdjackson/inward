var Inward = require('../..');
var Response = Inward.Response; // contains constructors to use in our route handler
var Route = Inward.Route; // contains constructors for creating routes

// A handler is just a function that takes a Request, and returns a Response
var pingPongHandler = function(request){
    return Response.OK('pong');
};

var server = Inward.Server({
    routes: [
        // Whenever we recieve a HTTP GET to /ping, reply with 'pong'
        Route.Get('/ping', pingPongHandler)
    ]
});

// Finally, we just need to run the server:
Inward.runHttp(server, 4000);