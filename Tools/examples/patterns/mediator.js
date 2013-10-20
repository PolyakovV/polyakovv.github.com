var Mediator = (function() {
	'use strict';
	var events;
	var instance;

	events = {};

	instance = {
		subscribe: function(event_name, callback) {
			if (!events[event_name]) {
				events[event_name] = [];
			}
			events[event_name].push(callback);
		},

		unsubscribe: function(event_name, callback_) {
			if (arguments.length === 1) {
				delete events[event_name];
			} else {
				if (events[event_name]) {
					events[event_name] = events[event_name].filter(function(callback) {
						return callback !== callback_;
					});
				}
			}
		},

		__publish: function(event_name, data) {
			var callbacks;
			var i;

			callbacks = events[event_name];
			if (callbacks && callbacks.length) {
				for (i = 0; i < callbacks.length; i += 1) {
					callbacks[i].call(undefined, data);
				}
			}
		}
	}

	return function () {
		return instance;
	}
}());


var m1 = new Mediator();
var m2 = Mediator();

console.log(m1 === m2);
console.log(m1 === Mediator());
console.log(m1 === new Mediator());
