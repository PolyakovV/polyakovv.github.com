////////////////////////// Модуль корзины /////////////////////////////////
 (function(){

mediator.subscribe('init', function() { 
  var obj = getReservItemsFromCookie();  //  читаем куки
  if (obj !== null) {  // - если есть кладем в корзину
    shop().basket.push(obj);
    shop().basket = flatten(shop().basket);  // делаем одномерный массив объектов
    genBasket(shop().cart, shop().basket); // вызвать и создать корзину
  } // если есть куки - прочитать в корзину
  shop().waitSign.hide(); // значек в период ожидания
  console.log('Init Ok');

});

mediator.subscribe('tableReady', function() { // Навешивает обработчик кликов при готовности таблицы
  $('.butt').on('click', function(event) {
    addToBasket(shop().currentGroup, event.target.id, $('[id=inp' + event.target.id + ']').val());
  })
});

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
   genBasket(shop().cart, shop().basket); // вызвать и создать корзину
  })
  $('.buttDel').on('click', function(event) {
    delFromBasket(event.target.name, event.target.id, shop().basket);
  })
});

mediator.subscribe('addToBasket', function() { // когда добавлен товар в корзину
  genBasket(shop().cart, shop().basket); // вызвать и/или создать/добавить в корзину в узел shop().cart из объектов shop().basket
})

mediator.subscribe('delFromBasket', function() {
  genBasket(shop().cart, shop().basket); // вызвать и создать корзину
})

//_________________________________________________
function addToBasket(currentGroup, id, qty) { // сохраняет и добавляет в корзину
  var cookieDate = new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * shop().COOKIE_LIVETIME_DAYS).toUTCString();
  var str;
  str = '{ "currentGroup":"' + currentGroup + '","id":' + id + ',"qty":' + qty + '}';
  shop().waitSign.show(); // значек - ждем
  var obj = jQuery.parseJSON(str); // JSON в объект
  shop().basket.push(obj);
  str = JSON.stringify(shop().basket);
  setCookie('goods', str, cookieDate, document.location.pathname, document.location.host, false);
  shop().waitSign.hide();
  mediator.trigger('addToBasket');
}
//_________________________________________________
function delFromBasket(group, id, basketObjs) {  //удаляет из  корзины(и объекта и кукис) выбранный товар
  var cookieDate = new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * shop().COOKIE_LIVETIME_DAYS).toUTCString();
  var str;
shop().waitSign.show();
  for (var i = 0; i < basketObjs.length; i++) {
    if ((basketObjs[i].currentGroup == group) && (basketObjs[i].id == id)) {
      basketObjs.splice(i, 1);
    }
  };

  str = JSON.stringify(shop().basket);
  setCookie('goods', str, cookieDate, document.location.pathname, document.location.host, false);
  shop().waitSign.hide();
  mediator.trigger('delFromBasket');
}

//_________________________________________________
function clearBasket(group, id, basketObjs) {  //удаляет из  корзины(и объекта и кукис) выбранный товар
  var cookieDate = new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * shop().COOKIE_LIVETIME_DAYS).toUTCString();
  var str = [];
   shop().basket = [];
  str = JSON.stringify(shop().basket);
  setCookie('goods', str, cookieDate, document.location.pathname, document.location.host, false);
   shop().waitSign.hide();
  mediator.trigger('clearBasket');
}

//_________________________________________________
function genBasket(node, basketObjs) { // генерирует корзину console.log(shop().basket);
  var summGoods=0;
  var summPrices=0;
  var z = basketObjs.length; // берем кол-во 
  shop().waitSign.show();
  if (z === 0) {
    $('.basketGoods').siblings().remove();
    $('.basketGoods').remove();
    mediator.trigger('basketReady');
    shop().waitSign.hide();
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
    var basketGoods = $('.basketGoods');
    basketGoods.siblings().remove();
    basketGoods.remove(); // старую удаляем, если есть
    $('<table/>', {
      'class': 'basketGoods',
      html: items.join('')
    }).appendTo(node);
    var bask = $('.basket');
    bask.append('<span class="summ">Товаров '+ summGoods + ' шт, на сумму ' + summPrices +' грн</span><br>');
    bask.append('<button class="clearBasket">Очистить корзину</button>').append('<button>Оформить заказ</button>');
    mediator.trigger('basketReady');
    shop().waitSign.hide();
    items = [];
  })

} // end of genBasket

})(mediator, shop)
////////////////////////// end of basket module /////////////////////////////////