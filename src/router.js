'use strict';

var I = require('immutable');

var noop = function(){};

var Route = I.Record({
    method: 'GET',
    path: '',
    handler: noop,
    regex: new RegExp('')
});

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



var Router = function(routes){
    this.routes = routes;
};

Router.prototype.add = function(method, path, handler){
    var route = Route({
        method: method,
        path: path,
        handler: handler,
        regex: pathToRegex(path)
    });

    return new Router(this.routes.push(route));
};

Router.prototype.route = function(req) {
    var route = this.routes.findLast(routeIsMatch.bind(null, req));
    if (route) return route.get('handler')(req, routeParamsForReq(req, route));
};

var routeIsMatch = function(req, route){
    return route.get('regex').test(req.get('url'));
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




module.exports = function(){ return new Router(I.List()) };