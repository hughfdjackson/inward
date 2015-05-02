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

    var helloWorldHandler = function(request){
        return Response.Ok({
            body: 'hello, ' + request.getIn(['params', 'name'])
        });
    };

    it('should respond to hello-world', function(){
        var server = Inward.Server({
            routes: Inward.Routes([
                Route.Get('/hello/:name', helloWorldHandler)
            ])
        });
        Inward.runWith(server, http.createServer, port);

        return request('http://localhost:' + port + '/hello/world')
            .then(function(body){ body.should.equal('hello, world') })
    });
});
