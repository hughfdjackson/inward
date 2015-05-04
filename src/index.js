'use strict';

var I = require('immutable');
var _ = require('ramda');

var routing = require('./internal/routing');
var Request = require('./internal/request');
var Server = require('./server');

var Promise = require('es6-promise-polyfill').Promise;

var handleRequest = _.curry(function(server, req, res){
    var request = Request({
        headers: I.fromJS(req.headers),
        path: req.url,
        method: req.method
    });
    var middleware = server.get('middleware');
    var routes = server.get('routes');
    var match = routing.matchRoute(routes, request);
    var handler = function(req) {
        return Promise
            .resolve(req)
            .then(match.get('handler'));
    };

    bufferBody(req).then(function(data){
            var reqWithBody = match
                .get('request')
                .set('body', data);

            return middleware(handler, reqWithBody);
        })
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
    var serverWithRouteTree = server.update('routes', routing.routesFromArray);
    var handler = handleRequest(serverWithRouteTree);

    var nodeServer = makeNodeServer(handler);

    nodeServer.listen(port);
    nodeServer.on('error', console.error)
});

module.exports = {
    runWith: runWith,
    Server: require('./server'),
    Response: require('./response'),
    Route: require('./route')
};