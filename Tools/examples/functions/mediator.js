'use strict';

var mediator = (function () {
	var subscribtions = {};

	return {
		trigger: function (eventName, data) {
			if (subscribtions.hasOwnProperty(eventName)) {
				for (var i = 0; i < subscribtions[eventName].length; i += 1) {
					subscribtions[eventName][i].call(window, data);
				}
			}
		},
		subscribe: function (eventName, handler) {
			if (subscribtions.hasOwnProperty(eventName)) {
				subscribtions[eventName].push(handler);
			} else {
				subscribtions[eventName] = [handler];
			}
		},
		unsubscribe: function (eventName, handlerReference) {
			if (subscribtions.hasOwnProperty(eventName)) {
				if ( handlerReference === undefined) {
					delete subscribtions[eventName][handlerReference];
				} else {
					subscribtions[eventName] = [];
				}
			}
		}
	};
}());



/*
Объект, который позволяет подписываться на события (событие - строк имени, действие - функция-callback), и инициировать события (выполнять всех подписчиков на событие, передавая им дополнительную информацию о событии)
*/

// Пример применения
mediator.trigger('complete'); // nothing happens
mediator.subscribe('complete', function (completionTime) {
	console.log('Complete subscriber. Fired at' + completionTime);
});

mediator.subscribe('complete', function () {
	 console.info('Another complete subscriber');
});

setTimeout(function () {
	mediator.trigger('complete', new Date()); // both subscribers fired
}, 3000);
