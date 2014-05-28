// Задание 1
// В папке с заданием есть исходный файл task_1.htm
// Реализуйте логику определения наиболее часто используемых чекбоксов:
// 1. Создайте функцию, которая будет хранить матрицу выбранных чекбоксов
// 2. Анализ матрицы и выбор максимального значения производится на клик по чекбоксам
// 3. Если количество кликов одинаковое между двумя (или всеми) чекбоксами, тогда за максимальный
// принимается последний выбранный
// 4. Запоминать только те клики, которые включают чекбоксы, выключение не обрабатывать
// 5. Результат анализа должен быть записан в переменную window.filter_results
// 6. Функционал должен работать после перезагрузки страницы и сохранять предыдущее состояние
// матрицы
// 7. Результатом выполнения задания должен быть JavaScript файл, подключенный к странице task_1.htm



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

///////////////////////////////////////////////////////////////////////////////////////
'use strict'
function setCookie(name, value, expires, path, domain, secure) {
    //var str = name + "=" + escape(value) +
    var str = name + "=" + value +
        ((expires) ? "; expires=" + expires : "") +
        ((path) ? "; path=" + path : "") +
        ((domain) ? "; domain=" + domain : "") +
        ((secure) ? "; secure" : "");

    document.cookie = str;
    //console.log('To cookie:' + str);
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
    //console.log('From cookie:' + setStr);
    return (setStr);

}

////////////////////////////////////////////////////////
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

////////////////////////////////////////////////////////
function indexOfMax(arr, currentIndex) { // возвращает индекс максимального элемента массива
    var max, index = 0;
    max = arr[currentIndex];
    index = currentIndex;
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] > max) {
            max = arr[i];
            index = i;
        }
    };
    return index;
}

var filter_results = 0;
var counterOfCheked = {
    cheked: [0, 0, 0, 0, 0],
    max: 0
};

//var checkBoxWrap = document.querySelector('div.wrap ul.multi'); // получили обертку из DOM с checkbox-ами 
var checkBoxWrap = document.getElementsByClassName('wrap')[0]; // получили обертку из DOM с checkbox-ами кроссбраузерно


function handler(event) {
    var pressedCheckBox = event.target;
    var cookieDate = new Date(new Date().getTime() + 1000 * 60 * 60 * 60 * 24).toUTCString();

    if (pressedCheckBox.checked) {
        var lastIndex;
        var arrOfBox = counterOfCheked.cheked;
        var maxInd = counterOfCheked.max;
        counterOfCheked.cheked[pressedCheckBox.value - 1] += 1;
        lastIndex = pressedCheckBox.value - 1; // последний нажатый приравниваем к максимуму
        counterOfCheked.max = lastIndex;
        var tmp = maxInd;
        maxInd = indexOfMax(arrOfBox, maxInd);
        if (arrOfBox[maxInd] == arrOfBox[tmp]) {
            maxInd = tmp;
        }

        if (arrOfBox[lastIndex] < arrOfBox[maxInd]) {
            filter_results = maxInd;
        } else {
            filter_results = lastIndex;
        }

        console.log(filter_results);
        console.log(arrOfBox);

        var tmpObj;
        tmpObj = JSON.stringify(counterOfCheked);

        setCookie('chbox',
            tmpObj,
            cookieDate,
            document.location.pathname,
            document.location.host, false
        ); // запоминаем в куки

    } // если состояние включено - занести в массив, прицеплено к значению value
}



function init() {
    var str;
    str = getCookie('chbox');
    counterOfCheked = JSON.parse(str) || {
        cheked: [0, 0, 0, 0, 0],
        max: 0
    };
    filter_results = counterOfCheked.max;
    bindEvent(checkBoxWrap, 'change', handler);
}


bindReady(init);
