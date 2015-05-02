'use strict';

var I = require('immutable');
var _ = require('ramda');

var withDefaults = _.curry(function(record, defaults, opts) {
    return record(defaults).merge(opts);
});

var Response = I.Record({
    httpStatus: undefined,
    headers: I.Map({}),
    body: ''
});

Response.Ok = withDefaults(Response, { httpStatus: 200 });

module.exports = Response;