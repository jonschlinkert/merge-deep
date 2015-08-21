/*!
 * merge-deep <https://github.com/jonschlinkert/merge-deep>
 *
 * Copyright (c) 2014-2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

var lazy = require('lazy-cache')(require);
lazy('clone-deep', 'clone');
lazy('is-extendable', 'isObject');

module.exports = function mergeDeep(orig, objects) {
  if (!lazy.isObject(orig)) orig = {};
  var len = arguments.length;
  var target = lazy.clone(orig);

  for (var i = 1; i < len; i++) {
    var val = arguments[i];
    if (lazy.isObject(val)) {
      merge(target, val);
    }
  }
  return target;
};

function merge(target, obj) {
  for (var key in obj) {
    if (!hasOwn(obj, key)) continue;
    var val = obj[key];
    if (lazy.isObject(target[key])) {
      target[key] = merge(target[key] || {}, val);
    } else {
      target[key] = lazy.clone(val);
    }
  }
  return target;
}

function hasOwn(obj, key) {
  return Object.prototype.hasOwnProperty.call(obj, key);
}
