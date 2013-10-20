/**
 * Создание обработчика
 */
$(function () {
	'use strict';

	$('h1').on('click', function () {
		console.log('h1 clicked');
	});
});


/**
 * Объект события нормализован
 */
$(function () {
	'use strict';

	$('h1').on('click', function (event) {
		console.log(this, event);
	});
});



/**
 * Действие по умолчанию отменяется и событие перестает всплывать, если обработчик возвращает false
 * Эквивалент записи
 * event.preventDefault()
 * event.stopPropagation()
 */
$(function () {
	'use strict';

	$('a').on('click', function (event) {
		console.log(this.href);
		return object.method();
	});
});


/**
 * Объект события дополнен методами http://api.jquery.com/event.stopImmediatePropagation/
 */
$(function () {
	'use strict';

	var totalClicks = 0;
	var MAX_CLICKS = 3;

	$('h1').on('click', function (event) {
		console.log(this, event);
		if (totalClicks > MAX_CLICKS) {
			event.stopImmediatePropagation();
		}
		totalClicks += 1;
	});

	$('h1').on('click', function (event) {
		console.log('Later event');
	});
});


/**
 * Делегирование "из коробки". Работает прозрачно:
 * все, что характерно для событий, характерно и для делегирования событий
 * (включая неймспейсы)
 */

$(function () {
	'use strict';

	$('body').on('click', 'a', function (event) {
		console.log(event.target, this.href);
		return false;
	});
});


/**
 * Событие мыши, которого нет в ие8, например
 */
$(function () {
	'use strict';

	$('h1').on('mouseenter', function (event) {
		console.log('Mouse entered', this, 'from', event.fromElement);
	});
});


/**
 * Один обработчик, несколько событий
 */
$(function () {
	'use strict';

	$('h1').on('click dblclick', function (event) {
		console.log(this, event.type);
		return false;
	});
});


/**
 * namespace нужны для создания "групп" обработчиков.
 * эти группы можно удалять, запускать
 */
$(function () {
	'use strict';

	$('body').on('click.pluginName', function (event) {
		console.log(this, event);
		return false;
	});
});




/**
 * Удаление обработчиков. Работает только с jq обработчиками
 * Абсолютно все обработчики (кроме тех, что построены на делегировании)
 * можно удалить, склонировав узел (не jq методом)
 */
$(function () {
	'use strict';

	var MAX_CALLS = 5;
	var called = 0;

	function clickHandler(event) {
		console.log(this, event);
		called += 1;
		if (called > MAX_CALLS) {
			$('body').off('click', clickHandler);
		}
	}

	$('body').on('click', clickHandler);
});


/**
 * Удаление всех обработчиков по имени события
 * Аккуратнее, ибо можно удалить чужие.
 */
$(function () {
	'use strict';

	var MAX_CALLS = 5;
	var called = 0;

	function clickHandler(event) {
		console.log(this, event);
		called += 1;
		if (called > MAX_CALLS) {
			$('body').off('click');
		}
	}

	$('body').on('click', clickHandler);
	$('body').on('click', function () {
		console.log('Lalala I\'m another handler');
	});
});



/**
 * Удаление всех обработчиков с неймспейсом
 */
$(function () {
	'use strict';

	var MAX_CALLS = 5;
	var called = 0;

	$('body').on('click.maxCounter mousedown.maxCounter', function (event) {
		console.log('maxCounter', event.type);
		called += 1;
		if (called > MAX_CALLS) {
			$('*').off('.maxCounter');
		}
	});
	$('body').on('click', function () {
		console.log('Lalala I\'m another handler');
	});
});



/**
 * Удаление всех обработчиков по неймспейсу
 */
$(function () {
	'use strict';

	var MAX_CALLS = 5;
	var called = 0;

	function clickHandler(event) {
		console.log(this, event);
		called += 1;
		if (called > MAX_CALLS) {
			$('body').off('.maxCounter');
		}
	}

	// $('body').on('click.maxCounter mouseenter.maxCounter', clickHandler);
	$('body').on('click.maxCounter', clickHandler);
	$('body').on('click', function () {
		console.log('Lalala I\'m another handler');
	});
});


/**
 * Генерация уникального неймспейса
 */
$(function () {
	'use strict';

	var namespace = '.plugin' + (new Date).getTime();
	var MAX_CALLS = 5;
	var called = 0;

	function clickHandler(event) {
		console.log(this, event);
		called += 1;
		if (called > MAX_CALLS) {
			$('body').off(namespace);
		}
	}

	$('body').on('click' + namespace, clickHandler);
	$('body').on('click', function () {
		console.log('Lalala I\'m another handler');
	});
});


/**
 * Свои события. Или mediator для каждого объекта. Namespace работают
 * trigger
 * triggerHandler
 */
$(function () {
	'use strict';

	$(document).on('customevent', function (event, data) {
		console.log(arguments);
	});


	setTimeout(function () {
		$(document).trigger('customevent', {
			test: true
		});
	});
});
