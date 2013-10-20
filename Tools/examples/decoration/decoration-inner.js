function decorate(original, before, after, context) {
	return function () {
		context = context || this;
		var res;
		if (typeof before === 'function') {
			before.apply(context, arguments);
		}
		res = original.apply(context, arguments);
		if (typeof after === 'function') {
			after.apply(context, arguments);
		}
		return res;
	};
}


parseScriptTags = decorate(parseScriptTags, function (url, obj) {
	var hiddenStyle = jQuery('<style>.tabCnt *{visibility: hidden;}</style>');
	jQuery('head').append(hiddenStyle);

	setTimeout(function () {
		modifyTab(jQuery('.tabCnt:visible'));
		hiddenStyle.remove();
	}, 0);
});


function modifyTab (tabNode) {
	console.log(tabNode.html());
}
