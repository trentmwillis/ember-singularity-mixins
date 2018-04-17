/**
 * The resize-handler mixin adds an easy-to-use "resize" hook, similar to the
 * default Ember hook for click(). It is only applicable to views/components.
 */
import Ember from 'ember';

const RESIZE = 'resize';

export default Ember.Mixin.create({
  unifiedEventHandler: Ember.inject.service(),

  // The hook for your resize functionality, you must implement this
  [RESIZE]: undefined,

  // Determines if we should fire a resize event on element insertion
  resizeOnInsert: true,

  // Interval in milliseconds at which the resize handler will be called
  // `undefined` by default, can be overridden if custom interval is needed
  resizeEventInterval: undefined,

  // Setups up the handler binding for the resize function
  registerResizeHandlers: Ember.on('didInsertElement', function() {
    // Bind 'this' context to the resize handler for when passed as a callback
    let resize = this.get(RESIZE).bind(this);
    this.set(RESIZE, resize);

    this.get('unifiedEventHandler').register('window', RESIZE, resize, this.get('resizeEventInterval'));

    this._resizeHandlerRegistered = true;

    if (this.get('resizeOnInsert')) {
      // Call the resize handler to make sure everything is in the correct state.
      // We do it after the current render, to avoid any side-effects.
      Ember.run.scheduleOnce('afterRender', this, () => {
        resize();
      });
    }
  }),

  // Unbinds the event handler on destruction of the view
  unregisterResizeHandlers: Ember.on('willDestroyElement', function() {
    if (this._resizeHandlerRegistered) {
      let resize = this.get(RESIZE);
      this.get('unifiedEventHandler').unregister('window', RESIZE, resize);
      this._resizeHandlerRegistered = false;
    }
  })
});
