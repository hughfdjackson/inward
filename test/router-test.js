'use strict';

var Router = require('../src/router');
var Request = require('../src/request');
var I = require('immutable');

var sinon = require('sinon');
var chai = require('chai');

chai.should();

describe('Router', function(){
    var response = I.Map();
    var handle = function(){ return response };

    it('should handle an incoming request', function(){
        var spy = sinon.spy(handle);
        var router = Router()
            .add('GET', '/index.js', spy);

        var req = Request({
            url: '/index.js',
            httpMethod: 'GET'
        });

        router.route(req).should.equal(response);

        spy.calledWith(req).should.be.true;
    });

    it('should handle parameters, returning a map of them', function(){
        var spy = sinon.spy(handle);
        var router = Router()
            .add('GET', '/hi/:name', spy);

        var req = I.Map({
            url: '/hi/helen',
            httpMethod: 'GET'
        });

        router.route(req).should.equal(response);

        spy.calledWith(req, I.Map({ name: 'helen' })).should.be.true;
    });

    it('should write over previous handlers with the new handler', function(){
        var spy1 = sinon.spy();
        var spy2 = sinon.spy(handle);

        var router = Router()
            .add('GET', '/hi/:name', spy1)
            .add('GET', '/hi/:name', spy2);

        var req = I.Map({
            url: '/hi/helen',
            httpMethod: 'GET'
        });

        router.route(req).should.equal(response);

        spy1.notCalled.should.be.true;
        spy2.calledWith(req, I.Map({ name: 'helen' })).should.be.true;
    });

    it('should supply GET, POST, PUT, DELETE, PATCH, HEAD, OPTION, DELETE sugar', function(){});

});