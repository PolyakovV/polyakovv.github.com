function bind(obj, eventName, handler) {
	var handlerWrapper = function(event) {
		event = event || window.event;
		if (!event.target && event.srcElement) {
			event.target = event.srcElement;
		}
		return handler.call(obj, event);
	};

	if (obj.addEventListener) {
		obj.addEventListener(eventName, handlerWrapper, false);
	} else if (obj.attachEvent) {
		obj.attachEvent('on' + eventName, handlerWrapper);
	}
	return handlerWrapper;
}
