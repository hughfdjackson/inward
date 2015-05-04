'use strict';

var _ = require('ramda');
var Promise = require('es6-promise-polyfill').Promise;

var wrap = _.curry(function(wrapper, fn, val) {
    var handler = function(v) {
        return Promise.resolve(fn(v));
    };

    return wrapper(handler, val);
});

var after = _.curry(function(after, fn, val){
    return Promise.resolve(fn(val)).then(after);
});


var before = _.curry(function(before, fn, val){
    return Promise.resolve(before(val)).then(fn);
});

var pipe = _.curry(function(middlewares, fn, val) {
    var handler = middlewares.reduce(function(currentFn, wrapper){
        return wrapper(currentFn)
    }, fn);

    return handler(val);
});

module.exports = {
    wrap: wrap,
    after: after,
    before: before,
    pipe: pipe
};