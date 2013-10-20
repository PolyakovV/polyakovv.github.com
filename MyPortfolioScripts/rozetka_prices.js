// ������� :
// �������� ������ � ��������� �� ������� � ������ ������� ��������� (������ - ����� �� �����������). 
// ������� � ������� ������ �� ����� �������. 

//  ������� �������� � ����� ������ ������ �������� ������ ����������� �����.
//  ������� �� ����������, ���� ���������� ������� ��������� - ������ GB - �� � ��������
//  ����� ����� ������������ ���������� ���������

'use strict';


var getFlashmemList = function() {
	var productList = [];
	var allContainers = document.querySelectorAll('.gtile-i-wrap');

	function getProductObject(containersNode) {
		var obj = {};
		var listOfContainers = containersNode.querySelector('.gtile-i-title a');
		var priceListUAH = containersNode.querySelector('.g-price-uah');
		var priceListUSD = containersNode.querySelector('.g-price-usd');
        var interfaceOfFlash = containersNode.querySelector('.gtile-short-detail');

		obj.name = listOfContainers.innerHTML.match(/\S+/g).join(' ');
		obj.usd = parseFloat(priceListUSD.innerHTML.match(/\d+(.\d+)?/g)).toFixed(2);
		obj.ua = parseFloat(priceListUSD.innerHTML.match(/\d+(.\d+)?/g)).toFixed(2);
		obj.url = listOfContainers.href;
		obj.memory = listOfContainers.innerHTML.match(/(?:\s)\d+(\s+)?GB/g)[0].replace(/\s/g,'');
		obj.usb = parseFloat(interfaceOfFlash.innerHTML.match(/(?:USB\s)\d.\d/gm)[0].replace(/USB\b/gm,'')).toFixed(1);
		return obj;
	}

	for (var i = 0; i < allContainers.length; i += 1) {
		productList.push(getProductObject(allContainers[i]));
	}
	return productList;
};
getFlashmemList();
