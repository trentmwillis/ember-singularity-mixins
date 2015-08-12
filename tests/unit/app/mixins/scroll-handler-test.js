/* global CustomEvent */

import Ember from 'ember';
import sinon from 'sinon';
import { moduleFor, test } from 'ember-qunit';

let ScrollHandlerObject;
let subject;
let sandbox;

moduleFor('mixin:scroll-handler', 'Unit | Mixin | scroll-handler', {
  needs: ['service:unified-event-handler'],

  beforeEach() {
    let mixin = this.container.lookupFactory('mixin:scroll-handler');
    let object = Ember.Object.extend(mixin);
    this.container.register('object:scroll-handler', object);
    ScrollHandlerObject = this.container.lookupFactory('object:scroll-handler');

    sandbox = sinon.sandbox.create();
  },

  afterEach() {
    sandbox.restore();
  }
});

test('it works', function(assert) {
  subject = ScrollHandlerObject.create();
  assert.ok(subject);
});

/* registerScrollHandlers */

test('registerScrollHandlers binds the scroll function to the window by default', function(assert) {
  let callbackStub = sandbox.stub();

  subject = ScrollHandlerObject.create({
    scroll: callbackStub
  });

  subject.registerScrollHandlers();

  window.dispatchEvent(new CustomEvent('scroll'));

  assert.ok(callbackStub.calledOnce);

  subject.unregisterScrollHandlers();
});

test('registerScrollHandlers binds the scroll function to a specified target', function(assert) {
  let callbackStub = sandbox.stub();

  Ember.$('#ember-testing').append(Ember.$('<div id="some-target"/>'));
  let scrollingElement = document.getElementById('some-target');

  subject = ScrollHandlerObject.create({
    scroll: callbackStub,
    eventTarget: '#some-target',
    scrollingElement
  });

  subject.registerScrollHandlers();

  scrollingElement.dispatchEvent(new CustomEvent('scroll'));

  assert.ok(callbackStub.calledOnce);

  subject.unregisterScrollHandlers();
});

test('registerScrollHandlers fails if no scroll function defined', function(assert) {
  subject = ScrollHandlerObject.create();
  assert.throws(() => subject.registerScrollHandlers());
});

/* unregisterScrollHandlers */

test('unregisterScrollHandlers unbinds the scroll function on the default target', function(assert) {
  let callbackStub = sandbox.stub();

  subject = ScrollHandlerObject.create({
    scroll: callbackStub
  });

  subject.registerScrollHandlers();
  subject.unregisterScrollHandlers();

  window.dispatchEvent(new CustomEvent('scroll'));

  assert.ok(callbackStub.notCalled);
});

test('unregisterScrollHandlers unbinds the scroll function on a custom target', function(assert) {
  let callbackStub = sandbox.stub();

  Ember.$('#ember-testing').append(Ember.$('<div id="some-target"/>'));
  let scrollingElement = document.getElementById('some-target');

  subject = ScrollHandlerObject.create({
    scroll: callbackStub,
    eventTarget: '#some-target',
    scrollingElement
  });

  subject.registerScrollHandlers();
  subject.unregisterScrollHandlers();

  scrollingElement.dispatchEvent(new CustomEvent('scroll'));

  assert.ok(callbackStub.notCalled);
});
