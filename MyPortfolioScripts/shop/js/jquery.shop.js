'use strict';
var COOKIE_LIVETIME_DAYS = 30;
var catalogCont = $('.catalog');
var container = $('.content');
var loader = $('.loader');
//var goodsCont = $('.content .goods');
var cart = $('.basket');
var popup = $('.popup_wrap');
var productURL = 'JSON/groups.json';
var waitSign = $('.loader');
var currentGroup;

var itemsBuy;
var itemsBuyQty;
var currTableJSON;
var basket = [];
var z; // temrory

function flatten(arr) {
  var resultArray = []; // вводим временные переменные для хранения результирующего массива и объектов
  for (var i = 0; i < arr.length; i++) { // организуем обход массива 
    resultArray = resultArray.concat(arr[i]); // добавляем объект в массив
  }
  return resultArray; // возвращаем массив
};


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
    ((expires) ? "; expires=" + expires : "") +
      ((path) ? "; path=" + path : "") +
      ((domain) ? "; domain=" + domain : "") +
      ((secure) ? "; secure" : "");

    document.cookie = str;
    //console.log('Set:' + str);
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
    //console.log('Get:' + setStr);
    return (setStr);

  }

mediator.subscribe('init', function() { 
  var obj = getReservItemsFromCookie();  //  читаем куки
  if (obj !== null) {  // - если есть кладем в корзину
    basket.push(obj);
    basket = flatten(basket);  // делаем одномерный массив объектов
    genBasket(cart, basket); // вызвать и создать корзину
  } // если есть куки - прочитать в корзину
  waitSign.hide(); // значек в период ожидания
  console.log('Init Ok');

});
//_________________________________________________
function openGroupsItems(event) // вызывается при клике на группу, открывает список в таблице - handler - событие см.снизу
{
  genTableList(container, 'JSON/' + event.target.id + '.json'); // генерируем таблицу товаров группы
  currentGroup = event.target.id;  // текущая группа
  $('[id='+event.target.id+']').addClass('currentGroup');
  $('[id='+event.target.id+']').siblings().removeClass('currentGroup');
};
//_________________________________________________

mediator.subscribe('tableReady', function() { // Навешивает обработчик кликов при готовности таблицы
  $('.butt').on('click', function(event) {
    addToBasket(currentGroup, event.target.id, $('[id=inp' + event.target.id + ']').val());
  })
});


mediator.subscribe('tableReady', function() {
  $(".tableGoods").sorter({
    sortList: [ [0, 0] ]
  }); // сортировка
})

mediator.subscribe('basketReady', function() {
  if ($('.basketGoods').length !== 0) {
    $(".basketGoods").sorter({
      sortList: [
        [0, 0]
      ]
    }); // сортировка
  }
})

mediator.subscribe('basketReady', function() { // Навешивает обработчик кликов при готовности корзины
  $('.clearBasket').on('click', function(event) {
   clearBasket();
   genBasket(cart, basket); // вызвать и создать корзину
  })
  $('.buttDel').on('click', function(event) {
    delFromBasket(event.target.name, event.target.id, basket);
  })
});


mediator.subscribe('groupsReady', function() { // Навешивает обработчик кликов при готовности списка групп
  $('.groups li').on('click', openGroupsItems);
  genTableList(container, 'JSON/' + currentGroup + '.json');
});


mediator.subscribe('addToBasket', function() { // когда добавлен товар в корзину
  genBasket(cart, basket); // вызвать и/или создать/добавить в корзину в узел cart из объектов basket
})

mediator.subscribe('delFromBasket', function() {
  genBasket(cart, basket); // вызвать и создать корзину
})

//_________________________________________________
function genTableList(node, JSONFileUrl) {
  waitSign.show();
  $.getJSON(JSONFileUrl, function(data) {
    var items = [];
    currTableJSON = data;
    //console.log(data);
    items.push('<colgroup><COL width="220px"><COL width="120px"><COL width="100px">' +
      '<COL width="100px"><COL width="100px"><COL width="40px"><COL width="40px"></colgroup>' +
      '<thead><tr><th align="left"> Наименование </th>' +
      '<th align="left">Производитель</th>' +
      '<th  align="left" >Модель</th>' +
      '<th  align="left" >Цена,грн</th>' +
      '<th  align="left" >На складе</th>' +
      '<th  align="center" >Купить,шт</th>' +
      '<th  align="center" >Оформить</th>' +
      '</tr></thead>');
    $.each(data, function(key, val) { // формирование списка
      items.push('<tr itemsId="' + val.item_id + '" class="goods">' +
        '<td>' + val.name + '</td>' +
        '<td>' + val.brand + '</td>' +
        '<td>' + val.modelName + '</td>' +
        '<td>' + val.price + '</td>' +
        '<td>' + val.qty + '</td>' +
        '<td><input id="inp' + val.item_id + '" type="text" width="30px" name="qty" size="2" value="1" ></td>' +
        '<td><button  id=' + val.item_id + ' class="butt"' + ' value=' + val.item_id + '>Купить</buttton></td>');

      items.push('</tr>');
    });
    $('.tableGoods').remove(); // удаляем старую таблицу, если есть
    $('<table/>', {
      'class': 'tableGoods',
      html: items.join('')
    }).appendTo(node);
    waitSign.hide();
    mediator.trigger('tableReady');
  });

}
//_________________________________________________
function genGroupsList(url) { // получение списка групп
  $.getJSON(url, function(data) {
    currentGroup = data[0].class;
    var items = [];
    $.each(data, function(key, val) { // формирование списка
      items.push('<li class="group" id=' + val.class + '>' + val.name + '</li>');
    });

    $('<ul/>', {
      'class': 'groups',
      html: items.join('')
    }).appendTo(catalogCont);
    $('ul li.group').eq(0).addClass('currentGroup');
    mediator.trigger('groupsReady');
  });

}
//_________________________________________________
genGroupsList(productURL);  // сгенерировать при старте список групп
//_________________________________________________
function getReservItemsFromCookie() {  // угадайте, что :)
  var obj;
  var str;
  str = getCookie('goods');
  var obj = jQuery.parseJSON(str);
  return obj;
}
//_________________________________________________
function addToBasket(currentGroup, id, qty) { // сохраняет и добавляет в корзину
  var cookieDate = new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * COOKIE_LIVETIME_DAYS).toUTCString();
  var str;
  str = '{ "currentGroup":"' + currentGroup + '","id":' + id + ',"qty":' + qty + '}';
  waitSign.show(); // значек - ждем
  var obj = jQuery.parseJSON(str); // JSON в объект
  basket.push(obj);
  // console.log(str);
  str = JSON.stringify(basket);
  setCookie('goods', str, cookieDate, document.location.pathname, document.location.host, false);
  waitSign.hide();
  mediator.trigger('addToBasket'); //console.log(obj);
}
//_________________________________________________
function delFromBasket(group, id, basketObjs) {  //удаляет из  корзины(и объекта и кукис) выбранный товар
  var cookieDate = new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * COOKIE_LIVETIME_DAYS).toUTCString();
  var str;
