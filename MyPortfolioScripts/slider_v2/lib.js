
function l(value) {
  return console.log(value);
}

function preventDef(event) {
  if (event.preventDefault) {
    event.preventDefault();
  } else {
    event.returnValue = false;
  }
}

function addEvent (node, eventName, handler) {
  if (node.addEventListener) {
    node.addEventListener(eventName, handler, false);
  } else if (node.attachEvent) {
    node.attachEvent('on' + eventName, handler);
  }
}

function removeEvent (node, eventName, handler) {
  if (node.removeEventListener) {
    node.removeEventListener(eventName, handler, false);
  } else if (node.detachEvent) {
    node.detachEvent('on' + eventName, handler);
  }
}




function fixEvent(e) {
  e = e || window.event;

  if (!e.target) e.target = e.srcElement;

  if (e.pageX == null && e.clientX != null ) { // если нет pageX..
    var html = document.documentElement;
    var body = document.body;

    e.pageX = e.clientX + (html.scrollLeft || body && body.scrollLeft || 0);
    e.pageX -= html.clientLeft || 0;

    e.pageY = e.clientY + (html.scrollTop || body && body.scrollTop || 0);
    e.pageY -= html.clientTop || 0;
  }

  if (!e.which && e.button) {
    e.which = e.button & 1 ? 1 : ( e.button & 2 ? 3 : ( e.button & 4 ? 2 : 0 ) )
  }

  return e;
}


function getCoords(elem) {
    var box = elem.getBoundingClientRect();

    var body = document.body;
    var docElem = document.documentElement;

    var scrollTop = window.pageYOffset || docElem.scrollTop || body.scrollTop;
    var scrollLeft = window.pageXOffset || docElem.scrollLeft || body.scrollLeft;

    var clientTop = docElem.clientTop || body.clientTop || 0;
    var clientLeft = docElem.clientLeft || body.clientLeft || 0;

    var top  = box.top +  scrollTop - clientTop;
    var left = box.left + scrollLeft - clientLeft;

    return { top: Math.round(top), left: Math.round(left) };
}

function imouse(event){
  var obj={};
   obj.ypos = (event.y+document.body.scrollTop);
   obj.xpos = (event.x+document.body.scrollLeft);
           return obj;
  }

