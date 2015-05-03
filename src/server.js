'use strict';

var _ = require('ramda');
var I = require('immutable');

var defaultMiddleware = _.curry(function(fn, req){ return fn(req) });

var Server = I.Record({
    routes: I.List(),
    middleware: defaultMiddleware
});

Server.defaultMiddleware = defaultMiddleware;

module.exports = Server;