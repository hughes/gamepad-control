define([], function () {
    var _gamepads;
    var Gamepads = function () {
        this.selectedGamepad = 0;
        this.poll();
    };
    Gamepads.prototype.poll = function() {
        if (typeof navigator.getGamepads === 'function') {
          _gamepads = navigator.getGamepads()
        } else if (typeof navigator.webkitGetGamepads === 'function') {
          _gamepads = navigator.webkitGetGamepads();
        };
    };
    Gamepads.prototype.getAxis = function(axisIndex) {
        if (_gamepads && _gamepads[this.selectedGamepad]) {
            return _gamepads[this.selectedGamepad].axes[axisIndex];
        }
        return 0;
    };
    return new Gamepads(); // singleton
});
