'use strict';

var I = require('immutable');
var _ = require('ramda');


var routeIsMatch = _.curry(function(req, route){
    var routeMatches = route.get('regex').test(req.get('path'));
    var methodsMatch = route.get('method') === req.get('method');
    return routeMatches && methodsMatch;
});

var routeParamsForReq = function(req, route) {
    var reqParts   = req.get('path').split('/');
    var routeParts = route.get('path').split('/');

    var params = {};

    routeParts.forEach(function(routePart, i){
        if ( routePart.indexOf(':') !== 0 ) return;
        var paramName = routePart.slice(1);
        params[paramName] = reqParts[i];
    });

    return I.Map(params);
};

var findRoute = function(request, routes){
    return routes.findLast(routeIsMatch(request));
};

module.exports = {
    findRoute: findRoute,
    routeParamsForReq: routeParamsForReq
};
