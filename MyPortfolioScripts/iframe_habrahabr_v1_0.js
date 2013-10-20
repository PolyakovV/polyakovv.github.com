// Задание:
// Превратить меню хабры http://grab.by/r434 в меню из табов. Внешне вид никак не должен измениться,
// изменяется поведение. Активный таб должен подсвечиваться, как это сейчас происходит (только без перехода на странцы).
// Скрипт должен быть самодостаточным и работать только на гравной странице хабра.


// При нажатии на таб, должно показываться содержимое страницы, куда вела оригинальная ссылка из меню, в ифрейме.
// Высота ифрейма подстраивается под высоту содержимого. В ифрейме убраны части страницы (шапка с меню), 
// которые будут дублироваться визуально. Ключевая задача - сделать переключение по пункам меню моментальным. 
// Состояния внутри ифреймов должны сохраняться между переключениями (но не сохраняется при перезагрузке страницы). 
// Обновление содержимого ифрейма происходит следующим образом: при клике по табу показывается ифрейм с содержимым таба, 
// при повторном клике - содержимое ифрейма обновляется. При перезагрузке главной страницы и повторном выполнении 
// скрипта становится активным тот таб, который был активным до перезугрузки.


 //  Скрипт проверен в Google Chrome, Opera, FF, (IE10, IE9 появляется скролл - несмог побороть)
 //  при дебаге в IE - не удаляет сиблинги основного контейнера - отсюда большая длина и ширина
 //  


 $(function() {

 	'use strict'

 	var DAYS_COOKIEs_LIFE = 30;
 	var iframeStatus = $('<span> Please  wait!  </span>');
 	var containerMenu = $('.main_menu a');
 	var activeTab = $('.main_menu a.active');
 	var conteinerNode = $('.content_left');

 	/////////////////////////////////////

 	function setCookie(name, value, expires, path, domain, secure) {
 		var str = name + "=" + escape(value) +
 		((expires) ? "; expires=" + expires : "") +
 			((path) ? "; path=" + path : "") +
 			((domain) ? "; domain=" + domain : "") +
 			((secure) ? "; secure" : "");

 		document.cookie = str;
 		//console.log(str);
 	}

 	function getCookie(name) {
 		var cookie = " " + document.cookie;
 		var search = " " + name + "=";
 		var setStr = null;
 		var offset = 0;
 		var end = 0;
 		if (cookie.length > 0) {
 			offset = cookie.indexOf(search);
 			if (offset != -1) {
 				offset += search.length;
 				end = cookie.indexOf(";", offset)
 				if (end == -1) {
 					end = cookie.length;
 				}
 				setStr = unescape(cookie.substring(offset, end));

 			}
 		}
 		// console.log(setStr);
 		return (setStr);

 	}

 	/////////////////////////////////////
 	//____________ Создаем и возвращаем массив URL из коллекции тегов 'A'______________

 	function getLinksFromHTML(arr) {
 		var links = [];
 		for (var i = 0; i < arr.length; i++) {
 			links[links.length] = arr[i].href;
 		};
 		return links;
 	}

 	var linksArr = getLinksFromHTML(containerMenu); // получаем массив ссылок

 	function appendIframe(url, node, iFrameReady) { // добавляем iFrame и обрабатываем колбэк 

 		var iframe = $(document.createElement('iframe'));
 		iframe.prop('src', url);
 		iframe.addClass('content_left');
 		iframe.load(function() { //  редактирование Iframe сразу после загрузки

 			var frameContents = $(this).contents();
 			var content = frameContents.find('.content_left');
 			var container = $('.content_left');
 			var _this = $(this);
 			var newIfrHeight = container.height(); // определяем высоту по содержимому
 			var newIfrWidth = container.width(); // определяем ширину по родному контейнеру content_left
 			content.width(newIfrWidth + 'px');

 			if (_this.css('display') === 'none') {
 				_this.show();
 				newIfrHeight = content.height();
 				_this.hide();
 			} else {
 				newIfrHeight = content.height();
 			}
 			_this.attr('scrolling', 'no');
 			_this.css({
 				'display': 'none'
 			});

 			_this.height(newIfrHeight + 'px');
 			_this.width(newIfrWidth + 'px');
 			content.siblings()
 				.each(function() {
 					$(this).hide();
 				});
 			content.parent().css({
 				'padding': '0px'
 			});

 			$(_this.prop('contentWindow')).unload(function() {
 				_this.hide();
 				iframeStatus.show();
 			});

 			var lastHref = getCookie('lastOpenTab');
 			if (this.src === lastHref) {
 				_this.show();
 			} else {
 				_this.hide();
 			}
 			iframeStatus.hide();
 			iFrameReady(); // callback для супервизора загрузки
 		});

 		iframe.hide();
 		iframe.appendTo(node);

 	}

 	// супервизор загрузки - распределение параллельно до 3-х ифреймов одновременно - колбэк по завершению

 	function inParallel(ascynArgs, node, async, callback, maxParallel) {
 		maxParallel = maxParallel || 3;

 		var nextToProcess = 0;
 		var inProcessNow = 0;

 		function processByIndex(currentToProcess) {
 			if (inProcessNow < maxParallel) {
 				if (currentToProcess < ascynArgs.length) {
 					inProcessNow += 1;
 					nextToProcess += 1;
 					async(ascynArgs[currentToProcess], node, function() {
 						inProcessNow -= 1;
 						processByIndex(nextToProcess);
 					});
 				} else {
 					if (!inProcessNow) {
 						callback();
 					}
 				}
 			}
 		}

 		for (var i = 0; i < ascynArgs.length && inProcessNow < maxParallel; i += 1) {
 			processByIndex(i);
 		}
 	}


 	//подгонка загруженного фрейма 

 	function selectTab(event) {

 		event.preventDefault(); // отменяем переход по ссылке

 		var openTab = $('[src = "' + event.target.href + '"]');

 		//___________Reload______________________
 		if ($(event.target).hasClass('active')) { // Если на ссылке имеется атрибут active 
 			openTab.attr('src', event.target.href); // переписываем src - инициируем загрузку(обработчик уже стоит)
 		}
 		//___________End of reload________________

 		var activeTab = $('.main_menu a.active'); // меню активного таба
 		activeTab.removeClass('active'); // делаем неактивным
 		$(event.target).addClass('active'); // на которое кликнули - делаем активным
 		$('.openTab').removeClass('openTab').hide(); // тоже, но уже с самим табом
 		openTab.addClass('openTab');
 		openTab.show();

 		// Устанавливаем куки сроком 1 мес
 		//___________ cookie block _______________
 		var cookieDate = new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * DAYS_COOKIEs_LIFE).toUTCString(); // set on month
 		setCookie('lastOpenTab',
 			event.target.href,
 			cookieDate,
 			document.location.pathname,
 			document.location.host, false);
 		//___________ End cookie block _______________
 	}



 	function makeVisibleTabOnClick() {
 		iframeStatus.hide();
 		var activeTab = $('.main_menu a.active');

 		containerMenu.on('click', selectTab);

 		var linkFromCookie = getCookie('lastOpenTab');
 		var openTab;
 		var activeTab = $('.main_menu a.active'); //
 		activeTab.removeClass('active'); //
 		if (linkFromCookie) { // если куки есть и в нем то, что нужно 
 			openTab = $('[src = "' + linkFromCookie + '"]');
 			activeTab = $('[href = "' + linkFromCookie + '"]');
 		} else {
 			openTab = $('[src = "' + activeTab.prop('href') + '"]');
 			activeTab = $('[href = "' + activeTab.prop('href') + '"]');
 		}
 		openTab.addClass('openTab'); //отображение выбранного таба
 		openTab.show();
 		activeTab.addClass('active'); // подсветка выбранного меню 

 	}

 	conteinerNode.empty(); // чистка места
 	conteinerNode.prepend(iframeStatus);
 	inParallel(linksArr, conteinerNode, appendIframe, makeVisibleTabOnClick, 3);
 	// паралельная загрузка и обработка в асинхронном режиме до 3-х ифреймов с их обработкой и колбэком


 });