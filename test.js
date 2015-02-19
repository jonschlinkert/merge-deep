/*!
 * merge-deep <https://github.com/jonschlinkert/merge-deep>
 *
 * Copyright (c) 2014 Jon Schlinkert, contributors.
 * Licensed under the MIT License
 */

'use strict';

var should = require('should');
var merge = require('./');

// some of these tests were sourced from mout/mout
describe('mergeDeep', function () {
  it('should merge object properties without affecting any object', function () {
    var obj1 = {a: 0, b: 1};
    var obj2 = {c: 2, d: 3};
    var obj3 = {a: 4, d: 5};

    var actual = {a: 4, b: 1, c: 2, d: 5 };

    merge({}, obj1, obj2, obj3).should.eql(actual);
    actual.should.not.eql(obj1);
    actual.should.not.eql(obj2);
    actual.should.not.eql(obj3);
  });

  it('should do a deep merge', function () {
    var obj1 = {a: {b: 1, c: 1, d: {e: 1, f: 1}}};
    var obj2 = {a: {b: 2, d : {f : 'f'} }};

    merge(obj1, obj2).should.eql({a: {b: 2, c: 1, d: {e: 1, f: 'f'} }});
  });

  it('should clone objects during merge', function () {
    var obj1 = {a: {b :1}};
    var obj2 = {a: {c :2}};

    var actual = merge({}, obj1, obj2);
    actual.should.eql({a:{b:1, c:2}});
    actual.a.should.not.eql(obj1.a);
    actual.a.should.not.eql(obj2.a);
  });

  it('should deep clone arrays during merge', function () {
    var obj1 = {a: [1, 2, [3, 4]]};
    var obj2 = {b : [5, 6]};

    var actual = merge(obj1, obj2);
    actual.a.should.eql([1, 2, [3, 4]]);
    actual.a[2].should.eql([3, 4]);
    actual.b.should.eql(obj2.b);
  });

  it('should copy source properties', function() {
    merge({ test: true }).test.should.be.true;
  });

  it('should clone arrays', function() {
    var fixture = [1, 2, 3];
    var actual = merge(fixture);
    actual.should.eql(fixture);
  });

  it('should clone RegExps', function() {
    var fixture = /test/g;
    var actual = merge(fixture);
    actual.should.eql(fixture);
  });

  it('should clone Dates', function() {
    var fixture = new Date();
    var actual = merge(fixture);
    actual.should.eql(fixture);
  });

  it('should not clone objects created with custom constructor', function() {
    function TestType() { }
    var fixture = new TestType();
    var actual = merge(fixture);
    actual.should.eql(fixture);
  });
});