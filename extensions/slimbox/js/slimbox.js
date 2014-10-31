/*
	Slimbox v1.22 - The ultimate lightweight Lightbox clone
	by Christophe Beyls (http://www.digitalia.be) - MIT-style license.
	Inspired by the original Lightbox v2 by Lokesh Dhakar.
*/

var Lightbox = {
	init: function(options) {
		this.options = Object.extend({
			resizeDuration: 200,	// Duration of height and width resizing (ms)
			initialWidth: 250,		// Initial width of the box (px)
			initialHeight: 250,		// Initial height of the box (px)
			animateCaption: false	// Enable/Disable caption animation
		}, options || {});
		this.anchors = [];
		
		$A(document.getElementsByTagName('a')).each(function(el){
			if(el.rel && el.href && el.rel.test('^lightbox', 'i')) {
				
				el.onclick = this.click.pass(el, this);
				if (el.style.display == 'none') 
					el.style.display = 'inline';
				
				this.anchors.push(el);
			}
		}, this);
		this.eventKeyDown = this.keyboardListener.bindAsEventListener(this);
		this.eventPosition = this.position.bind(this);
		
		this.overlay = new Element('div').setProperty('id', 'lbOverlay').injectInside(document.body);
		
		this.center = new Element('div').setProperty('id', 'lbCenter').setStyles({width: this.options.initialWidth+'px', height: this.options.initialHeight+'px', marginLeft: '-'+(this.options.initialWidth/2)+'px', display: 'none'}).injectInside(document.body);
		this.image = new Element('div').setProperty('id', 'lbImage').injectInside(this.center);
		this.prevLink = new Element('a').setProperties({id: 'lbPrevLink', href: '#'}).setStyle('display', 'none').injectInside(this.image);
		this.nextLink = this.prevLink.clone().setProperty('id', 'lbNextLink').injectInside(this.image);
		this.prevLink.onclick = this.previous.bind(this);
		this.nextLink.onclick = this.next.bind(this);
		
		this.bottom = new Element('div').setProperty('id', 'lbBottom').setStyle('display', 'none').injectInside(document.body);
		new Element('a').setProperties({id: 'lbCloseLink', href: '#'}).injectInside(this.bottom).onclick = this.overlay.onclick = this.close.bind(this);
		this.caption = new Element('div').setProperty('id', 'lbCaption').injectInside(this.bottom);
		this.number = new Element('div').setProperty('id', 'lbNumber').injectInside(this.bottom);
		new Element('div').setStyle('clear', 'both').injectInside(this.bottom);
		
		var nextEffect = this.nextEffect.bind(this);
		this.fx = {
			overlay: this.overlay.effect('opacity', { duration: 500 }).hide(),
			resize: this.center.effects({ duration: this.options.resizeDuration, onComplete: nextEffect }),
			image: this.image.effect('opacity', { duration: 500, onComplete: nextEffect }),
			bottom: this.bottom.effects({ duration: 400, onComplete: nextEffect })
		};
		
		this.preloadPrev = new Image();
		this.preloadNext = new Image();
		
	},

	click: function(link) {
		if(link.rel.length == 8)
			return this.show(link.href, link.title);
		
		var j, imageNum, images = [];
		this.anchors.each(function(el){
			if(el.rel == link.rel) {
				for(j = 0; j < images.length; j++)
					if(images[j][0] == el.href) break;
				if(j == images.length) {
					images.push([el.href, el.title]);
					if(el.href == link.href) imageNum = j;
				}
			}
		}, this);
		return this.open(images, imageNum);
	},

	show: function(url, title) {
		return this.open([[url, title]], 0);
	},

	open: function(images, imageNum) {
		this.images = images;
		this.position();
		this.setup(true);
		this.top = Window.getScrollTop() + (Window.getHeight() / 15);
		this.center.setStyles({top: this.top+'px', display: ''});
		this.fx.overlay.goTo(0.8);
		return this.changeImage(imageNum);
	},

	position: function() {
		this.overlay.setStyles({top: Window.getScrollTop()+'px', height: Window.getHeight()+'px'});
	},

	setup: function(open) {
		var elements = $A(document.getElementsByTagName('object'));
		elements.extend(document.getElementsByTagName(window.ActiveXObject ? 'select' : 'embed'));
		elements.each(function(el){ el.style.visibility = open ? 'hidden' : ''; });
		var fn = open ? 'addEvent' : 'removeEvent';
		window[fn]('scroll', this.eventPosition)[fn]('resize', this.eventPosition);
		document[fn]('keydown', this.eventKeyDown);
		this.step = 0;
	},

	keyboardListener: function(event) {
		switch(event.keyCode) {
			case 27: case 88: case 67: this.close(); break;
			case 37: case 80: this.previous(); break;	
			case 39: case 78: this.next();
		}
	},

	previous: function() {
		return this.changeImage(this.activeImage-1);
	},

	next: function() {
		return this.changeImage(this.activeImage+1);
	},

	changeImage: function(imageNum) {		
		if(this.step || (imageNum < 0) || (imageNum >= this.images.length)) return false;
		this.step = 1;
		this.activeImage = imageNum;
		
		this.prevLink.style.display = this.nextLink.style.display = 'none';
		this.bottom.setStyles({opacity: '0', height: '0px', display: 'none'});
		this.fx.image.hide();
		this.center.className = 'lbLoading';
		
		this.preload = new Image();
		this.preload.onload = this.nextEffect.bind(this);
		this.preload.src = this.images[imageNum][0];
		return false;
	},

	nextEffect: function() {
		switch(this.step++) {
		case 1:
			this.center.className = '';
			this.image.setStyles({backgroundImage: 'url('+this.images[this.activeImage][0]+')', width: this.preload.width+'px'});
			this.image.style.height = this.prevLink.style.height = this.nextLink.style.height = this.preload.height+'px';
			
			this.caption.setHTML(this.images[this.activeImage][1] || '');
			this.number.setHTML((this.images.length == 1) ? '' : 'Image '+(this.activeImage+1)+' of '+this.images.length);
			
			if(this.activeImage != 0) this.preloadPrev.src = this.images[this.activeImage - 1][0];
			if(this.activeImage != (this.images.length - 1)) this.preloadNext.src = this.images[this.activeImage + 1][0];
			if(this.center.clientHeight != this.image.offsetHeight) {
				this.fx.resize.custom({height: [this.center.clientHeight, this.image.offsetHeight]});
				break;
			}
			this.step++;
		case 2:
			if(this.center.clientWidth != this.image.offsetWidth) {
				this.fx.resize.custom({width: [this.center.clientWidth, this.image.offsetWidth], marginLeft: [-this.center.clientWidth/2, -this.image.offsetWidth/2]});
				break;
			}
			this.step++;
		case 3:
			this.bottom.setStyles({top: (this.top + this.center.clientHeight)+'px', width: this.image.style.width, marginLeft: this.center.style.marginLeft, display: ''});
			this.fx.image.custom(0, 1);
			break;
		case 4:
			if(this.options.animateCaption) {
				this.fx.bottom.custom({opacity: [0, 1], height: [0, this.bottom.scrollHeight]});
				break;
			}
			this.bottom.setStyles({opacity: '1', height: this.bottom.scrollHeight+'px'});
		case 5:
			if(this.activeImage != 0) this.prevLink.style.display = '';
			if(this.activeImage != (this.images.length - 1)) this.nextLink.style.display = '';
			this.step = 0;
		}
	},

	close: function() {
		if(this.step < 0) return;
		this.step = -1;
		if(this.preload) {
			this.preload.onload = Class.empty;
			this.preload = null;
		}
		for(var f in this.fx) this.fx[f].clearTimer();
		this.center.style.display = this.bottom.style.display = 'none';
		this.fx.overlay.chain(this.setup.pass(false, this)).goTo(0);
		return false;
	}
};

//Window.onDomReady(Lightbox.init.bind(Lightbox));
