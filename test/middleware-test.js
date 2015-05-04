'use strict';

var Middleware = require('..').Middleware;
var _ = require('ramda');
var Promise = require('es6-promise-polyfill').Promise;

var handler = Promise.resolve.bind(Promise);
var nonPromiseHandler = _.identity;
var prefix = 'this should surround a';
var suffix = '!';

require('chai').should();

describe('Middleware.wrap', function(){
    it('should wrap a promise-returning function', function(){
        var testWrap = function(handler){
            return middleware(handler)('wrapped function')
                .then(function(result){ result.should.equal(prefix + 'wrapped function' + suffix)})
        };

        var middleware = Middleware.wrap(function(fn, val){
            return fn(prefix + val)
                .then(function(v){ return v + suffix })

        });

        return Promise.all([handler, nonPromiseHandler].map(testWrap));
    });
});

describe('Middleware.after', function(){
    it('should wrap a returning response', function(){
        var testAfter = function(handler){
            middleware(handler)('wrapped function')
                .then(function(result){ result.should.equal('wrapped function' + suffix) })
        };

        var middleware = Middleware.after(function(v){
            return v + suffix;
        });

        return Promise.all([handler, nonPromiseHandler].map(testAfter));
    });
});


describe('Middleware.before', function(){
    it('should wrap an incoming value', function(){
        var testBefore = function(handler) {
            return middleware(handler)('wrapped function')
                .then(function(result){ result.should.equal(prefix + 'wrapped function') })
        };

        var middleware = Middleware.before(function(v){
            return prefix + v;
        });

        return Promise.all([handler, nonPromiseHandler].map(testBefore));
    });
});

describe('Middleware.pipe', function(){
    it('should pipe together multiple middleware steps', function(){

        var testPipe = function(handler){
            return middleware(handler)(initialValue)
                .then(function(result){
                    result.should.equal(double(plus1(double(initialValue))));
                });
        };

        var double = function(a){ return a * 2 };
        var plus1  = function(a){ return a + 1 };
        var doubleM = Middleware.after(double);
        var plus1M  = Middleware.after(plus1);

        var middleware = Middleware.pipe([doubleM, plus1M, doubleM]);
        var initialValue = 10;

        return Promise.all([handler, nonPromiseHandler].map(testPipe));
    });
});