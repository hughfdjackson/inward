'use strict';

var Inward = require('..');
var I = require('immutable');
var Response = Inward.Response;
var Route = Inward.Route;

var http = require('http');
var request = require('request-promise');
var Promise = require('es6-promise-polyfill').Promise;

var _ = require('ramda');

require('chai').should();

var port = 3000;

describe('Server', function(){
    var echoBodyHandler = function(request) {
        return Response.Ok(request.get('body'));
    };

    var server = Inward.Server({
        routes: [
            Route.Get('/ping', _.always(Response.Ok('pong'))),
            Route.Get('/ping/async', _.always(Promise.resolve(Response.Ok('pong')))),

            Route.Get('/hello/:name', function(request){
                return Response.Ok('hello, ' + request.getIn(['params', 'name']))
            }),

            Route.Post('/echo', echoBodyHandler),
            Route.Put('/echo', echoBodyHandler)
        ]
    });
    Inward.runWith(server, http.createServer, port);


    it('should ping when ponged', function(){
        return request('http://localhost:' + port + '/ping')
            .then(function(body){ body.should.equal('pong') })
    });

    it('should respond to /hello/{name} with the "hello, {name}"', function(){
        var name = 'foobar';
        return request('http://localhost:' + port + '/hello/' + name)
            .then(function(body){ body.should.equal('hello, ' + name) });
    });

    it('should echo a posted string', function(){
        var payload = 'this is an example payload';
        return request({
            uri: 'http://localhost:' + port + '/echo',
            method: 'POST',
            headers: { 'ContentType': 'text/plain' },
            body: payload
        })
            .then(function(body){ body.should.equal(payload) });
    });

    it('should echo a put string', function(){
        var payload = 'this is an example payload';
        return request({
            uri: 'http://localhost:' + port + '/echo',
            method: 'PUT',
            headers: { 'ContentType': 'text/plain' },
            body: payload
        })
            .then(function(body){ body.should.equal(payload) });
    });

    it('should handle asynchronous handler computation', function(){
        return request('http://localhost:' + port + '/ping/async')
            .then(function(body){ body.should.equal('pong') });
    });

});
