/*!
 * merge-deep <https://github.com/jonschlinkert/merge-deep>
 *
 * Copyright (c) 2014 Jon Schlinkert, contributors.
 * Licensed under the MIT License
 */

'use strict';

var cloneDeep = require('clone-deep');
var isObject = require('is-plain-object');

module.exports = function merge(orig, objects) {
  var args = [].slice.call(arguments, 1);
  var len = args.length;

  var o = cloneDeep(orig);

  for (var i = 0; i < len; i++) {
    var obj = args[i];
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