(function() {
	"use strict";
	//
	//  Жесткая привязка к страничкам  
	//  Параллельная обработка до 3-х запросов
	//  
	//
	var objOfFlashOnPage = [];

	function getLinksOfPages(maxPages) {
		var arrayOfLinks = [];
		for (var i = 1; i <= maxPages; i++) {
			arrayOfLinks[i - 2] = '//rozetka.com.ua/usb-flash-memory/c80045/page=' + i;
		}

		return arrayOfLinks;
	}

	function getXmlHttp() {
		var xmlhttp;
		try {
			xmlhttp = new ActiveXObject("Msxml2.XMLHTTP");
		} catch (e) {
			try {
				xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
			} catch (E) {
				xmlhttp = false;
			}
		}
		if (!xmlhttp && typeof XMLHttpRequest != 'undefined') {
			xmlhttp = new XMLHttpRequest();
		}
		return xmlhttp;
	}
	/////////////////////////////////////
	// Параллельные запросы с лимитом на количество одновременно запущенных запросов

	function inParallel(ascynArgs, async, callback, maxParallel) {
		maxParallel = maxParallel || 3;

		var nextToProcess = 0;
		var inProcessNow = 0;
		var result = [];

		function processByIndex(currentToProcess) {
			if (inProcessNow < maxParallel) {
				if (currentToProcess < ascynArgs.length) {
					inProcessNow += 1;
					nextToProcess += 1;
					async(ascynArgs[currentToProcess], function() {
						inProcessNow -= 1;
						processByIndex(nextToProcess);
					});
				} else {
					// We've processed all async callbacks, and this is last one
					if (!inProcessNow) {
						callback(result);
					}
				}
			}
		}

		for (var i = 0; i < ascynArgs.length && inProcessNow < maxParallel; i += 1) {
			processByIndex(i);
		}
	}

// Получение списка продуктов со страницы
	function getFlashmemList(node) {
		var productList = [];
		var allContainers = node.querySelectorAll('.gtile-i-wrap');

		function getProductObject(containersNode) {
			var obj = {};
			var nameNode = containersNode.querySelector('.gtile-i-title a');
			var priceListUAH = containersNode.querySelector('.g-price-uah');
			var priceListUSD = containersNode.querySelector('.g-price-usd');
			var capacityDetail = containersNode.querySelector('.gtile-short-detail li');
			var interfaceOfFlash = containersNode.querySelector('.gtile-short-detail');

			obj.name = nameNode.innerHTML.match(/\S+/g).join(' ');
			obj.url = nameNode.href;
			if (priceListUSD) {
				obj.usd = parseFloat(priceListUSD.innerHTML.match(/\d+(.\d+)?/g)[0]).toFixed(2);
			} else {
				obj.usd = 0;
			}
			if (priceListUSD) {
				obj.ua = parseFloat(priceListUAH.innerHTML.match(/(\d+(.\d+)?)/g)[0]).toFixed(2);
			} else {
				obj.ua = 0;
			}
			obj.memory = capacityDetail.innerHTML.match(/\d+/g)[0];
			if (interfaceOfFlash) {
				obj.usb = parseFloat(interfaceOfFlash.innerHTML.match(/(?:USB\s)\d.\d/gm)[0].replace(/USB\b/gm, '')).toFixed(1);
			} else {
				obj.usb = 2;
			}

			return obj;
		}

		for (var i = 0; i < allContainers.length; i += 1) {
			if (getProductObject(allContainers[i])) {
				productList.push(getProductObject(allContainers[i]));
			}
		}
		return productList;
	}

	var link = '//rozetka.com.ua/usb-flash-memory/c80045/';
	var summArrayOfLinks = [];
	var tmp = document.querySelectorAll('ul.goods-pages-list li a'); // определяем ветку с навигатором страниц
	var pages = parseInt(tmp[tmp.length - 1].innerHTML); // последнюю ссылку парсим в максимальное число страниц 

	summArrayOfLinks = getLinksOfPages(pages); // формируем массив ссылок
   
   // Получение массива объектов флешек с URL методом асинхронного AJAX запроса
	function getFlashMemDataFromPage(URL, onComplete) {
		var xmlhttp = getXmlHttp();
		var bodyContainer = document.createElement('body');
		xmlhttp.open('GET', URL, true); // в асинхронном режиме
		xmlhttp.onreadystatechange = function() {
			if (xmlhttp.readyState === 4) {
				if (xmlhttp.status === 200) {
					bodyContainer.innerHTML = xmlhttp.responseText.match(/<body>[\s\S]*<\/body>/gim)[0];
					objOfFlashOnPage = objOfFlashOnPage.concat(getFlashmemList(bodyContainer));
					// по приходу ответа - парсим и добавляем в массив объектов
					console.log('URL:' + URL + '  Find on page:' + getFlashmemList(bodyContainer).length);
					onComplete(); // запускаем колбек
				}
			}
		};
		xmlhttp.send(null);
	}

	getFlashMemDataFromPage(link, function() {}); // с первой страницы собираем данные 

	var show = function() {
		console.log(objOfFlashOnPage);
		console.log('Objects=', objOfFlashOnPage.length);
	} // вывод в консоль

	inParallel(summArrayOfLinks, getFlashMemDataFromPage, show);

})();