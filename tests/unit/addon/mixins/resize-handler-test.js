/* global CustomEvent */

import Ember from 'ember';
import sinon from 'sinon';
import { moduleFor, test } from 'ember-qunit';
import ResizeHandlerMixin from 'dummy/mixins/resize-handler';

let ResizeHandlerObject;
let subject;
let sandbox;

moduleFor('mixin:resize-handler', 'Unit | Mixin | resize-handler', {
  integration: true,

  beforeEach() {
    let owner = Ember.getOwner(this);
    let object = Ember.Object.extend(ResizeHandlerMixin);
    this.registry.register('object:resize-handler', object);
    ResizeHandlerObject = owner.factoryFor('object:resize-handler');

    sandbox = sinon.sandbox.create();
  },

  afterEach() {
    sandbox.restore();
  }
});

test('it exists', function(assert) {
  subject = ResizeHandlerObject.create();
  assert.ok(subject);
});

test('registerResizeHandlers binds the resize event to the window', function(assert) {
  let resizeSpy = sandbox.spy();

  subject = ResizeHandlerObject.create({
    resizeOnInsert: false,
    resize: resizeSpy
  });

  subject.registerResizeHandlers();

  window.dispatchEvent(new CustomEvent('resize'));

  assert.ok(resizeSpy.calledOnce);

  subject.unregisterResizeHandlers();
});

test('registerResizeHandlers fails if no resize function defined', function(assert) {
  subject = ResizeHandlerObject.create();
  assert.throws(() => subject.registerResizeHandlers());
});

test('registerResizeHandlers triggers an initial resize with resizeOnInsert', function(assert) {
  let resizeSpy = sandbox.spy();

  subject = ResizeHandlerObject.create({
    resizeOnInsert: true,
    resize: resizeSpy
  });

  Ember.run(() => subject.registerResizeHandlers());

  Ember.run.next(() => assert.ok(resizeSpy.calledOnce));

  subject.unregisterResizeHandlers();
});

test('unregisterResizeHandlers unbinds the resize event from the window', function(assert) {
  let resizeSpy = sandbox.spy();

  subject = ResizeHandlerObject.create({
    resizeOnInsert: false,
    resize: resizeSpy
  });

  subject.registerResizeHandlers();
  subject.unregisterResizeHandlers();

  window.dispatchEvent(new CustomEvent('resize'));

  assert.ok(resizeSpy.notCalled);
});

test('unregisterResizeHandlers can be called more than once without erring', function(assert) {
  assert.expect(0);

  subject = ResizeHandlerObject.create({
    resizeOnInsert: false,
    resize: () => {}
  });

  subject.registerResizeHandlers();
  subject.unregisterResizeHandlers();
  subject.unregisterResizeHandlers();
});


test('resizeEventInterval is passed to the unified event handler service', function(assert) {
  assert.expect(1);

  let resizeEventInterval = 10;

  let uehServiceRegisterStub = sandbox.stub();
  let uehServiceUnRegisterStub = sandbox.stub();
  let unifiedEventHandlerService = {
    register: uehServiceRegisterStub,
    unregister: uehServiceUnRegisterStub
  };

  subject = ResizeHandlerObject.create({
    resizeEventInterval,
    resize: () => {},
    unifiedEventHandler: unifiedEventHandlerService
  });

  Ember.run(() => {
    subject.registerResizeHandlers();
    subject.unregisterResizeHandlers();
  });

  window.dispatchEvent(new CustomEvent('resize'));

  assert.ok(uehServiceRegisterStub.calledWithExactly(sinon.match.any, sinon.match.any, sinon.match.any, resizeEventInterval));
});