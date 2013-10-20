function decorate(initial, decorate_before, decorate_after) {
	return function() {
		var initial_call_result;

		if (typeof decorate_before === 'function') {
			decorate_before.apply(this, arguments);
		}
		initial_call_result = initial.apply(this, arguments);
		if (typeof decorate_after === 'function') {
			decorate_after.apply(this, arguments);
		}
		return initial_call_result;
	};
}
