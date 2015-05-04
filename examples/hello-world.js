var Inward = require('..');
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
