'use strict';

var I = require('immutable');
var _ = require('ramda');
var escapeRegex = require('escape-regexp');

var Route = I.Record({
    method: '',
    path: '',
    handler: function(req){
        throw 'Error: handler missing'
    },
    regex: new RegExp('')
});

var pathToRegex = function(path){
    var pathRegexString = path
        .split('/')
        .map(function(pathPart){
            if (pathPart.indexOf(':') === 0) return '([^\\/]*)';
            else if (pathPart === '*')       return '(.*)';
            else                             return escapeRegex(pathPart);
        })
        .join('\\/');

    return new RegExp('^' + pathRegexString + '$');
};

var route = _.curry(function(method, path, handler){
    return Route({
        method: method,
        path: path,
        regex: pathToRegex(path),
        handler: handler
    })
});

module.exports = {
    Get    : route('GET'),
    Put    : route('PUT'),
    Post   : route('POST'),
    Delete : route('DELETE'),
    Option : route('OPTION'),
    Head   : route('HEAD'),
    Any    : route('*'),
    Custom : route
};
