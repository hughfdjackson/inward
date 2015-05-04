var http = require('http');
var Inward = require('../..');
var Response = Inward.Response; // contains constructors to use in our route handler
var Route = Inward.Route; // contains constructors for creating routes


var pingPongHandler = function(request){
    return Response.OK('pong');
};

var handle404 = function(request){
    return Response.NotFound('<h1>Whoopsie - the page you\'re looking for has gone AWOL</h1>')
        .setIn(['headers', 'Content-Type'], 'text/html');
};

var server = Inward.Server({
    routes: [
        Route.Get('/ping', pingPongHandler),
        Route.Any('*', handle404)
    ]
});

Inward.runHttp(server, 4000);