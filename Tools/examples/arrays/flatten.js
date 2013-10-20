function isArray (obj) {
	return Object.prototype.toString.call(obj) === '[object Array]';
}

function flatten (arr) {
	var res;

	res = [];
	for (var i = 0; i < arr.length; i += 1) {
		if (isArray(arr[i])) {
			for (var k = 0; k < arr[i].length; k += 1) {
				res.push(arr[i][k]);
			}
		} else {
			res.push(arr[i]);
		}
	}

	return res;
}


function flatten (arr) {
	var res;
	var midRes;

	res = [];
	for (var i = 0; i < arr.length; i += 1) {
		if (isArray(arr[i])) {
			midRes = flatten(arr[i]);
			for (var j = 0; j < midRes.length; j += 1) {
				res.push(midRes[j]);
			}
		} else {
			res.push(arr[i]);
		}
	}
	return res;
}

function tic () {
	console.log('tic');
	setTimeout(tic, 1000);
}

console.log(flatten([1,[]]));
