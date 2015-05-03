'use strict';

var Inward = require('..');
var Response = Inward.Response;
var Route = Inward.Route;

var http = require('http');
var request = require('request-promise');
var Promise = require('es6-promise-polyfill').Promise;

var _ = require('ramda');

require('chai').should();

var port = 3000;

var url = function(suffix){
    return 'http://localhost:' + port + suffix
};

describe('Server', function(){
    var echoBodyHandler = function(request) {
        return Response.OK(request.get('body'));
    };

    var jsonMiddleware = _.curry(function(fn, req){
        return fn(req)
            .then(function(response){
                if (response.getIn(['headers', 'content-type']) === 'application/json')
                    return response.update('body', JSON.stringify);
                else return response;
            });
    });

    var server = Inward.Server({
        middleware: jsonMiddleware,
        routes: [
            Route.Get('/ping', _.always(Response.OK('pong'))),
            Route.Get('/ping/async', _.always(Promise.resolve(Response.OK('pong')))),

            Route.Get('/hello/:name', function(request){
                return Response.OK('hello, ' + request.getIn(['params', 'name']))
            }),

            Route.Get('/json-response', _.always(
                Response.OK({ x: 10 })
                    .setIn(['headers', 'content-type'], 'application/json'))),

            Route.Post('/echo', echoBodyHandler),
            Route.Put('/echo', echoBodyHandler),

            Route.Any('/any-pong', _.always(Response.OK('pong')))
        ]
    });
    Inward.runWith(server, http.createServer, port);


    it('should ping when ponged', function(){
        return request(url('/ping'))
            .then(function(body){ body.should.equal('pong') })
    });

    it('should respond to /hello/{name} with the "hello, {name}"', function(){
        var name = 'foobar';
        return request(url('/hello/' + name))
            .then(function(body){ body.should.equal('hello, ' + name) });
    });

    it('should echo a posted string', function(){
        var payload = 'this is an example payload';
        return request({
            uri: url('/echo'),
            method: 'POST',
            headers: { 'ContentType': 'text/plain' },
            body: payload
        })
            .then(function(body){ body.should.equal(payload) });
    });

    it('should echo a put string', function(){
        var payload = 'this is an example payload';
        return request({
            uri: url('/echo'),
            method: 'PUT',
            headers: { 'content-type': 'text/plain' },
            body: payload
        })
            .then(function(body){ body.should.equal(payload) });
    });

    it('should handle asynchronous handler computation', function(){
        return request(url('/ping/async'))
            .then(function(body){ body.should.equal('pong') });
    });

    it('should apply server-level middleware', function(){
        return request(url('/json-response'))
            .then(function(body){ JSON.parse(body).should.eql({ x: 10 }) })
    });

    it('should reply to any method supported by standard http lib, except special cases, if it has an Any handler', function(){
        var assertPong = function(method) {
            return request({
                method: method,
                url: url('/any-pong')
            }).then(function(body){ body.should.equal('pong') });
        };
        var specialCaseExclusions = ['HEAD', 'OPTION', 'CONNECT'];
        var methodsCaughtByAny = _.difference(http.METHODS, specialCaseExclusions);

        return Promise.all(methodsCaughtByAny.map(assertPong));
    });
});
