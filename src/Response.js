'use strict';

var I = require('immutable');
var _ = require('ramda');

var withDefaults = _.curry(function(record, defaults, opts) {
    return record(defaults).merge(opts);
});

var Response = I.Record({
    statusCode: undefined,
    statusMessage: '',
    headers: I.Map({}),
    body: ''
});

Response.Ok = function(body) {
    return Response({
        statusCode: 200,
        statusMessage: 'Ok',
        body: body
    });
};

module.exports = Response;