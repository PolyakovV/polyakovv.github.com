//
// Задание:
// Выводить в консоль индекс ссылки при клике на эту ссылку (ссылок на странице может быть любое количество).
//

'use strict'
	
	function bindEvent(node, eventName, handler) {
	var handler_wrapper = function(event) {
		event = event || window.event;
		if (!event.target && event.srcElement) {
			event.target = event.srcElement;
		}
		return handler.call(node, event);
	};

	if (node.addEventListener) {
		node.addEventListener(eventName, handler_wrapper, false);
	} else if (node.attachEvent) {
		node.attachEvent('on' + eventName, handler_wrapper);
	}
	return handler_wrapper;
}

var closest = (function() {
	return function(node, callback) {
		var nextParent = node;

		while (nextParent && (!callback(nextParent))) {
			nextParent = nextParent.parentNode;
		}
		return nextParent;
	}
})();

 function showLinkIndex(event)
 {
 	event = event || window.event
		if (event.preventDefault) {
			event.preventDefault();
		} else {
			event.returnValue = false;
		}

	var target = event.target || event.srcElement;

	if (target.tagName !== 'A') {
		target = closest(target, function(node) {
			return node.nodeName === 'A';
		});
	}
	var index = [].indexOf.call(document.links, target);
	if (index) {	console.log(index);}

}
	bindEvent(document.body,'click',showLinkIndex);