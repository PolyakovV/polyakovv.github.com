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


// получаем главную страницу сайта и выводим в консоль
var req = getXmlHttp();

req.open('get', '/', true);
req.onreadystatechange = function() {
	if (req.readyState !== 4) {
		return;
	}

	if (req.status === 200) {
		console.log(req.responseText);
	} else {
		console.error(req.status);
	}
};
req.send();


// абстрагируемся
function ajax(url, onComplete) {
	var req = getXmlHttp();

	req.open('get', url, true);
	req.onreadystatechange = function() {
		if (req.readyState !== 4) {
			return;
		}

		if (req.status === 200) {
			onComplete(req.responseText);
		}
	};
	req.send();
}



// усложняемся
function ajax(url, onComplete, method) {
	method = method || 'GET';
	var req = getXmlHttp();

	req.open(method, url, true);
	req.onreadystatechange = function() {
		if (req.readyState !== 4) {
			return;
		}

		if (req.status === 200) {
			onComplete(null, req.responseText);
		} else {
			onComplete(req, null);
		}
	};
	req.send();
}




ajax('/', function (error, response) {
	// Обработка ошибок
	if (error) {
		console.error(error);
		return;
	}

	console.log(response);
});




// работаем со многими урлами
var urls = ['/questions', '/tags', '/about', '/users', '/questions/ask', '/questions/tagged/javascript', '/questions/tagged/css', '/questions/tagged/ajax', '/questions/tagged/html'];

// функция обработки
function getPageTitle (html) {
	var d = document.createElement('div');
	d.innerHTML = html;
	var header = d.querySelector('h1,h2,h3,h4,h5');
	if (header) {
		return header.innerHTML.trim();
	} else {
		return '';
	}
}

// Параллельно
for (var i = 0; i < urls.length; i += 1) {
	ajax(urls[i], function (err, response) {
		console.log(getPageTitle(response));
	});
}


// Последовательно
var nextRequestIndex = 0;

function processRequests() {
	if (nextRequestIndex < urls.length) {
		ajax(urls[nextRequestIndex], function (err, response) {
			console.log(getPageTitle(response));
			nextRequestIndex += 1;
			processRequests();
		});
	}
}
processRequests();




// Параллельные запросы с лимитом на количество одновременно запущенных запросов
function inParallel(ascynArgs, async, callback, maxParallel) {
	maxParallel = maxParallel || 3;
  
	var nextToProcess = 0;
	var inProcessNow = 0;
	var result = [];
 
	function processByIndex (currentToProcess) {
		if (inProcessNow < maxParallel) {
			if (currentToProcess < ascynArgs.length) {
				inProcessNow += 1;
				nextToProcess += 1;
				async(ascynArgs[currentToProcess], function () {
					result[currentToProcess] = arguments;
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


inParallel(urls, ajax, function (response) {
	console.log(response);
});
