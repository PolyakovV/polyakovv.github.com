// Задание :
// Получить данные о продуктах на розетке с других страниц категории (ссылки - внизу на педжинаторе). 
// Вывести в консоль объект со всеми данными.

// Для каждого товара извлечь со страницы следующие данные:
// http://rozetka.com.ua/usb-flash-memory/c80045/
// наименование товара

// цену в долларах
// дену в гривнах
// адрес (урл)
// объем памяти

//  Жесткая привязка к одной группе товара каталога одного конкретного сайта.
//  Зависит от оформления, если поменяются единицы измерения - Вместо GB - ГБ в описании
//  нужно будет переписывать регулярные выражения

'use strict';


var getFlashmemList = function() {
	var productList = [];
	var allContainers = document.querySelectorAll('.gtile-i-wrap');

	function getProductObject(containersNode) {
		var obj = {};
		var listOfContainers = containersNode.querySelector('.gtile-i-title a');
		var priceListUAH = containersNode.querySelector('.g-price-uah');
		var priceListUSD = containersNode.querySelector('.g-price-usd');
        var interfaceOfFlash = containersNode.querySelector('.gtile-short-detail');

		obj.name = listOfContainers.innerHTML.match(/\S+/g).join(' ');
		obj.usd = parseFloat(priceListUSD.innerHTML.match(/\d+(.\d+)?/g)).toFixed(2);
		obj.ua = parseFloat(priceListUSD.innerHTML.match(/\d+(.\d+)?/g)).toFixed(2);
		obj.url = listOfContainers.href;
		obj.memory = listOfContainers.innerHTML.match(/(?:\s)\d+(\s+)?GB/g)[0].replace(/\s/g,'');
		obj.usb = parseFloat(interfaceOfFlash.innerHTML.match(/(?:USB\s)\d.\d/gm)[0].replace(/USB\b/gm,'')).toFixed(1);
		return obj;
	}

	for (var i = 0; i < allContainers.length; i += 1) {
		productList.push(getProductObject(allContainers[i]));
	}
	return productList;
};
getFlashmemList();
