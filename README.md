# Ember Singularity Mixins

[![Build Status](https://travis-ci.org/trentmwillis/ember-singularity-mixins.svg?branch=master)](https://travis-ci.org/trentmwillis/ember-singularity-mixins)

This addon consumes the unified event handling of [Ember Singularity](https://github.com/trentmwillis/ember-singularity)
in order to provide easy-to-use and performant mixins for "spammy" events, such
as scrolling, resizing, or touch events.

_Note: If you use this addon, you do **not** need to include ember-singularity
as a dependency as well._

## Usage

All mixins can be imported using the following form:

```js
import <MixinName> from 'ember-singularity-mixins/mixins/<mixin-name>';
export default Ember.Component.extend(<MixinName>);
```

They also have a function hook that uses the same name as the event which they
handle. In other words, for the `scroll-handler` mixin it would simply be:

```js
import ScrollHandler from 'ember-singularity-mixins/mixins/scroll-handler';
export default Ember.Component.extend(ScrollHandler, {
  scroll() {
    // Do stuff on scroll
  },
  // Other component properties and methods
});
```

## Available Mixins

1. `scroll-handler`
2. `resize-handler`
