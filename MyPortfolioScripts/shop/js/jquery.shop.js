
var catalogCont = $('.catalog');
var container = $('.container');
var loader = $('.loader');
//var goodsCont = $('.content .goods');
var cartMini = $('.basket');
var popup = $('.popup_wrap');
var productURL ='JSON/groups.json';



function openGroupsItems(event) // вызывается при клике на группу, открывает список в таблице
{ 
genTableList(container, 'JSON/' + event.target.className+'.json');
};


$(document).on('groupsReady', function(){ // Навешивает обработчик кликов при готовности списка групп
        $('.groups li').on('click', openGroupsItems);
    });


function genTableList(node, JSONFileUrl){
// console.log(JSONFileUrl);
// console.log(node);
     $.getJSON(JSONFileUrl, function(data) {
         var items = [];
         $.each(data, function(key, val) { // формирование списка
            items.push('<thead>
<tr>
<th align="center" style="width:60px;">№ п.п.</th>
<th align="center">Название закона</th>
<th  align="center" style="width:120px;">Посетителей</th>
</tr>
</thead>
                         <colgroup><COL width="200px"><COL width="90px"><COL width="90px"><COL width="90px"><COL width="15px"></colgroup>' +
                        '<tr itemsId="' + val.item_id + '" class="goods">' +
                        '<td>' + val.name + '</td>' +
                        '<td>' + val.brand + '</td>' +
                        '<td>' + val.modelName + '</td>' +
                        '<td>' + val.price + '</td>' +
                        '<td>' + val.qty + '</td>' +
                        '<td><input type="text" width="30px" name="qty" size="2" value="1"><button>Buy</button>' + '</td>' );
         });

         $('<table/>', {
             'class': 'tableGoods',
              html: items.join('')
         }).appendTo(node);
         $(document).trigger('tableReady');
     });

}

function genGroupsList(url) { // получение списка групп
    console.log(url);
    $.getJSON(url, function(data) {
        var items = [];
        $.each(data, function(key, val) { // формирование списка
            items.push('<li groupId="' + key + '" class=' + val.class + '>' + val.name + '</li>');
            //console.log('<li groupId="' + key + '" class=' + val.class + '>' + val.name + '</li>');
        });

        $('<ul/>', {
            'class': 'groups',
            html: items.join('')
        }).appendTo(catalogCont);
        $(document).trigger('groupsReady');
    });

}

genGroupsList(productURL);




