
var catalogCont = $('.catalog');
var loader = $('.loader');
var goodsCont = $('.content .goods');
var cartMini = $('.basket');
var popup = $('.popup_wrap');
//var productURL ='JSON/groups.json';
var productURL = window.location.host + '/JSON/groups.json';


 
jQuery(document).ready(function () {  jQuery(document).trigger('startInit')});



function openGroupsItems(event) 
{ 
console.log(event.target.className);
};

$(document).on('groupsReady', function(){
      console.log('readyGroups');
        $('.groups li').on('click', openGroupsItems);
    }
    );

function genGroupsList(url) { // получение списка групп
    console.log(url);
    $.getJSON(url, function(data) {
        var items = [];
        $.each(data, function(key, val) { // формирование списка
            items.push('<li groupId="' + key + '" class=' + val.class + '>' + val.name + '</li>');
        });

        $('<ul/>', {
            'class': 'groups',
            html: items.join('')
        }).appendTo(catalogCont);
        $(document).trigger('groupsReady');
    });

}

jQuery(document).on('startInit', genGroupsList);




