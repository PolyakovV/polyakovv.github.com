'use strict';

function testUniqueElem (arr){

	function uniqueElem (){
		function contains(item, array){ // функция проверки вхождения элемента
			var elementPresents = false; // false - нет элемента

			for(var i = 0; i < array.length; i++){
				if(array[i].tagName === item) {
					elementPresents = true; // true - есть элемент
					break;
				}
			}

			return flag;
		}


		var result = [];
		var liveCollection = document.getElementsByTagName("*");
		var elemList = [].slice.call(liveCollection); // "порезали" на массив

		top: // метка на внешний for
		for (var i = 0; i < elemList.length; i++){
				if ( contains(elemList[i].tagName, result) ){
					continue top;
				} else {
					result.push(elemList[i]);
				}
		}

		return result;
	}

	var origUniqueArrElem = uniqueElem();

	if (origUniqueArrElem.length === arr.length){
		for (var i = 0; i < origUniqueArrElem.length; i++){
			if (origUniqueArrElem[i].tagName !== arr[i].tagName) {
				return false;
			}
		}
	}

	return true;
}