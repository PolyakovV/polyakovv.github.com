var Gallery = (function (document, $, Observer, Mediator) {
	var mediator = new Mediator();

	function Gallery (settings) {
		var maxVisibleSlides = settings.maxVisibleSlides || 5;

		this.onslide = new Observer();
		this.ondestoy = new Observer();

		this.init(maxVisibleSlides);
	}

	Gallery.prototype.goToSlide = function (slideId) {
		var nextSlide = slideId;
		//...
		this.onslide._trigger(nextSlide);
		mediator.trigger('gallery.slide');
	}
}(document, jQuery, Observer, Mediator));



var gal1 = new Gallery({
	doSlide: true
});


(function (gal1, Mediator) {
	var mediator = new Mediator();
	gal1.onslide.subscribe(function () {
		console.log('Do sliding');
	});

	gal1.ondestoy.subscribe(function () {
		console.log('Gallery is dead');
	});

	///////////////////////////////////

	mediator.subscribe('gallery.slide', function () {
		console.log('Do sliding');
	});


	mediator.subscribe('gallery.destroy', function () {
		console.log('Gallery is dead');
	});
}(gal1, Mediator));
