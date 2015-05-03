'use strict';

var I = require('immutable');
var _ = require('ramda');

var withDefaults = _.curry(function(record, defaults, opts) {
    return record(defaults).merge(opts);
});

var Request = withDefaults(I.Map, {
    headers: I.Map({}),
    params: I.Map({}),
    path: '',
    method: ''
});

module.exports = Request;