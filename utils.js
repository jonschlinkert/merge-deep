'use strict';

/**
 * Module dependencies
 */

var utils = require('lazy-cache')(require);
var fn = require;
require = utils;

require('clone-deep', 'clone');
require('is-extendable', 'isObject');
require = fn;

/**
 * Expose `utils` modules
 */

module.exports = utils;
