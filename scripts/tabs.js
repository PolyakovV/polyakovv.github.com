"use strict"
//---------------Helpers-------------------------//

//-----------------------crossbrowser indexOf method------------------------------//
if (!Array.prototype.indexOf)
{
  Array.prototype.indexOf = function(elt /*, from*/)
  {
    var len = this.length >>> 0;

    var from = Number(arguments[1]) || 0;
    from = (from < 0)
         ? Math.ceil(from)
         : Math.floor(from);
    if (from < 0)
      from += len;

    for (; from < len; from++)
    {
      if (from in this &&
          this[from] === elt)
        return from;
    }
    return -1;
  };
}
//---------------------------------------------------------//


	function hasClass (node, className) {
		if (Object.prototype.toString.call(className) === '[object String]' && node.className.split(" ").indexOf(className) !==-1) {
			return true;
		} else if (Object.prototype.toString.call(className) === '[object Array]') {
			for(var i = 0; i < className.length; i++) {
				if (node.className.split(" ").indexOf(className[i]) !==-1) {
					return true;
				}
			} 
			return false;
		} else {
			return false;
		}
	}

	function addClass (node, className) {
		if (node.className.indexOf(className) === -1 && node.className.length !== 0) {
			node.className = node.className.concat(" ",className);
		} else if(node.className.indexOf(className) === -1 && node.className.length === 0) {
			node.className = className;
		}
	}

	function removeClass(node, className) {
		var nameArr = node.className.split(' ');
		if (Object.prototype.toString.call(className) === '[object String]') {
			for(i=0; i<nameArr.length; i++) {
				if (nameArr[i] === className) {
					nameArr.splice(i, 1); 
					i--;
				}
			}
			node.className = nameArr.join(' ');
		}
		
		if (Object.prototype.toString.call(className) === '[object Array]') {
			for( var i = 0; i < nameArr.length; i++) {
				for (var j = 0; j < className.length; j++) {
					if (nameArr[i] === className[j]) {
						nameArr.splice(i,1);
						j--;
						i--;
					}
				}
			}
			node.className = nameArr.join(' ');
		}
	}

	function bindEvent(node, eventName, handler) {
		var handler_wrapper = function(event) {
			event = event || window.event;
			if (!event.target && event.srcElement) {
				event.target = event.srcElement;
			}
			return handler.call(node, event);
		};

		if (node.addEventListener) {
			node.addEventListener(eventName, handler_wrapper, false);
		} else if (node.attachEvent) {
			node.attachEvent('on' + eventName, handler_wrapper);
		}
		return handler_wrapper;
	}


//--------------Main functions-------------------------//
(function () {
	var links = document.querySelectorAll("ul.menu_js li > a");
	for (var i = 0; i < links.length; i++) {
		bindEvent(links[i], "click", makeLinksUnclickable);
	}
})();

	function makeLinksUnclickable () {
		if(event.preventDefault) {
			event.preventDefault();
		} else {
			event.returnValue = false;
		}
	}

	function showContent (event) {
		event = event || window.event;
		if(event.preventDefault) {
			event.preventDefault();
		} else {
			event.returnValue = false;
		}
		var content = document.querySelectorAll(".content_js p");
				 if(!hasClass(event.target, "active_js")) {
				removeClass(document.querySelector(".active_js"), "active_js");
				addClass(event.target, "active_js");
				console.log(event.target.className);
				 removeClass(document.querySelector(".hovered"), "hovered");
				 for (var i = 0; i < content.length; i++) {
				 	if (event.target.className.indexOf(content[i].className)>=0) {
				 		console.log(event.target.className);
				 	removeClass(document.querySelector(".show_js"), "show_js");
				 	addClass(content[i], "show_js");
			 	 }
			 }
			
		}
	}

	function hoverImitation () {
		if(!hasClass(this, "active_js")) {
			if(document.querySelector(".hovered")) {
				removeClass(document.querySelector(".hovered"), "hovered");
			}
			addClass(this, "hovered");
		}
	}

	function disHoverImitation (event) {
		if(hasClass(this, "hovered")) {
			removeClass(this, "hovered");
		}

	}

	(function changeTab () {
		var tabCollection = document.querySelectorAll(".menu_js li a");
		for (var i = 0; i < tabCollection.length; i++) {
			bindEvent(tabCollection[i], "click", showContent);
			bindEvent(tabCollection[i], "mouseover", hoverImitation);
bindEvent(tabCollection[i], "mouseout", disHoverImitation);
		}
	})();
