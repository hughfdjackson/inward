'use strict';

var routing = require('../../src/internal/routing');
var Request = require('../../src/internal/request');
var Match = routing.Match;
var Route = require('../..').Route;
var Server = require('../..').Server;

var qs = require('querystring');

var _ = require('ramda');
var I = require('immutable');

var jsverify = require('jsverify');
var property = jsverify.property;

var should = require('chai').should();

describe('routing.runRoute', function(){

    var arbitraryPathPart = jsverify.suchthat(jsverify.asciistring, function(s){
        return s.indexOf('/') === -1
            && s.indexOf('?') === -1
    });

    var arbitraryRequest = jsverify.record({
            method: jsverify.elements(['GET', 'PUT', 'POST', 'DELETE', 'OPTION', 'HEAD']),
            path: jsverify.suchthat(jsverify.asciistring, function(s){ return s.indexOf('?') === - 1})
        })
        .smap(Request, function(request){
            return { path: request.get('path'), method: request.get('method') }
        });

    var arbitraryAlphaNum = jsverify.elements('qwertyuiopasdfghjklzxcvbnm1234567890'.split(''));

    var arbitraryRoutePathPart = jsverify.suchthat(jsverify.asciistring, function(s){
        return s.indexOf('/') === -1
            && s.indexOf(':') === -1
            && s.indexOf('*') === -1
            && s.indexOf('?') === -1
    });

    var arbitraryQueryString = jsverify.dict(jsverify.asciistring)
        .smap(qs.stringify, qs.parse);

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


    property('one path should shadow the same one later', arbitraryRoutePathPart, arbitraryRequest, function(pathPart, req){
        req = req.set('path', pathPart);
        var routes = routing.routesFromArray([
            Route.Any(pathPart, _.identity),
            Route.Any(pathPart, undefined)
        ]);

        return routing.matchRoute(routes, req).equals(Match({ request: req, handler: _.identity }));
    });

    property('one * should shadow ones that come after', arbitraryRequest, function(req){
        var routes = routing.routesFromArray([
            Route.Any('*', _.identity),
            Route.Any('*', undefined)
        ]);

        return routing.matchRoute(routes, req).equals(Match({ request: req, handler: _.identity }));
    });

    property('should use the first matching route', arbitraryRoutePathPart, arbitraryRequest, function(prefix, req){
        req = req.update('path', function(p){ return prefix + '/' + p; });
        var routes = routing.routesFromArray([
            Route.Any(prefix + '/*', _.identity),
            Route.Any('*', undefined)
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

    property('should match querystring, and (by default) provide it as a string', arbitraryRequest, arbitraryQueryString, function(req, queryString){
        var resultReq = req.set('queryString', queryString);
        var reqWithQS = req.update('path', function(p){ return p + '?' + queryString });

        var routes = routing.routesFromArray([
            Route.Any('*', _.identity)
        ]);

        return routing.matchRoute(routes, reqWithQS).equals(Match({ request: resultReq, handler: _.identity }));
    });
});