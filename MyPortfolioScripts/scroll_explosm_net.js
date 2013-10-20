// Сделать "бесконечную" ленту на http://www.explosm.net/comics/3305/ из комиксов. 
// При прокручивании странице ниже, должна подгружатся и вставляться картинка 
// со следующей страницы. Учтите, что иногда вставляется видео.
// Решение должно быть самодостаточным (внутри одной анонимной функции)

// Жесткая привязка к сайту
// отсутсвует буферизация 
// + поудалял баннера только с дозогружающихся страничек
//
(function() {
	'use strict';
	function addEventList(node, eventName, handler) {
		if (node.addEventListener) {
			node.addEventListener(eventName, handler, false);
		} else if (node.attachEvent) {
			node.attachEvent('on' + eventName, handler);
		}
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

	function getDOMofURL(URL) {
		var xmlhttp = getXmlHttp();
		var bodyContainer = document.createElement('body');
		xmlhttp.open('GET', URL, false);
		xmlhttp.onreadystatechange = function() {
			if (xmlhttp.readyState === 4) {
				if (xmlhttp.status === 200) {

					bodyContainer.innerHTML = xmlhttp.responseText.match(/<body>[\s\S]*<\/body>/gim)[0];

				}
			}
		};

		xmlhttp.send(null);

		return bodyContainer;
	}

	var nextComicsLink = document.querySelectorAll('[rel="next"]');
	document.querySelector('[id="maincontent"]').className = "scroll-gall";

	var link = 'http://www.explosm.net/comics/3305';
	var divContainer = document.createElement('div');
	divContainer.className = 'scroll-container';
	document.body.appendChild(divContainer);
	var oldLink;

	var comicsWindowOnScrreeen = function() {


		if (oldLink !== nextComicsLink[nextComicsLink.length - 1].href) {
			addComicsToPage(divContainer, nextComicsLink[nextComicsLink.length - 1].href);
		} else {
			nextComicsLink[nextComicsLink.length] = document.querySelectorAll('[rel="first"]')[0];
			addComicsToPage(divContainer, nextComicsLink[nextComicsLink.length].href);
		}
		oldLink = nextComicsLink[nextComicsLink.length - 1].href;
	};


	var handlerEv = function() {
		var comicsWindow = document.querySelectorAll('[alt="Cyanide and Happiness, a daily webcomic"]');
		nextComicsLink = document.querySelectorAll('[rel="next"]');
		var browserWindowHeight = Math.min(document.body.clientHeight, document.documentElement.clientHeight); // высота окна браузера
		var vScrollerPos = Math.max(document.body.scrollTop, document.documentElement.scrollTop);
		var isVisible = (vScrollerPos + browserWindowHeight) - (comicsWindow[comicsWindow.length - 1].offsetTop + comicsWindow[comicsWindow.length - 1].offsetHeight);
		// сводим к 0 систему координат
		if (isVisible >= 10) {
			comicsWindowOnScrreeen();  //  подгрузка когда предидущий попал на экран (д.з. про красную кнопку :) )
		}
	};

	function addComicsToPage(node, link) {
		var tmpDOM = getDOMofURL(link); // получение ДОМа по ссылке
		var comicsPIC = tmpDOM.querySelector('[id="maincontent"]');
		comicsPIC.className = "scroll-gall";
		comicsPIC.id = "";
		var img = tmpDOM.querySelector('[alt="Cyanide and Happiness, a daily webcomic"]');
		var banner = comicsPIC.getElementsByTagName('table');
		banner[1].parentNode.removeChild(banner[1]);
		var bann2 = comicsPIC.querySelector('[id="bottomad"]');
		bann2.parentNode.removeChild(bann2);
		var bann3 = comicsPIC.querySelector('div');
		bann3.parentNode.removeChild(bann3);
		node.appendChild(comicsPIC);

	}

	addEventList(window, 'scroll', handlerEv); // обработчик события скроллера

}())