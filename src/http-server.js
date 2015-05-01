'use strict';

var I = require('immutable');

var listen = function(httpServer, port, router) {
    httpServer.on('request', handleRequest.bind(null, router));
    httpServer.listen(port);
};

var handleRequest = function(router, req, res) {
    var request = reqFromNative(req);
};

var reqFromNative = function(req){
    return I.fromJS({
        headers: req.headers,
        method: req.method,
        httpVersion: req.httpVersion,
        url: req.url
    });
};

module.exports = {
    init: function(){
        var s = require('http').createServer();
        listen(s, 8000);
    }
};