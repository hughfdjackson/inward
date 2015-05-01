'use strict';

var I = require('immutable');

var noop = function(){};

var Route = I.Record({
    httpMethod: 'GET',
    path: '',
    handler: noop,
    regex: new RegExp('')
});

var Match = I.Record({
    handler: function(){},
    params: I.Map()
});

Match.empty = Match();

var Router = function(routes){
    if (!this instanceof Router) return new Router(routes);
    this.routes = routes;
};

Router.prototype.add = function(method, path, handler){
    var route = Route({
        httpMethod: method,
        path: path,
        handler: handler,
        regex: pathToRegex(path)
    });

    return new Router(this.routes.push(route));
};

Router.prototype.match = function(req) {
    var route = this.routes.findLast(routeIsMatch.bind(null, req));

    if (!route) return Match.empty;
    else        return Match({ params: routeParamsForReq(req, route), handler: route.get('handler') });
};

var pathToRegex = function(path){
    var pathRegexString = path
        .split('/')
        .map(pathPartToRegexString)
        .join('\\/');

    return new RegExp('^' + pathRegexString + '$');
};

var pathPartToRegexString = function(pathPart){
    if (pathPart.indexOf(':') === 0) return '([^\\/]*)';
    else                             return pathPart;
};

var routeIsMatch = function(req, route){
    var routeMatches = route.get('regex').test(req.get('url'));
    var methodsMatch = route.get('httpMethod') === req.get('httpMethod');
    return routeMatches && methodsMatch;
};

var routeParamsForReq = function(req, route) {
    var reqParts   = req.get('url').split('/');
    var routeParts = route.get('path').split('/');

    var params = {};

    routeParts.forEach(function(routePart, i){
        if ( routePart.indexOf(':') !== 0 ) return;
        var paramName = routePart.slice(1);
        params[paramName] = reqParts[i];
    });

    return I.Map(params);
};


module.exports = {
    Router: function(){ return new Router(I.List()) },
    Match: Match
};