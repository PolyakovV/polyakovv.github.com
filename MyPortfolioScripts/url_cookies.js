//
//  Проверен в Opera, FF, IE10
//  При остановке на ссылке более TIME_TO_WAIT_mS происходит запись cookies c адресом и ссылкой-целью 
//  Не на jQuery - не на всех страницах подключена библиотека.


(function() {
	'use strict'
	var TIME_TO_WAIT_mS = 1000;
	var MAX_COOKIES_IN_BROWSER = 300;
	var MAX_LINKS_IN_COOKIES = 20;
	var MAX_BYTES_IN_COOKIES = 4096;

	function bindEvent(node, eventName, handler) {
		var handler_wrapper = function(event) {
			event = event || window.event;
			if (!event.target && event.srcElement) {
				event.target = event.srcElement;
			}
			return handler.call(node, event);
		};

		if (node.addEventListener) {
			node.addEventListener(eventName, handler_wrapper, false);
		} else if (node.attachEvent) {
			node.attachEvent('on' + eventName, handler_wrapper);
		}
		return handler_wrapper;
	}

	var closest = (function() {
		return function(node, callback) {
			var nextParent = node;

			while (nextParent && (!callback(nextParent))) {
				nextParent = nextParent.parentNode;
			}
			return nextParent;
		}
	})();

	var toId;
	var numbOfCookie = 0;
	var numbOfLink = 0;

	function linkToCookie(event) {
		event = event || window.event
		if (event.preventDefault) {
			event.preventDefault();
		} else {
			event.returnValue = false;
		}

		var target = event.target || event.srcElement;

		if (target.tagName !== 'A') {
			target = closest(target, function(node) {
				return node.nodeName === 'A';
			});
		}

		function setCookie(name, value, expires, path, domain, secure) {
			var str = name + "=" + escape(value) +
			//var str = name + "=" + value +
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
			console.log(setStr);
			return (setStr);
			
		}


		function prepareToSetCookie() {
			var cookieDate = new Date(new Date().getTime() + 1000 * 60 * 60 * 24).toUTCString();

			var url = (document.location.href).toString() + ' ';
			var prevCookie;
			var link;
			var obj;
			if (target.href !== undefined) {
				if (numbOfCookie > MAX_COOKIES_IN_BROWSER) {
					numbOfCookie = 0;
				}
				if (numbOfLink < MAX_LINKS_IN_COOKIES) {
					numbOfLink += 1;
				} else {
					numbOfLink = 0;
					numbOfCookie += 1;
				}
				prevCookie = getCookie('links' + numbOfCookie);
				link = 'LINK' + numbOfLink + '=' + target.href ;
				obj = ' URL' + numbOfLink +'=' + url + link + 'ID'+numbOfLink + '; ';
				if ((prevCookie + obj).length > MAX_BYTES_IN_COOKIES) {
					numbOfCookie += 1;
					prevCookie = '';
				}
				// если размер превысит 4096 символов пишем в следующий номер и обнуляем
				setCookie('links' + numbOfCookie,
					obj + prevCookie,
					cookieDate,
					document.location.pathname,
					document.location.host, false);

			} else {
				clearTimer()
			}
		}
		if (target) {
			toId = setTimeout(prepareToSetCookie, TIME_TO_WAIT_mS);

		}


	}

	function clearTimer() {
		clearTimeout(toId);
	}

	bindEvent(document.body, 'mouseover', linkToCookie);
	bindEvent(document.body, 'mouseout', clearTimer);
})()