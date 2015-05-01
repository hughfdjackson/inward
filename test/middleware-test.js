'use strict';

var Middleware = require('../src/middleware');

var _ = require('ramda');

require('chai').should();

describe('Middleware.pipe', function(){
    it('should wrap a list of functions, applying from the left to the right', function(){
        var mw1 = function(fn, req){
            return fn(req) + '!!';
        };

        var mw2 = function(fn, req){
            return 'Oh, ' + fn(req) + ' there';
        };

        var middleware = Middleware.pipe([mw1, mw2]);

        var withHandler = middleware(_.identity);

        withHandler('hi').should.equal('Oh, hi there!!');
    });
});