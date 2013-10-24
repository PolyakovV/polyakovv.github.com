
var catalogCont = $('.catalog');
var loader = $('.loader');
var goodsCont = $('.content .goods');
var cartMini = $('.basket');
var popup = $('.popup_wrap');
var productURL = window.location.href + 'JSON/groups.json';
 
function openGroupsItems(event) 
{ 
console.log(event.target.className);
};

$(document).on('groupsReady', function(){
      console.log('readyGroups');
        $('.groups li').on('click', openGroupsItems);
    }
    );

function genGropsList(url) { // получение списка групп
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
genGropsList(productURL);





