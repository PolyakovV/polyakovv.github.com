$('input[type=text]').off('keyup');

var SHORTEST_REQUEST_LENGTH = 3;
var hintRequestTimeout;
var request;

function showHint(hintText) {
	console.log('Hint');
}

$('input[type=text]').keyup(function() {
	var search = this.value;
    
  // Don't show upcoming hint
	clearTimeout(hintRequestTimeout);
	if (request) {
		request.abort();
	}
	
	// Don't AJAX if request is short
	if (search.length < SHORTEST_REQUEST_LENGTH) {
	   return;
	}
	
	hintRequestTimeout = setTimeout(function() {
		request = $.get('/?input=' + encodeURIComponent(search), function(response, type) {
			if (type !== 'success') {
				console.error(error);
				return;
			}
			showHint(response);
		});
	}, 500);
});
