
var catalog = $('.catalog');
var loader = $('.loader');
var goodsCont = $('.content .goods');
var cartMini = $('.basket');
var popup = $('.popup_wrap');
var productURL = 'JSON/groups.json';

function genProductList(url){
  $.getJSON(url, function(data){
  var items = [];
   $.each(data, function(key, val){
    items.push('<li id="' + key + '">' + val + '</li>');
  });
 
  $('<ul/>', {
    'class': 'my-new-list',
     html: items.join('')
  }).appendTo(catalog);
});
console.log(url);
}
genProductList(productURL);


