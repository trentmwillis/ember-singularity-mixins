/* global CustomEvent */

import Ember from 'ember';
import ResizeHandlerMixin from '../../../mixins/resize-handler';
import { moduleFor, test } from 'ember-qunit';

const RSVP = Ember.RSVP;

let ResizeHandlerObject;
let subject;
let sandbox;

moduleFor('mixin:resize-handler', 'Unit | Mixin | resize-handler', {
  needs: ['service:unified-event-handler'],

  beforeEach() {
    let mixin = this.container.lookupFactory('mixin:resize-handler');
    let object = Ember.Object.extend(mixin);
    this.container.register('object:resize-handler', object);
    ResizeHandlerObject = this.container.lookupFactory('object:resize-handler');
    sandbox = sinon.sandbox.create();
  },

  afterEach() {
    sandbox.restore();
  }
});

// TODO: Remove when we upgrade to Phantom 2.0
if (!window.CustomEvent) {
  window.CustomEvent = function(event, params) {
    params = params || { bubbles: false, cancelable: false, detail: undefined };
    let evt = document.createEvent('CustomEvent');
    evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
    return evt;
  };

  window.CustomEvent.prototype = window.Event.prototype;
}

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
