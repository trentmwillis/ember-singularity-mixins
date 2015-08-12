/**
 * The scroll-handler mixin adds an easy-to-use "scroll" hook, similar to the
 * default Ember hook for click(). It is only applicable to views/components.
 */
import Ember from 'ember';

const SCROLL = 'scroll';
const EVENTTARGET = 'eventTarget';
const WINDOW = 'window';

export default Ember.Mixin.create({
  unifiedEventHandler: Ember.inject.service(),

  // The target of the scrolling event, defaults to the window
  [EVENTTARGET]: WINDOW,

  // The hook for your scroll functionality, you must implement this
  [SCROLL]: undefined,

  // Setups up the handler binding for the scroll function
  registerScrollHandlers: Ember.on('didInsertElement', function() {
    // TODO: limit this to the views object (this.$()) or the window
    let eventTarget = this.get(EVENTTARGET);

    // Bind 'this' context to the scroll handler for when passed as a callback
    let scroll = this.get(SCROLL).bind(this);

    // Save the newly bound function back as a reference for deregistration.
    this.set(SCROLL, scroll);

    this.get('unifiedEventHandler').register(eventTarget, SCROLL, scroll);
  }),

  // Unbinds the event handler on destruction of the view
  unregisterScrollHandlers: Ember.on('willDestroyElement', function() {
    let eventTarget = this.get(EVENTTARGET);
    let scroll = this.get(SCROLL);
    this.get('unifiedEventHandler').unregister(eventTarget, SCROLL, scroll);
  })
});
