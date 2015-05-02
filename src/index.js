'use strict';

var I = require('immutable');
var _ = require('ramda');

var router = require('./internal/router');
var Request = require('./internal/request');

var handleRequest = _.curry(function(server, req, res){
    var request = Request({
        headers: I.fromJS(req.headers),
        path: req.url,
        method: req.method
    });

    var routes = server.get('routes');
    var route = router.findRoute(request, routes);
    var params = router.routeParamsForReq(request, route);

    var handler = route.get('handler');
    var result = handler(request.set('params', params));

    res.writeHead(result.get('statusCode'), result.get('statusMessage'), result.get('headers').toJS());
    res.end(result.get('body'));
});

var runWith = _.curry(function(server, makeNodeServer, port){
    makeNodeServer(handleRequest(server)).listen(port);
});

var Server = I.Record({
    routes: I.List(),
    middleware: _.curry(function(fn, req){ return fn(req) })
});

module.exports = {
    runWith: runWith,
    Server: Server,
    Response: require('./response'),
    Route: require('./route'),
    Routes: I.List
};