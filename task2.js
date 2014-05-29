( function () {
/////////////////////////// Формирование кроссбраузерно запросов ////////////////////////////////////////////////////////////
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

	function getDOMofURL(URL, callback) {
		var xmlhttp = getXmlHttp();
		var bodyContainer = document.createElement('body');
		xmlhttp.open('GET', URL, false);
		xmlhttp.onreadystatechange = function() {
			if (xmlhttp.readyState === 4) {
				if (xmlhttp.status === 200) {

					bodyContainer.innerHTML = xmlhttp.responseText.match(/<body>[\s\S]*<\/body>/im)[0].toString();

				}
			}
		};

		xmlhttp.send(null);
        callback(bodyContainer);
		//return bodyContainer;
	}

/////////////////////////////////////// Кроссбраузерный обработчик события готовности  /////////////////////////////
function bindReady(handler) {

    var called = false

        function ready() { // (1)
            if (called) return
            called = true
            handler()
        }

    if (document.addEventListener) { // (2)
        document.addEventListener("DOMContentLoaded", function() {
            ready()
        }, false)
    } else if (document.attachEvent) { // (3)

        // (3.1)
        if (document.documentElement.doScroll && window == window.top) {
            function tryScroll() {
                if (called) return
                if (!document.body) return
                try {
                    document.documentElement.doScroll("left")
                    ready()
                } catch (e) {
                    setTimeout(tryScroll, 0)
                }
            }
            tryScroll()
        }

        // (3.2)
        document.attachEvent("onreadystatechange", function() {

            if (document.readyState === "complete") {
                ready()
            }
        })
    }

    // (4)
    if (window.addEventListener)
        window.addEventListener('load', ready, false)
    else if (window.attachEvent)
        window.attachEvent('onload', ready)
        /*  else  // (4.1)
            window.onload=ready
        */
}
readyList = []

function onReady(handler) {

    if (!readyList.length) {
        bindReady(function() {
            for (var i = 0; i < readyList.length; i++) {
                readyList[i]()
            }
        })
    }

    readyList.push(handler)
}

/////////////////////////////////////// Кроссбраузерный обработчик событий  /////////////////////////////
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



var btn1;
var btn2;
var url ="http://polyakovv.github.io/index.html";

function updatePanel1(tmpDOM){
var container = document.getElementsByClassName('container')[0];
container.innerHTML='';
var extract = tmpDOM.querySelectorAll("IMG");
console.log(extract);
//console.log(extract);
for (var i = 0; i < extract.length; i++) {
	container.appendChild(extract[i]);
};

}

function updatePanel2(tmpDOM){
var container = document.getElementsByClassName('container')[0];
   container.innerHTML='';
var extract = tmpDOM.querySelectorAll("A");
var ul = document.createElement("ul");
for (var i = 0; i < extract.length; i++) {
	var li = document.createElement("li");
    li.appendChild(extract[i]);
    ul.appendChild(li);
};

container.appendChild(ul);
}

////////////////////////////////////////////////////////
function handler(event) {
var tmpDOM;
    if (event.target.className ==="bt1") { tmpDOM = getDOMofURL(url, updatePanel1);  }
    if (event.target.className ==="bt2") { tmpDOM = getDOMofURL(url, updatePanel2);  }
      


}



function init() { // инициализация, навешивание обработчика событий
    btn1 = document.getElementsByClassName('bt1')[0];
    btn2 = document.getElementsByClassName('bt2')[0];
    bindEvent(document, 'click', handler);

}


onReady(init);

})();
