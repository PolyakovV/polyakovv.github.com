function Observer() {
	this.subscribers = [];
}


Observer.prototype.subscribe = function (handler) {
	this.subscribers.push(handler);
};


Observer.prototype.unsubscribe = function (handler) {
	this.subscribers = this.subscribers.filter(function (subscriber) {
		return subscriber !== handler;
	});
};


Observer.prototype._trigger = function () {
	var args = arguments;
	this.subscribers.forEach(function (subscriber) {
		subscriber.apply(undefined, args);
	});
};
