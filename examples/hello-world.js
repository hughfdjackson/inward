var Inward = require('..');
var Response = Inward.Response;
var Route = Inward.Route;
var _ = require('ramda');

var http = require('http');

var helloWorldHandler = function(request){
    var params = request.get('params');
    return Response.OK('hi, ' + params.get('name'));
};

var handle404 = _.always(Response.NotFound('Route Not Found'));

var poweredBy = Middleware.after(function(response){
    return response.setIn(['headers', 'X-Powered-By'], 'Inward - the bestest')
});

var cors = Middleware.after(function(response){
    return response.setIn(['headers', 'Access-Control-Allow-Origin'], '*')
});

var server = Inward.Server({
    routes: [
        Route.Get('/hello/:name', helloWorldHandler),
        Route.Any('*', handle404)
    ],

    middleware: Middleware.pipe([cors, poweredBy])
});

Inward.runWith(server, http.createServer, 3000);


