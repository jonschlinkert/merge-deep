/*!
 * merge-deep <https://github.com/jonschlinkert/merge-deep>
 *
 * Copyright (c) 2014-2015 Jon Schlinkert.
 * Licensed under the MIT License
 */

'use strict';

var slice = require('array-slice');
var cloneDeep = require('clone-deep');
var isObject = require('is-plain-object');

module.exports = function merge(orig, objects) {
  var args = slice(arguments, 1);
  if (orig == null) {
    return {};
  }

  var len = args.length;
  if (len === 0) {
    return orig;
  }

  var o = cloneDeep(orig);
  var i = 0;

  while (i < len) {
    var obj = args[i++];
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
  return {}.hasOwnProperty.call(obj, key);
}