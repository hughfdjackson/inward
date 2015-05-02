'use strict';

var I = require('immutable');
var _ = require('ramda');

var withDefaults = _.curry(function(record, defaults, opts) {
    return record(defaults).merge(opts);
});

var Request = withDefaults(I.Map, {
    headers: I.Map({}),
    path: '',
    method: ''
});

Request.Get = withDefaults(Request, { method: 'GET' });
Request.Put = withDefaults(Request, { method: 'PUT' });
Request.Post = withDefaults(Request, { method: 'POST' });
Request.Delete = withDefaults(Request, { method: 'DELETE' });

module.exports = Request;