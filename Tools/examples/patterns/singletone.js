function singletone() {
	if (!singletone.instance) {
		// Create and remember instance
		singletone.instance = {
			// implementation
		}
	}
	return singletone.instance;
}




var singletone = (function () {
	var instance = {
		// implementation
	};

	return function () {
		return instance;
	}
}());






var Singletone = (function () {
    var instance;

    return function ConstructSingletone () {
        if (instance) {
            return instance;
        }
        if (this && this.constructor === ConstructSingletone) {
            instance = this;
        } else {
            return new ConstructSingletone();
        }
    }
}());
