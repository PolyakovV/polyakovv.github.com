'use strict';


var shop = (function () {
        var instance = {
  COOKIE_LIVETIME_DAYS: 30,
  catalogCont: $('.catalog'),
  container: $('.content'),
  cart: $('.basket'),
  productURL: 'JSON/groups.json',
  waitSign: $('.loader'),
  currentGroup:'' ,
  basket: []
        };

        return function () {
                return instance;
        }
}());



//________________________________________________________________________________________________________
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


//_________________________________________________
function openGroupsItems(event) // вызывается при клике на группу, открывает список в таблице - handler - событие см.снизу
{
  genTableList(shop().container, 'JSON/' + event.target.id + '.json'); // генерируем таблицу товаров группы
  shop().currentGroup = event.target.id;  // текущая группа
  $('[id='+event.target.id+']').addClass('currentGroup');
  $('[id='+event.target.id+']').siblings().removeClass('currentGroup');
};
//_________________________________________________




mediator.subscribe('tableReady', function() {
  $(".tableGoods").sorter({
    sortList: [ [0, 0] ]
  }); // сортировка
})


mediator.subscribe('groupsReady', function() { // Навешивает обработчик кликов при готовности списка групп
  $('.groups li').on('click', openGroupsItems);
  genTableList(shop().container, 'JSON/' + shop().currentGroup + '.json');
});



//_________________________________________________
function genTableList(node, JSONFileUrl) {
  shop().waitSign.show();
  $.getJSON(JSONFileUrl, function(data) {
    var items = [];
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
    shop().waitSign.hide();
    mediator.trigger('tableReady');
  });

}
//_________________________________________________
function genGroupsList(url, catCont) { // получение списка групп
    catCont.children().remove();
  $.getJSON(url, function(data) {
    shop().currentGroup = data[0].class;
    var items = [];
    $.each(data, function(key, val) { // формирование списка
      items.push('<li class="group" id=' + val.class + '>' + val.name + '</li>');
    });

    $('<ul/>', {
      'class': 'groups',
      html: items.join('')
    }).appendTo(catCont);
    $('ul li.group').eq(0).addClass('currentGroup');
    mediator.trigger('groupsReady');
  });

}
//_________________________________________________
genGroupsList(shop().productURL, shop().catalogCont);  // сгенерировать при старте список групп

//_________________________________________________

//////// Basket was here ////// Cut it to file
