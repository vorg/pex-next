// Generated by CoffeeScript 1.6.2
define(function(require) {
  var AnimatedFloat, Time;

  Time = require('pex/utils/Time');
  Function.prototype.property = function(prop, desc) {
    return Object.defineProperty(this.prototype, prop, desc);
  };
  return AnimatedFloat = (function() {
    function AnimatedFloat(f, initialDelay) {
      this.initialDelay = initialDelay != null ? initialDelay : 0;
      this.initialValue = f;
      this.value = f;
      this._target = f;
    }

    AnimatedFloat.prototype.update = function() {
      if (this.delay > 0) {
        return this.delay -= Time.delta;
      } else {
        return this.value += (this._target - this.value) * 0.1;
      }
    };

    AnimatedFloat.property('target', {
      get: function() {
        return this._target;
      },
      set: function(value) {
        if (this._target !== value) {
          this._target = value;
          return this.delay = this.initialDelay;
        }
      }
    });

    return AnimatedFloat;

  })();
});

/*
//@ sourceMappingURL=AnimatedFloat.map
*/
