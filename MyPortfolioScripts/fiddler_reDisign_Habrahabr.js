// Домой:
// Взять реализацию задания про редизайн хабры. Вставить код с помощью фиддлера сразу же 
// после библиотеки jquery (возможно несколько подходов как это реализовать). Посмотреть как сработает.
// Вставить код перед библиотекой. Переписать код так, чтобы он корретно сработал, 
// когда библиотека появится на странице (уже позже). (возможно несколько подходов к ожиданию библиотеки).
// Не допускать моргания содержимого страницы (показа вида хабры по умолчанию).
// Пользователь сразу должен увидеть новый дизайн. (возможно несколько подходов).

// Редизайн основной странички http://habrahabr.ru/ - переделан для вставки перед всеми скриптами
// использует jQuery
// Контент отображается уже переделанным
// Проверен с помощью Fiddler, методом подмены основной странички на локально сохраненную и измененную


(function(){
 /////////////////////////////////////////////////////////////////////////////////////////////
document.querySelector('html').style.visibility = 'hidden';

function bindReady(handler){
	 
	    var called = false
	 
    function ready() { // (1)
	        if (called) return
	        called = true
	        handler()
	    }
	 
	    if ( document.addEventListener ) { // (2)
	        document.addEventListener( "DOMContentLoaded", function(){
	            ready()
	        }, false )
	    } else if ( document.attachEvent ) {  // (3)
	 
	        // (3.1)
	        if ( document.documentElement.doScroll && window == window.top ) {
	            function tryScroll(){
	                if (called) return
	                if (!document.body) return
	                try {
                    document.documentElement.doScroll("left")
	                    ready()
	                } catch(e) {
	                    setTimeout(tryScroll, 0)
	                }
	            }
	            tryScroll()
	        }
	 
	        // (3.2)
	        document.attachEvent("onreadystatechange", function(){
	 
	            if ( document.readyState === "complete" ) {
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
	            for(var i=0; i<readyList.length; i++) {
	                readyList[i]()
	            }
	        })
	    }
	 
	    readyList.push(handler)
	}

///______________________________________________________________________

function reDisign(){
 // Привязка к конкретному сайту(http://habrahabr.ru/), его классам, структуре и его оформлению
// Использование JQuery на которую ссылается сайт
	'use strict';
 
// Убираем баннера
	var bannersArr = ['.banner_300x500', '#htmlblock_placeholder', '.fast_navigator']; // массив банеров и прочего, чего убрать

	bannersArr.forEach(function(elem) {
		$(elem).remove();
	}); // собственно удаляем

	var copyQA = $('.live_broadcast').clone(true, true); //копируем для QA 
	var copyPOST = $('.live_broadcast').clone(true, true); //копируем для POST

	copyQA.find("span[data-type=qa_activity]").addClass('open'); // добавляем класс, только для стиля open

	copyQA.find('.live_broadcast_activity').remove();   // удаляем из ветки QA все Посты 
	copyQA.find("span[data-type=live_broadcast_activity]").remove(); // удаляем ссылку открытия Постов из QA

	copyPOST.find('.qa_activity').remove();  // удаляем из ветки Посты все QA
	copyPOST.find("span[data-type=qa_activity]").remove(); // удаляем ссылку открытия QA из Постов



	$('.live_broadcast').replaceWith(copyQA); // заменяем родной Прямой эфир  на QA
	copyPOST.insertAfter('.live_broadcast');  // после него добавляем Posts

// Убираем всю панель поблочно, с анимацией.
	$('.sidebar_right .block .title').each(function() {
			$(this).next().hide(); 
	});

	$('.dotted').off();
	
	$('.sidebar_right div .title').css('cursor', 'pointer');

	$('.sidebar_right .block .title').click(function() {
		$(this).next().slideToggle('slow');
	});


// Функция скрытия ненужный полей контента публикаций
	function hideContent(node) {
		$(node).find('.content, .published, .infopanel_wrapper, .flag').hide(); // скрываем ненужную инфу
	}

	hideContent('body');

// Функция добавление количества комментариев 
	function addComments(node) {
		var comments = $(node).find('span.all');
		$(node).find('.posts_list .hubs')
			.each(function(index) {
				var tmp = ((parseInt(comments.eq(index).text()).toString()) != "NaN") ? (parseInt(comments.eq(index).text())) : 'No'
				$(this).append(" [ " + tmp + " comments ]");
			});
	}
	addComments('body');

// Определение кол-ва страниц, генерация ссылки, подгрузка и вызов обработки контента

	var lastPage = parseInt($('#nav-pages li:last').text());
	var container = document.createElement('div');
	var postContainer = $('.posts_list').eq(0);
	for (var i = 2; i <= lastPage; i++) {
		$.get(document.location.href + 'page' + i,
			function(responseData) {
				container.innerHTML = responseData.match(/<body>[\s\S]*<\/body>/gim)[0];
				hideContent(container);
				addComments(container);
				postContainer.append($(container).find('.shortcuts_items'));
			});
	}
	$('div.page-nav').remove();  // удаляем постраничную навигацию

$('html').css('visibility', 'visible');

};

onReady(reDisign);


})();      

//////////////////////////////////////////////////////////////////////////////////////////////////////