waitSign.show();
  for (var i = 0; i < basketObjs.length; i++) {
    if ((basketObjs[i].currentGroup == group) && (basketObjs[i].id == id)) {
      basketObjs.splice(i, 1);
      //console.log('Delete');
    }
  };

  str = JSON.stringify(basket);
  setCookie('goods', str, cookieDate, document.location.pathname, document.location.host, false);
  waitSign.hide();
  mediator.trigger('delFromBasket');
}

//_________________________________________________
function clearBasket(group, id, basketObjs) {  //удаляет из  корзины(и объекта и кукис) выбранный товар
  var cookieDate = new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * COOKIE_LIVETIME_DAYS).toUTCString();
  var str = [];
   basket = [];
  str = JSON.stringify(basket);
  setCookie('goods', str, cookieDate, document.location.pathname, document.location.host, false);
   waitSign.hide();
  mediator.trigger('clearBasket');
}

//_________________________________________________
function genBasket(node, basketObjs) { // генерирует корзину console.log(basket);
  var summGoods=0;
  var summPrices=0;
  var z = basketObjs.length; // берем кол-во 
  waitSign.show();
  if (z === 0) {
    $('.basketGoods').siblings().remove();
    $('.basketGoods').remove();
    mediator.trigger('basketReady');waitSign.hide();
    return;
  }
  var items = []; // место хранения HTML кода(буферизация, что б не трогать ДОМ)
  items.push('<colgroup><COL width="220px"><COL width="120px"><COL width="100px">' +
    '<COL width="100px"><COL width="100px"><COL width="40px"><COL width="40px"></colgroup>' +
    '<thead><tr><th align="left"> Наименование </th>' +
    '<th align="left">Производитель</th>' +
    '<th  align="left" >Модель</th>' +
    '<th  align="left" >Цена,грн</th>' +
    '<th  align="left" >На складе</th>' +
    '<th  align="center" >В корзине,шт</th>' +
    '<th  align="center" >Оформить</th>' +
    '</tr></thead>');

  function getDataFromJSONFile(group, id, qty) { // достает из файлов - баз параметры по Id
    $.getJSON("JSON/" + group + ".json", function(data) {
      $.each(data, function(key, val) {
        if (id == val.item_id) { summGoods+=qty;summPrices+=qty*val.price;
          items.push('<tr itemsId="' + val.item_id + '" class="basketgoods">' +
            '<td>' + val.name + '</td>' +
            '<td>' + val.brand + '</td>' +
            '<td>' + val.modelName + '</td>' +
            '<td>' + val.price + '</td>' +
            '<td>' + val.qty + '</td>' +
            '<td>' + qty + '</td>' +
            '<td><button  name="' + group + '"" class="buttDel"' + ' id=' + val.item_id + '>Del</buttton></td></tr>');
          z = z - 1;
          if (z === 0) {
            mediator.trigger('DataFromJSONFileAdded');
          }
        }
      });
    });
  }

  for (var i = 0; i < basketObjs.length; i++) {
    getDataFromJSONFile(basketObjs[i].currentGroup, basketObjs[i].id, basketObjs[i].qty); // для каждого получаем данные
  }
  mediator.subscribe('DataFromJSONFileAdded', function() {
    $('.basketGoods').siblings().remove();
    $('.basketGoods').remove(); // старую удаляем, если есть
    $('<table/>', {
      'class': 'basketGoods',
      html: items.join('')
    }).appendTo(node);
    $('.basket').append('<span class="summ">Товаров '+ summGoods + ' шт, на сумму ' + summPrices +' грн</span><br>');
    $('.basket').append('<button class="clearBasket">Очистить корзину</button>').append('<button>Оформить заказ</button>');
    mediator.trigger('basketReady');
    waitSign.hide();
    items = [];
  })

} // end of genBasket

mediator.trigger('init');