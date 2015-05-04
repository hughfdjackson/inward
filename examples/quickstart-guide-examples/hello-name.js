var Inward = require('../..');
var Response = Inward.Response; // contains constructors to use in our route handler
var Route = Inward.Route; // contains constructors for creating routes


var server = Inward.Server({
    routes: [
        Route.Get('/hello/:name', function(request){
            return Response.OK('hello ' + request.getIn(['params', 'name']));
        })
    ]
});

Inward.runHttp(server, 4000);