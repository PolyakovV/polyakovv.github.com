// 
// Привязка к конкретному сайту(http://habrahabr.ru/), его классам, структуре и его оформлению
// Использование JQuery на которую ссылается сайт
//


$((function() {
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
	$('.dotted').unbind();
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

})());