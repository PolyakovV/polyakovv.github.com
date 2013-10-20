// Задание: дополнить код из задания "11.Maxymiser-1" так, чтобы он работал для всех вкладок без мигания, а не только для видимой

// Особенности - редизайн существующей странички http://www.paddypower.it/scommesse-calcio
// Выполнен с использованием подключенной jQuery 1.2.6
// Таблица изменяется "на лету" с помощью декоратора.

jQuery(function() {

//___________________________________________________
function decorate(original, before, after, context) {
		return function() {
			context = context || this;
			var res;
			if (typeof before === 'function') {
				before.apply(context, arguments);
			}
			res = original.apply(context, arguments);
			if (typeof after === 'function') {
				after.apply(context, arguments);
			}
			return res;
		};
	}

	function modifyContent(url, obj) {
		var currTab = jQuery('#' + obj.id);
		makeNewDesignOfTable(currTab.eq(0));
	}


	gotAjaxContent = decorate(gotAjaxContent, null, modifyContent);


//___________________________________________________



function  makeNewDesignOfTable(currentTab){
'use strict';

var tabs = jQuery(currentTab).find('.footballcard');
var sort1 = jQuery('th#lb_fb_coupon_col_fb_hp_feat_tab_FEAT_H > a').clone(true, true);
var sortX = jQuery('th#lb_fb_coupon_col_fb_hp_feat_tab_FEAT_D > a').clone(true, true);
var sort2 = jQuery('th#lb_fb_coupon_col_fb_hp_feat_tab_FEAT_A > a').clone(true, true);


function parseTab(node) {
	var rows = jQuery(node).find('tbody[id] tr[id]');
	for (var i = 0; i < rows.length; i++) {
		parseRows(rows[i]);
	};
}

function parseRows(row) {
	var euro = 20;
	jQuery(row).find('.time, .tv, .stats, .bets').css('vertical-align', 'top');

	var b1 = jQuery(row).find('.fbhlt div').eq(0);
	var b2 = jQuery(row).find('.fbhlt div').eq(1);
	var b3 = jQuery(row).find('.fbhlt div').eq(2);
	var b1Float = parseFloat(jQuery(b1).find('.prc').text() * euro).toFixed(0);
	var b2Float = parseFloat(jQuery(b2).find('.prc').text() * euro).toFixed(0);
	var b3Float = parseFloat(jQuery(b3).find('.prc').text() * euro).toFixed(0);

	var newSortNode = document.createElement('td');
	newSortNode.className = 'sort';
	var s1 = document.createElement('tr');
	s1.innerHTML = '<div class="sort_ref"> </div>';

	jQuery(s1).children().append(sort1.clone(true, true));
	var s2 = document.createElement('tr');
	s2.innerHTML = '<div class="sort_ref"> </div>';
	jQuery(s2).children().append(sortX.clone(true, true));
	var s3 = document.createElement('tr');
	s3.innerHTML = '<div class="last_sort_ref"> </div>';
	jQuery(s3).children().append(sort2.clone(true, true));

	jQuery(newSortNode).append(s1);
	jQuery(newSortNode).append(s2);
	jQuery(newSortNode).append(s3);

	////////////////////////////////
	var newButtNode = document.createElement('td');
	newButtNode.className = 'fbhlt';

	var b1tr = document.createElement('tr');
	jQuery(b1tr).append(b1);

	var b2tr = document.createElement('tr');
	jQuery(b2tr).append(b2);

	var b3tr = document.createElement('tr');
	jQuery(b3tr).append(b3);

	jQuery(newButtNode).append(b1tr);
	jQuery(newButtNode).append(b2tr);
	jQuery(newButtNode).append(b3tr);

	var newTextNode = document.createElement('td');
	newTextNode.className = 'fbhlt';

	var b1Text = document.createElement('tr');
	var b2Text = document.createElement('tr');
	var b3Text = document.createElement('tr');
	b1Text.innerHTML = '<div class="gioca_bets">gioca €' + euro + ' vinci €' + b1Float + '</div>';
	b2Text.innerHTML = '<div class="gioca_bets">gioca €' + euro + ' vinci €' + b2Float + '</div>';
	b3Text.innerHTML = '<div class="last_gioca_bets">gioca €' + euro + ' vinci €' + b3Float + '</div>';


	jQuery(newTextNode).append(b1Text);
	jQuery(newTextNode).append(b2Text);
	jQuery(newTextNode).append(b3Text);

	//console.log(newSortNode)
	jQuery(row).find('.fbhlt').eq(0).replaceWith(newSortNode);
	jQuery(row).find('.fbhlt').eq(0).replaceWith(newButtNode);
	jQuery(row).find('.fbhlt').eq(1).replaceWith(newTextNode);
}

for (var i = 0; i < tabs.length; i++) {
	parseTab(tabs[i]);
	var cols = jQuery(tabs[i]).find('col');
	cols.eq(3).css('width', '15px');
	cols.eq(5).css('width', '130px');
	cols.eq(6).css('width', '10px');
}

jQuery('tr').css({
	'color': '#197CAF',
	'font-size': '12px',
	'font-weight': 'normal',
	'overflow': 'visible',
	'border-right': 'none !important',
	'vertical-align': 'middle',
	'text-align': 'left'
});

jQuery('.gioca_bets').css({
	'height': '28px',
	'align': 'left'
});

jQuery('.sort_ref').css({
	'height': '30px',
	'vertical-align': 'middle',
	'text-align': 'right',
	'border-right': 'none !important',
	'border-left': 'none !important'
});

jQuery('.sort').css({
	'border-right': 'none',
	'border-left': 'none'
});




}

makeNewDesignOfTable();

});