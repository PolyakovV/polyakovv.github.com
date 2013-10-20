function l () {
	return console.log.apply(console, arguments);
}


function f () {
	log(arguments)
}




(function () {
	var originalEach = jQuery.prototype.each;

	jQuery.prototype.each = function () {
		console.warn('Each called');
		return originalResults;
	};
}());


// Modify returning value
(function () {
	var originalEach = jQuery.prototype.each;

	jQuery.prototype.each = function () {
		var originalResults = originalEach.apply(this, arguments);

		return $('body');
	};
}());




// Modify returning value only once
(function () {
	var originalEach = jQuery.prototype.each;

	jQuery.prototype.each = function () {
		var originalResults = originalEach.apply(this, arguments);
		jQuery.prototype.each = originalEach;
		return $('body');
	};
}());



// Modify arguments once
(function () {
	var originalEach = jQuery.prototype.each;

	jQuery.prototype.each = function () {
		var args = [].slice.call(arguments);

		args[0] = function (index, node) {
			if (node.className) {
				console.log(node.className);
			}
		}

		var results = originalEach.apply(this, args);
		jQuery.prototype.each = originalEach;
		return results;
	};
}());



$('div').each(function (index, node) {
	if (node.id) {
		console.log(node.id);
	}
})



















function f () {
	var args = arguments;
}

f(arg1, arg2, arg3);
f.call(this, arg1, arg2, arg3);
f.apply(this, [arg1, arg2, arg3]);


var obj = {
	method: f
}

obj.method(); // this === obj
f(); // this === undefined, window
