'use strict';

var Inward = require('..');
var I = require('immutable');
var Response = Inward.Response;
var Route = Inward.Route;

var http = require('http');
var request = require('request-promise');

require('chai').should();

var port = 3000;

describe('Server', function(){
    it('should respond to hello-world', function(){
        var helloRoute = Route.Get('/hello/:name', function(request){
            console.log(request);
            return Response.Ok({
                body: 'hi, ' + request.get(['params', 'name'])
            });
        });

        var server = Inward.Server({
            routes: I.List.of(helloRoute)
        });

        Inward.runWith(server, http.createServer, port);

        return request('http://localhost:' + port + '/hello/world')
            .then(function(body){ body.should.equal('hello, world') })
    })
});
