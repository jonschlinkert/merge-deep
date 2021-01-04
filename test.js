/*!
 * merge-deep <https://github.com/jonschlinkert/merge-deep>
 *
 * Copyright (c) 2014-2015 Jon Schlinkert.
 * Licensed under the MIT License
 */

'use strict';

require('mocha');
var assert = require('assert');
var merge = require('./');

// some of these tests were sourced from mout/mout
describe('mergeDeep', function() {
  it('should merge object properties without affecting any object', function() {
    var obj1 = {a: 0, b: 1};
    var obj2 = {c: 2, d: 3};
    var obj3 = {a: 4, d: 5};

    var actual = {a: 4, b: 1, c: 2, d: 5 };

    assert.deepEqual(merge({}, obj1, obj2, obj3), actual);
    assert.notDeepEqual(actual, obj1);
    assert.notDeepEqual(actual, obj2);
    assert.notDeepEqual(actual, obj3);
  });

  it('should do a deep merge', function() {
    var obj1 = {a: {b: 1, c: 1, d: {e: 1, f: 1}}};
    var obj2 = {a: {b: 2, d: {f: 'f'} }};

    assert.deepEqual(merge(obj1, obj2), {a: {b: 2, c: 1, d: {e: 1, f: 'f'} }});
  });

  it('should not merge strings', function() {
    var obj1 = {a: 'fooo'};
    var obj2 = {a: {b: 2, d: {f: 'f'} }};
    var obj3 = {a: 'bar'};
    var actual = merge(obj1, obj2, obj3);
    assert.deepEqual(actual.a, 'bar');
  });

  it('should clone objects during merge', function() {
    var obj1 = {a: {b: 1}};
    var obj2 = {a: {c: 2}};

    var actual = merge({}, obj1, obj2);
    assert.deepEqual(actual, {a: {b: 1, c: 2}});
    assert.notDeepEqual(actual.a, obj1.a);
    assert.notDeepEqual(actual.a, obj2.a);
  });

  it('should not merge an objects into an array', function() {
    var obj1 = {a: {b: 1}};
    var obj2 = {a: ['foo', 'bar']};

    var actual = merge({}, obj1, obj2);
    assert.deepEqual(actual, {a: ['foo', 'bar']});
  });

  it('should deep clone arrays during merge', function() {
    var obj1 = {a: [1, 2, [3, 4]]};
    var obj2 = {b: [5, 6]};

    var actual = merge(obj1, obj2);
    assert.deepEqual(actual.a, [1, 2, [3, 4]]);
    assert.deepEqual(actual.a[2], [3, 4]);
    assert.deepEqual(actual.b, obj2.b);
  });

  it('should union when both values are array', function() {
    var obj1 = {a: [1, 2, [3, 4]]};
    var obj2 = {a: [5, 6]};

    var actual = merge(obj1, obj2);
    assert.deepEqual(actual.a, [1, 2, [3, 4], 5, 6]);
    assert.deepEqual(actual.a[2], [3, 4]);
  });

  it('should union when the first value is an array', function() {
    var obj1 = {a: [1, 2, [3, 4]]};
    var obj2 = {a: 5};
    var obj3 = {a: 6};

    var actual = merge(obj1, obj2, obj3);
    assert.deepEqual(actual.a, [1, 2, [3, 4], 5, 6]);
    assert.deepEqual(actual.a[2], [3, 4]);
  });

  it('should uniquify array values', function() {
    var obj1 = {a: ['foo']};
    var obj2 = {a: ['bar']};
    var obj3 = {a: 'foo'};

    var actual = merge(obj1, obj2, obj3);
    assert.deepEqual(actual.a, ['foo', 'bar']);
  });

  it('should clone unioned arrays', function() {
    var obj1 = {a: [1, 2, [3, 4]]};
    var obj2 = {a: 5};
    var obj3 = {a: 6};

    var actual = merge(obj1, obj2, obj3);
    assert(actual.a[2] !== obj1.a[2]);
  });

  it('should copy source properties', function() {
    assert.equal(merge({ test: true }).test, true);
  });

  it('should clone arrays', function() {
    var fixture = [1, 2, 3];
    var actual = merge(fixture);
    assert.deepEqual(actual, fixture);
  });

  it('should clone RegExps', function() {
    var fixture = /test/g;
    var actual = merge(fixture);
    assert.deepEqual(actual, fixture);
  });

  it('should clone Dates', function() {
    var fixture = new Date();
    var actual = merge(fixture);
    assert.deepEqual(actual, fixture);
  });

  it('should not clone objects created with custom constructor', function() {
    function TestType() { }
    var fixture = new TestType();
    var actual = merge(fixture);
    assert.deepEqual(actual, fixture);
  });

  it('should not clone invalid keys', function() {
    var obj1 = { a: { b: 1 } };
    var obj2 = JSON.parse('{ "a": { "c": 2 }, "constructor": { "keys": 42 } }');

    var actual = merge({}, obj1, obj2);
    assert.deepEqual(actual, { a: { b: 1, c: 2 } });
    assert.notDeepEqual(actual.a, obj1.a);
    assert.notDeepEqual(actual.a, obj2.a);
    assert.notEqual(actual.keys, 42);
    assert.notEqual(actual.constructor.keys, 42);
  });

  it('should allow being used for custom constructors', function() {
    // The following setup code is a simple way to demonstrate multiple inheritance by merging the prototype of one class onto another
    function Shape() {
      this.type = '';
    }

    function Position(x, y) {
      this.x = x || 0;
      this.y = y || 0;
    }

    Position.prototype.stringify = function() {
      return '(' + this.x + ', ' + this.y + ')';
    };

    function Moveable(x, y) {
      Position.call(this, x, y);
    }

    // By making Moveable inherit from Position, allows us to test what happens when `constructor` is passed to `isValidKey`.
    Moveable.prototype = Object.create(Position.prototype);
    Moveable.prototype.constructor = Moveable;
    Moveable.prototype = merge(Moveable.prototype, Position.prototype);

    Moveable.prototype.move = function(x, y) {
      this.x += x;
      this.y += y;
    };

    Moveable.prototype.position = function() {
      return this.stringify();
    };

    function Rectangle() {
      Shape.call(this);
      Moveable.call(this);
      this.type = 'rectangle';
    }

    // Single inheritance using Object.create
    Rectangle.prototype = Object.create(Shape.prototype);
    Rectangle.prototype.constructor = Rectangle;

    // This is the test to ensure that `merge-deep` can be used with prototypal inheritance
    Rectangle.prototype = merge(Rectangle.prototype, Moveable.prototype);

    var rectangle = new Rectangle();
    assert.equal(rectangle.position(), '(0, 0)');
    rectangle.move(10, 20);
    assert.equal(rectangle.position(), '(10, 20)');
  });
});
