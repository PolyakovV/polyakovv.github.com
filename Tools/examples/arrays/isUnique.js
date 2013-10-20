function isUnique(arr) {
	var uniqItemsArray;

	uniqItemsArray = arr.filter(function(elem, index) {
		return arr.indexOf(elem) === index;
	});

	return uniqItemsArray.length === arr.length;
}



function isUnique(arr) {
	return arr.filter(function(elem, index) {
		return arr.indexOf(elem) === index;
	}).length === arr.length;
}
