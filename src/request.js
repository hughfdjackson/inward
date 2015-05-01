'use strict';

var I = require('immutable');

module.exports = I.Record({
    headers: I.Map({}),
    url: '',
    httpMethod: 'unknown'
});