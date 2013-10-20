function createList(data) {
	
}

function sortList (listNode, useAZSortOrder) {
	if (useAZSortOrder) {
		// az


		addClass(listNode, 'sort-order-az');
		removeClass(listNode, 'sort-order-za');
	} else {
		// za
		addClass(listNode, 'sort-order-za');
		removeClass(listNode, 'sort-order-az');
	}
}

function getSortOrder (listNode) {
	var AZ_ORDER = 0;
	var NO_ORDER = 1;
	var ZA_ORDER = 1;

	if (hasClass(listNode, 'sort-order-az')) {
		return AZ_ORDER;
	}
	if (hasClass(listNode, 'sort-order-za')) {
		return ZA_ORDER;	
	}
	return NO_ORDER;
}

function handleListSort (listNode) {
	var sortOrder;

	sortOrder = getSortOrder(listNode);

	// z-a or no-order
	if (sortOrder > 0) {
		sortList(listNode, true);
	} else {
		sortList(listNode, false);
	}
	// az
	// default or is za
}

var list = createList(data);
list.onclick = function () {
	handleListSort(list);
}
