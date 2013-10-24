
var COOKIE_LIVETIME_DAYS = 30;
var catalogCont = $('.catalog');
var container = $('.container');
var loader = $('.loader');
//var goodsCont = $('.content .goods');
var cartMini = $('.basket');
var popup = $('.popup_wrap');
var productURL ='JSON/groups.json';
var currentGroup;

var itemsBuy;
var itemsBuyQty;
var currTableJSON;
var basket=[];

    var mediator = (function() {

        var subscriptions = {};


        return {
            //event   - событие
            //handler - собственно  обработчик
            subscribe: function(event, handler) {

                if (subscriptions.hasOwnProperty(event)) {
                    subscriptions[event].push(handler);
                } else {
                    subscriptions[event] = [handler];
                }
            },
            trigger: function(eventName, data) {

                if (subscriptions.hasOwnProperty(eventName)) {
                    for (var i = 0; i < subscriptions[eventName].length; i++) {
                        subscriptions[eventName][i].call(window, data);
                    };
                }
            },
            unsubscribe: function(eventName, handler) {
                var indexOfhandler = -1;

                if (subscriptions.hasOwnProperty(eventName)) {

                    indexOfhandler = subscriptions[eventName].indexOf(handler);

                    if (indexOfhandler === -1) {
                        subscriptions[eventName].length = 0;
                    } else {
                        //в теории мы можем зарегистирровать  много  одинаковых  обработчиков для одного  события
                        // разумным будет разобраться со  всеми  одним махом
                        while (indexOfhandler !== -1) {
                            subscriptions[eventName].splice(indexOfhandler, 1);
                            indexOfhandler = subscriptions[eventName].indexOf(handler);
                        }
                    }
                };
            }
        };
    }())
function setCookie(name, value, expires, path, domain, secure) {
            var str = name + "=" + escape(value) +
            //var str = name + "=" + value +
                ((expires) ? "; expires=" + expires : "") +
                ((path) ? "; path=" + path : "") +
                ((domain) ? "; domain=" + domain : "") +
                ((secure) ? "; secure" : "");

            document.cookie = str;
            console.log('Set:' + str);
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
            console.log('Get:' + setStr);
            return (setStr);
            
        }

mediator.subscribe('init', function(){
    var obj = getReservItemsFromCookie();
if (obj) {basket.push(obj);} // если есть куки - прочитать в корзину
console.log('Init Ok');
});

function openGroupsItems(event) // вызывается при клике на группу, открывает список в таблице
{  $('.tableGoods').remove(); // удаляем старую таблицу, если есть
   genTableList(container, 'JSON/' + event.target.className+'.json');
};


mediator.subscribe('tableReady', function(){ // Навешивает обработчик кликов при готовности таблицы
       $('.butt').on('click',function(event){
       addToBasket(currentGroup, event.target.id, $('[id=inp' + event.target.id + ']').val());
           })
    });
 
 mediator.subscribe('tableReady', function(){
    $(".tableGoods").sorter({sortList: [ [0, 0]  ]});   // проверено работает сортировка
 })



mediator.subscribe('groupsReady', function(){ // Навешивает обработчик кликов при готовности списка групп
        $('.groups li').on('click', openGroupsItems);
        genTableList(container, 'JSON/' + currentGroup + '.json');
    });


 mediator.subscribe('addToBasket', function(){
        genBasket();
    })

function genTableList(node, JSONFileUrl){
         $.getJSON(JSONFileUrl, function(data) {
         var items = [];
         currTableJSON = data;
         //console.log(data);
         items.push('<colgroup><COL width="220px"><COL width="120px"><COL width="100px">'+
                              '<COL width="100px"><COL width="100px"><COL width="40px"><COL width="40px"></colgroup>'+
                    '<thead><tr><th align="left"> Наименование </th>'+
                               '<th align="left">Производитель</th>'+
                               '<th  align="left" >Модель</th>'+
                               '<th  align="left" >Цена,грн</th>'+
                               '<th  align="left" >Кол-во</th>'+
                               '<th  align="center" >Шт</th>'+
                               '<th  align="center" >Оформить</th>'+
                               '</tr></thead>');
         $.each(data, function(key, val) { // формирование списка
            items.push('<tr itemsId="' + val.item_id + '" class="goods">' +
                        '<td>' + val.name + '</td>' +
                        '<td>' + val.brand + '</td>' +
                        '<td>' + val.modelName + '</td>' +
                        '<td>' + val.price + '</td>' +
                        '<td>' + val.qty + '</td>' +
                        '<td><input id="inp' + val.item_id + '" type="text" width="30px" name="qty" size="2" value="1" ></td>'+
                        '<td><button  id=' + val.item_id + ' class="butt"' + ' value=' + val.item_id + '>Купить</buttton></td>' );

            items.push('</tr>');
           });

         $('<table/>', {
             'class': 'tableGoods',
              html: items.join('')
         }).appendTo(node);
          
         mediator.trigger('tableReady');
     });

}

function genGroupsList(url) { // получение списка групп
    //console.log(url);
        $.getJSON(url, function(data) {
            currentGroup = data[0].class;
            console.log(currentGroup);
        var items = [];
        $.each(data, function(key, val) { // формирование списка
            items.push('<li groupId="' + key + '" class=' + val.class + '>' + val.name + '</li>');
            //console.log('<li groupId="' + key + '" class=' + val.class + '>' + val.name + '</li>');
        });
           
           //console.log(currentGroup);
        $('<ul/>', {
            'class': 'groups',
            html: items.join('')
        }).appendTo(catalogCont);

        mediator.trigger('groupsReady');
    });

}

 genGroupsList(productURL);


function getReservItemsFromCookie(){
    var obj;
    var str;
    str = getCookie('goods');
    var obj = jQuery.parseJSON(str);
  return obj;  
}


function addToBasket(currentGroup, id, qty ){ // сохраняет в корзине
    var cookieDate = new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * COOKIE_LIVETIME_DAYS).toUTCString();
    var str;
    str = '{ "currentGroup":"'+ currentGroup +'","id":'+ id + ',"qty":' +qty +'}';
    var obj = jQuery.parseJSON(str); // JSON в объект
    basket.push(str);
    console.log(str);
    str = JSON.stringify(bas setCookie('goods', str, cookieDate, document.location.pathname,document.location.host, false); mediator.trigger('addToBasket'); //console.log(obj);}


 function genBasket(){ // генерирует корзину console.log(basket);

}


mediator.trigger('init');






