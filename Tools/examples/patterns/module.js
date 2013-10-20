var module = (function (document, $, mediator) {
	var privateMember;

	function privateFunction() {
		// ...
	}

	// Public functionality
	return {
		publicMethod: function (foo) {
			return privateFunction();
		}
	}
})(document, window.jQuery, Mediator);





module2 = (function () {
	// ...
}(Mediator)); 



module3 = (function () {
	// ...
}(Mediator)); 
