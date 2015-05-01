'use strict';

var Request = require('../src/request');

require('chai').should();

describe('Request.Get, Request.Put, Request.Post, Request.Delete', function(){
    it('should be sugar around the Request record', function(){
        Request.Get({}).equals(Request({ httpMethod: 'GET' })).should.be.true
        Request.Put({}).equals(Request({ httpMethod: 'PUT' })).should.be.true
        Request.Post({}).equals(Request({ httpMethod: 'POST' })).should.be.true
        Request.Delete({}).equals(Request({ httpMethod: 'DELETE' })).should.be.true
    });
});