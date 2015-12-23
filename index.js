/*!
 * merge-deep <https://github.com/jonschlinkert/merge-deep>
 *
 * Copyright (c) 2014-2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

var utils = require('./utils');

module.exports = function mergeDeep(orig, objects) {
  if (!utils.isObject(orig)) orig = {};
  var len = arguments.length;
  var target = utils.clone(orig);

  for (var i = 1; i < len; i++) {
    var val = arguments[i];
    if (utils.isObject(val)) {
      merge(target, val);
    }
  }
  return target;
};

function merge(target, obj) {
  for (var key in obj) {
    if (!hasOwn(obj, key)) continue;
    var val = obj[key];
    if (utils.isObject(target[key])) {
      target[key] = merge(target[key] || {}, val);
    } else {
      target[key] = utils.clone(val);
    }
  }
  return target;
}

function hasOwn(obj, key) {
  return Object.prototype.hasOwnProperty.call(obj, key);
}
