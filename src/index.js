'use strict';

var http = require('http');
var I = require('immutable');
var _ = require('ramda');

var routing = require('./internal/routing');
var Request = require('./internal/request');
var Server = require('./server');
var Response = require('./response');

var Promise = require('es6-promise-polyfill').Promise;
var default404 = _.always(Response.NotFound(''));

var handleRequest = _.curry(function(server, req, res){
    var request = Request({
        headers: I.fromJS(req.headers),
        path: req.url,
        method: req.method
    });
    var middleware = server.get('middleware');
    var routes = server.get('routes');
    var match = routing.matchRoute(routes, request);
    var handler = match ? match.get('handler') : default404;

    request = match ? match.get('request') : request;

    var promiseWrappedHandler = function(req) {
        return Promise.resolve(req).then(handler);
    };

    bufferBody(req).then(function(data){
            var reqWithBody = request.set('body', data);

            return middleware(promiseWrappedHandler, reqWithBody);
        })
        .then(function(result) {
            res.writeHead(result.get('statusCode'), result.get('statusMessage'), result.get('headers').toJS());
            res.end(result.get('body'));
        })
        .catch(console.error);
});

var bufferBody = function(req){
    return new Promise(function(resolve, reject){
        var data = '';
        req.on('data', function(chunk){ data += chunk });
        req.on('end', function(){ resolve(data) });

        req.on('error', reject);
    });
};

var runHttp = _.curry(function(server, port){
    var serverWithRouteTree = server.update('routes', routing.routesFromArray);
    var handler = handleRequest(serverWithRouteTree);

    var nodeServer = http.createServer(handler);

    nodeServer.listen(port);
    nodeServer.on('error', console.error)
});

module.exports = {
    runHttp: runHttp,
    Server: require('./server'),
    Response: require('./response'),
    Route: require('./route'),
    Middleware: require('./middleware')
};