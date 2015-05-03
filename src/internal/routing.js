'use strict';

var I = require('immutable');
var _ = require('ramda');

var Match = I.Record({
    handler: null,
    request: null
});

var matchRoute = _.curry(function(routes, request){
    var pathAndQS = request.get('path').split('?');
    var requestWithQS = request
        .set('path', pathAndQS[0])
        .set('queryString', pathAndQS[1] || '');

    var route = routes.findLast(routeMatches(requestWithQS));
    if ( !route ) return undefined;

    var requestWithParams = requestWithQS.set('params', params(request, route));

    return Match({
        request: requestWithParams,
        handler: route.get('handler')
    });
});

var routeMatches = _.curry(function(request, route) {
    return methodMatches(request, route) && pathMatches(request, route)
});

var methodMatches = function(request, route) {
    return route.get('method') === '*' || request.get('method') === route.get('method');
};

var pathMatches = function(request, route) {
    return route.get('regex').test(request.get('path'));
};


var params = function(request, route) {
    var names = paramNames(route);
    var values = paramValues(request, route);
    var paramsObject= _.zipObj(names, values)

    return I.Map(paramsObject);
};

var paramNames = function(route){
    return route.get('path')
        .split('/')
        .filter(_.test(/^:/))
        .map(_.substringFrom(1));
};

var paramValues = function(request, route) {
    return route.get('regex')
        .exec(request.get('path'))
        .slice(1);
};


var routesFromArray = I.List;

module.exports = {
    routesFromArray: routesFromArray,
    matchRoute: matchRoute,
    Match: Match
};
