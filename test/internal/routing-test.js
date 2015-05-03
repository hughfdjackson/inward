'use strict';

var routing = require('../../src/internal/routing');
var Request = require('../../src/internal/request');
var Match = routing.Match;
var Route = require('../..').Route;
var Server = require('../..').Server;

var _ = require('ramda');
var I = require('immutable');

var jsverify = require('jsverify');
var property = jsverify.property;

var should = require('chai').should();

describe('routing.runRoute', function(){

    var arbitraryRequest = jsverify.record({
        method: jsverify.elements(['GET', 'PUT', 'POST', 'DELETE', 'OPTION', 'HEAD']),
        path: jsverify.asciistring
    }).smap(Request, function(request){
        return { path: request.get('path'), method: request.get('method') };
    });

    var arbitraryPathPart = jsverify.suchthat(jsverify.asciistring, function(s){ return s.indexOf('/') === -1 });
    var arbitraryAlphaNum = jsverify.elements('qwertyuiopasdfghjklzxcvbnm1234567890'.split(''));

    var arbitraryRoutePathPart = jsverify.suchthat(jsverify.asciistring, function(s){
        return s.indexOf('/') === -1
            && s.indexOf(':') === -1
            && s.indexOf('*') === -1
    });

    property('should return undefined when there are no routes', arbitraryRequest, function(req){
        var routes = routing.routesFromArray([]);
        return routing.matchRoute(routes, req) === undefined;
    });

    property('a single * handler should catch all', arbitraryRequest, function(req){
        var routes = routing.routesFromArray([
            Route.Any('*', _.identity)
        ]);

        return routing.matchRoute(routes, req).equals(Match({ request: req, handler: _.identity }));
    });

    property('one * should shadow the other', arbitraryRequest, function(req){
        var routes = routing.routesFromArray([
            Route.Any('*', undefined),
            Route.Any('*', _.identity)
        ]);

        return routing.matchRoute(routes, req).equals(Match({ request: req, handler: _.identity }));
    });

    property('should match * after a prefix', arbitraryRoutePathPart, arbitraryRequest, function(prefix, req){
        req = req.update('path', function(p){ return prefix + '/' + p; });
        var routes = routing.routesFromArray([
            Route.Any('*', undefined),
            Route.Any(prefix + '/*', _.identity)
        ]);

        return routing.matchRoute(routes, req).equals(Match({ request: req, handler: _.identity }));
    });

    property('should match a path part against :foo', arbitraryPathPart, arbitraryAlphaNum, arbitraryRequest, function(pathPart, keyName, req){
        req = req.set('path', pathPart);
        var resultReq = req.set('params', I.Map().set(keyName, pathPart));

        var routes = routing.routesFromArray([
            Route.Any(':' + keyName, _.identity)
        ]);

        return routing.matchRoute(routes, req).equals(Match({ request: resultReq, handler: _.identity }));
    });

    property('should match a path part against {prefix}/:foo', arbitraryRoutePathPart, arbitraryPathPart, arbitraryAlphaNum, arbitraryRequest, function(prefix, pathPart, keyName, req){
        req = req.set('path', prefix + '/' + pathPart);
        var resultReq = req.set('params', I.Map().set(keyName, pathPart));

        var routes = routing.routesFromArray([
            Route.Any(prefix + '/:' + keyName, _.identity)
        ]);


        return routing.matchRoute(routes, req).equals(Match({ request: resultReq, handler: _.identity }));
    });
});