'use strict';

var _ = require('ramda');

var pipe = _.reduceRight(function(inner, outer) {
    return _.partial(outer, inner);
});


module.exports = {
    pipe: _.flip(pipe)
};