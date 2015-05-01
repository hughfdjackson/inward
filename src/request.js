'use strict';

var I = require('immutable');
var _ = require('ramda');

var withDefaults = _.curry(function(record, defaults, opts) {
    return record(defaults).merge(opts);
});

var Request = withDefaults(I.Map, {
    headers: I.Map({}),
    url: '',
    httpMethod: ''
});

Request.Get = withDefaults(Request, { httpMethod: 'GET' });
Request.Put = withDefaults(Request, { httpMethod: 'PUT' });
Request.Post = withDefaults(Request, { httpMethod: 'POST' });
Request.Delete = withDefaults(Request, { httpMethod: 'DELETE' });

module.exports = Request;