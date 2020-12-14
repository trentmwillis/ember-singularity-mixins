/**
 * The scroll-handler mixin adds an easy-to-use "scroll" hook, similar to the
 * default Ember hook for click(). It is only applicable to views/components.
 */
import Ember from "ember";

// eslint-disable ember/no-get
const SCROLL = "scroll";
const EVENTTARGET = "eventTarget";
const WINDOW = "window";
// eslint-disable-next-line ember/no-new-mixins
export default Ember.Mixin.create({
  unifiedEventHandler: Ember.inject.service("unified-event-handler"),

  // The target of the scrolling event, defaults to the window
  [EVENTTARGET]: WINDOW,

  // The hook for your scroll functionality, you must implement this
  [SCROLL]: undefined,

  // Interval in milliseconds at which the scroll handler will be called
  // `undefined` by default, can be overridden if custom interval is needed
  scrollEventInterval: undefined,

  // Whether to trigger the scroll handler on initial insert
  triggerOnInsert: false,

  // Setups up the handler binding for the scroll function
  registerScrollHandlers: Ember.on("didInsertElement", function () {
    // TODO: limit this to the views object (this.$()) or the window
    let eventTarget = this.get(EVENTTARGET);

    // Bind 'this' context to the scroll handler for when passed as a callback
    let scroll = this.get(SCROLL).bind(this);

    // Save the newly bound function back as a reference for deregistration.
    this.set(SCROLL, scroll);

    this.unifiedEventHandler.register(
      eventTarget,
      SCROLL,
      scroll,
      this.scrollEventInterval
    );

    this._scrollHandlerRegistered = true;

    if (this.triggerOnInsert) {
      Ember.run.scheduleOnce("afterRender", scroll);
    }
  }),

  // Unbinds the event handler on destruction of the view
  unregisterScrollHandlers: Ember.on("willDestroyElement", function () {
    if (this._scrollHandlerRegistered) {
      let scroll = this.get(SCROLL);
      let eventTarget = this.get(EVENTTARGET);
      this.unifiedEventHandler.unregister(eventTarget, SCROLL, scroll);
      this._scrollHandlerRegistered = false;
    }
  }),
});
