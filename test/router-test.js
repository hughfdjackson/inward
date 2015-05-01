'use strict';

var Router = require('../src/router').Router;
var Match = require('../src/router').Match;
var Request = require('../src/request');
var Get = Request.Get;

var I = require('immutable');
var _ = require('ramda');

var chai = require('chai');

chai.should();

describe('Router.match', function(){
    var handler = _.identity;

    it('should return the matching route handler + matched params', function(){
        var router = Router()
            .add('GET', '/user/:userId', handler)
            .add('GET', '/ticket/:ticketId', handler);

        var match = Match({
            params: I.Map({
                userId: 'abc'
            }),
            handler: handler
        });

        router.match(Get({ url: '/user/abc' })).equals(match).should.be.true;
    });

    it('matching ruotes should mask in the order they are applied', function(){
        var router = Router()
            .add('GET', '/user/:userId', handler)
            .add('GET', '/user/:userRouteVariation', handler);

        var match = Match({
            params: I.Map({
                userRouteVariation: 'abc'
            }),
            handler: handler
        });

        router.match(Get({ url: '/user/abc' })).equals(match).should.be.true;
    });

    it('should return Router.Match.empty if it can\'t find a route', function(){
        var router = Router()
            .add('GET', '/ticket/:ticketId', handler);

        router.match(Get({ url: '/user/100' })).should.equal(Match.empty);
    });
});