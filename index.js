/*!
 * merge-deep <https://github.com/jonschlinkert/merge-deep>
 *
 * Copyright (c) 2014-2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

var cloneDeep = require('clone-deep');
var isObject = require('is-plain-object');

module.exports = function merge(orig, objects) {
  if (!isObject(orig)) return {};
  if (!isObject(objects)) return orig;

  var len = arguments.length - 1;
  var o = cloneDeep(orig);

  for (var i = 0; i < len; i++) {
    var obj = arguments[i + 1];

    for (var key in obj) {
      if (!hasOwn(obj, key)) {
        continue;
      }

      var val = obj[key];
      if (isObject(val) && isObject(o[key])) {
        o[key] = merge(o[key], val);
      } else {
        o[key] = cloneDeep(val);
      }
    }
  }
  return o;
};

function hasOwn(obj, key) {
  return Object.prototype.hasOwnProperty.call(obj, key);
}
