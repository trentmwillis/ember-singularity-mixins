import Ember from "ember";
import sinon from "sinon";
import { module, test } from 'qunit';
import { setupTest } from "ember-qunit";
// eslint-disable ember/no-jquery
// eslint-disable-next-line ember/no-mixins
import ScrollHandlerMixin from "dummy/mixins/scroll-handler";

let ScrollHandlerObject;
let subject;
let sandbox;

module("Unit | Mixin | scroll-handler", function(hooks) {
  setupTest(hooks);

  hooks.beforeEach(function() {
    let owner = this.owner;
    // eslint-disable-next-line ember/no-new-mixins
    let object = Ember.Object.extend(ScrollHandlerMixin);
    this.owner.register("object:scroll-handler", object);
    ScrollHandlerObject = owner.factoryFor("object:scroll-handler");

    sandbox = sinon.sandbox.create();
  });

  hooks.afterEach(function() {
    sandbox.restore();
  });

  test("it works", function (assert) {
    subject = ScrollHandlerObject.create();
    assert.ok(subject);
  });

  /* registerScrollHandlers */

  test("registerScrollHandlers binds the scroll function to the window by default", function (assert) {
    let callbackStub = sandbox.stub();

    subject = ScrollHandlerObject.create({
      scroll: callbackStub,
    });

    subject.registerScrollHandlers();

    window.dispatchEvent(new CustomEvent("scroll"));

    assert.ok(callbackStub.calledOnce);

    subject.unregisterScrollHandlers();
  });

  test("registerScrollHandlers binds the scroll function to a specified target", function (assert) {
    let callbackStub = sandbox.stub();

    // eslint-disable-next-line ember/no-jquery
    Ember.$("#ember-testing").append(Ember.$('<div id="some-target"/>'));
    let scrollingElement = document.getElementById("some-target");

    subject = ScrollHandlerObject.create({
      scroll: callbackStub,
      eventTarget: "#some-target",
      scrollingElement,
    });

    subject.registerScrollHandlers();

    scrollingElement.dispatchEvent(new CustomEvent("scroll"));

    assert.ok(callbackStub.calledOnce);

    subject.unregisterScrollHandlers();
  });

  test("registerScrollHandlers fails if no scroll function defined", function (assert) {
    subject = ScrollHandlerObject.create();
    assert.throws(() => subject.registerScrollHandlers());
  });

  test("registerScrollHandlers triggers an initial scroll with triggerOnInsert", function (assert) {
    let scrollSpy = sandbox.spy();

    subject = ScrollHandlerObject.create({
      triggerOnInsert: true,
      scroll: scrollSpy,
    });

    Ember.run(() => subject.registerScrollHandlers());

    Ember.run.next(() => assert.ok(scrollSpy.calledOnce));

    subject.unregisterScrollHandlers();
  });

  /* unregisterScrollHandlers */

  test("unregisterScrollHandlers unbinds the scroll function on the default target", function (assert) {
    let callbackStub = sandbox.stub();

    subject = ScrollHandlerObject.create({
      scroll: callbackStub,
    });

    subject.registerScrollHandlers();
    subject.unregisterScrollHandlers();

    window.dispatchEvent(new CustomEvent("scroll"));

    assert.ok(callbackStub.notCalled);
  });

  test("unregisterScrollHandlers unbinds the scroll function on a custom target", function (assert) {
    let callbackStub = sandbox.stub();

    // eslint-disable-next-line ember/no-jquery
    Ember.$("#ember-testing").append(Ember.$('<div id="some-target"/>'));
    let scrollingElement = document.getElementById("some-target");

    subject = ScrollHandlerObject.create({
      scroll: callbackStub,
      eventTarget: "#some-target",
      scrollingElement,
    });

    subject.registerScrollHandlers();
    subject.unregisterScrollHandlers();

    scrollingElement.dispatchEvent(new CustomEvent("scroll"));

    assert.ok(callbackStub.notCalled);
  });

  test("unregisterScrollHandlers can be called more than once without erring", function (assert) {
    assert.expect(0);

    // eslint-disable-next-line ember/no-jquery
    Ember.$("#ember-testing").append(Ember.$('<div id="some-target"/>'));
    let scrollingElement = document.getElementById("some-target");

    subject = ScrollHandlerObject.create({
      scroll: () => {},
      eventTarget: "#some-target",
      scrollingElement,
    });

    subject.registerScrollHandlers();
    subject.unregisterScrollHandlers();
    subject.unregisterScrollHandlers();
  });

  test("scrollEventInterval is passed to the unified event handler service", function (assert) {
    assert.expect(1);

    let scrollEventInterval = 10;

    let uehServiceRegisterStub = sandbox.stub();
    let uehServiceUnRegisterStub = sandbox.stub();
    let unifiedEventHandlerService = {
      register: uehServiceRegisterStub,
      unregister: uehServiceUnRegisterStub,
    };

    subject = ScrollHandlerObject.create({
      scrollEventInterval,
      scroll: () => {},
      unifiedEventHandler: unifiedEventHandlerService,
    });

    subject.registerScrollHandlers();
    subject.unregisterScrollHandlers();

    window.dispatchEvent(new CustomEvent("resize"));

    assert.ok(
      uehServiceRegisterStub.calledWithExactly(
        sinon.match.any,
        sinon.match.any,
        sinon.match.any,
        scrollEventInterval
      )
    );
  });
});
