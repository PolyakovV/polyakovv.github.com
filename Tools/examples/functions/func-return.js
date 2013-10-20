function sum (a, b) {
	return a + b;
}

function sumFabric(pinnedValue) {
	return function (plus) {
		return sum(pinnedValue, plus);
	}
}

var sum90 = sumFabric(90)
var sum99 = sumFabric(99)

console.log(sum90(10)); // 100
console.log(sum99(1));  // 100




function main (arg, func) {
	return function () {
		func(arg);
	}
}

var a = main(10, function (value) {
	console.log(value);
});

a(); // 10;
