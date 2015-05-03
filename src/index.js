'use strict';

var I = require('immutable');
var _ = require('ramda');

var router = require('./internal/router');
var Request = require('./internal/request');

var Promise = require('es6-promise-polyfill').Promise;

var handleRequest = _.curry(function(server, req, res){
    var body = bufferBody(req);

    var request = Request({
        headers: I.fromJS(req.headers),
        path: req.url,
        method: req.method
    });
    var routes = I.List(server.get('routes'));
    var route = router.findRoute(request, routes);
    var params = router.routeParamsForReq(request, route);
    var middleware = server.get('middleware');
    var handler = middleware(_.pipe(route.get('handler'), Promise.resolve.bind(Promise)));


    body.then(function(data){
        return request
            .set('params', params)
            .set('body', data);
        })
        .then(handler)
        .then(function(result) {
            res.writeHead(result.get('statusCode'), result.get('statusMessage'), result.get('headers').toJS());
            res.end(result.get('body'));
        })
        .catch(function(error){
            setImmediate(function(){ throw error; });
        });
});

var bufferBody = function(req){
    return new Promise(function(resolve, reject){
        var data = '';
        req.on('data', function(chunk){ data += chunk });
        req.on('end', function(){ resolve(data) });

        req.on('error', reject);
    });
};

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