	var state = false;

	new Vue({
	   el: '#app',
	   data: {
	   	wheel_time: true,
	   	scroll_time: 1100,
	   	disabled: true,
	   	bodyEl: document.body,
	   	t: null,
	   	p_screen: {
	   		s_head: {
	   			name: "s_head",
	   			screen: true,
	   			s_navbar_theme: "navbar-dark navbar-bg-none",
	   			s_dot_theme: "dotsbar-dark",
	   		},
	   		s_about_us: {
	   			name: "s_about_us",
	   			screen: false,
	   			s_navbar_theme: "navbar-dark",
	   			s_dot_theme: "dotsbar-dark",
	   		},
	   		s_services: {
	   			name: "s_services",
	   			screen: false,
	   			s_navbar_theme: "navbar-dark navbar-bg-none",
	   			s_dot_theme: "dotsbar-dark",
	   		},
	   		s_contacts: {
	   			name: "s_contacts",
	   			screen: false,
	   			s_navbar_theme: "navbar-light",
	   			s_dot_theme: "dotsbar-light",
	   		},
	   	}
	   },
	   computed: {
	   	navbar_theme: function(){
	   		for(var s_active in this.p_screen){
	   			if( this.p_screen[s_active]['screen'])
	   				return this.p_screen[s_active]['s_navbar_theme']
	   		}
	   		return
	   	},
	   	dotsbar_theme: function(){
	   		for(var s_active in this.p_screen){
	   			if(this.p_screen[s_active]['screen'])
	   				return this.p_screen[s_active]['s_dot_theme']
	   		}
	   		return
	   	}
	   },
	   mounted: function () {
				let posX = 0;
				let posY = 0;
				let error = 70;
				let bodyEl = document.body;

				document.addEventListener('touchstart', event => {
					if( !classie.has(bodyEl, 'view-full') ){
						const { clientX, clientY } = event.touches[0];
						posX = clientX;
						posY = clientY;
					}
				});
				document.addEventListener('touchmove', event => {
					if( !classie.has(bodyEl, 'view-full') ){
						const { clientX, clientY } = event.touches[0];
						if (Math.abs(posY - clientY) > error && this.wheel_time) {
							if (posY > clientY && (window.innerHeight + window.pageYOffset) >= document.querySelector(".page__screen_active").offsetHeight) {
								this.wheel_time = false;
								this.screen_down();
							}
							if (posY < clientY && (window.innerHeight + window.pageYOffset) == window.innerHeight) {
								this.wheel_time = false;
								this.screen_up();
							}
							posX = clientX;
							posY = clientY;
							this.scroll_time_out();
						}
					}
				});
		 },
	   methods: {
	   	set_p_screen: function(set_screen){
	   		if(this.p_screen[set_screen] != true){
		   		for(var screen in this.p_screen){
		   			this.p_screen[screen]['screen'] = false;
		   		}
		   		this.close_stack();
		   		this.p_screen[set_screen]['screen'] = true;
			   	this.scroll_up();
	   		}
	   	},
	   	close_stack: function(){
	   		if(classie.has(this.bodyEl, 'view-full') ){
		   		state = true;
		   		setTimeout(()=>{
		   			state = false;
		   		},300);
	   		}
	   	},
	   	wheel: function(ev){
	   		if( !classie.has(this.bodyEl, 'view-full') ){
			    	if (ev.deltaY < 0 && this.wheel_time && (window.innerHeight + window.pageYOffset) == window.innerHeight) {
			    		this.wheel_time = false;
			      	this.screen_up();
			      	this.scroll_time_out();
			      }else if(this.wheel_time && (window.innerHeight + window.pageYOffset) >= document.querySelector(".page__screen_active").offsetHeight){
			      	this.wheel_time = false;
			      	this.screen_down();
			      	this.scroll_time_out();
			    } 
		    } 
	    },
	    scroll_up: function(){
	    	let top = Math.max(document.body.scrollTop,document.documentElement.scrollTop);
				if(top > 0) {
					window.scrollBy(0,-70);
					this.t = setTimeout(this.scroll_up,20);
				} else clearTimeout(this.t);
	    },
	    screen_up: function(){
	    	classie.add(this.bodyEl, 'nonescroll');
	    	var bufer = "";
	    	for(var screen in this.p_screen){
	    		if(this.p_screen[screen]['screen'] == true && bufer != ""){
	    			this.p_screen[screen]['screen'] = false;
	    			this.p_screen[bufer]['screen'] = true;
	    			this.scroll_up();
	    			break;
	    		}
	    		bufer = screen;
		   	}	    	
	    },
	    screen_down: function(){
	    	var bufer = '';
	    	for(var screen in this.p_screen){
    			if(bufer != '' && this.p_screen[bufer]['screen'] == true) {
	    			this.p_screen[bufer]['screen'] = false;
	    			this.p_screen[screen]['screen'] = true;
	    			this.scroll_up();
	    			break;
	    		}
	    		bufer = screen;
	    	}
	    },
	    scroll_time_out: function(){
		    setTimeout(() => {
		    	this.wheel_time = true;
		    	classie.remove(this.bodyEl, 'nonescroll');
		    }, this.scroll_time)
	  	},
	   },
	});


/*
--------------------------------------


-------------------------------------------
*/



(function() {

	var bodyEl = document.body,
		docElem = window.document.documentElement,
		support = { transitions: Modernizr.csstransitions },
		// transition end event name
		transEndEventNames = { 'WebkitTransition': 'webkitTransitionEnd', 'MozTransition': 'transitionend', 'OTransition': 'oTransitionEnd', 'msTransition': 'MSTransitionEnd', 'transition': 'transitionend' },
		transEndEventName = transEndEventNames[ Modernizr.prefixed( 'transition' ) ],
		onEndTransition = function( el, callback ) {
			var onEndCallbackFn = function( ev ) {
				if( support.transitions ) {
					if( ev.target != this ) return;
					this.removeEventListener( transEndEventName, onEndCallbackFn );
				}
				if( callback && typeof callback === 'function' ) { callback.call(this); }
			};
			if( support.transitions ) {
				el.addEventListener( transEndEventName, onEndCallbackFn );
			}
			else {
				onEndCallbackFn();
			}
		},
		slider = document.querySelector('.stack-slider'),
		stacksWrapper = slider.querySelector('.stacks-wrapper'),
		stacks = [].slice.call(stacksWrapper.children),
		imghero = document.querySelector('.hero__back--mover'),
		flkty, canOpen = true, canMoveHeroImage = true,
		isFirefox = typeof InstallTrigger !== 'undefined',
		win = { width: window.innerWidth, height: window.innerHeight };


	function scrollY() { return window.pageYOffset || docElem.scrollTop; }

	// from http://www.sberry.me/articles/javascript-event-throttling-debouncing
	function throttle(fn, delay) {
		var allowSample = true;

		return function(e) {
			if (allowSample) {
				allowSample = false;
				setTimeout(function() { allowSample = true; }, delay);
				fn(e);
			}
		};
	}

	function init() {
		flkty = new Flickity(stacksWrapper, {
			wrapAround: true,
			imagesLoaded: true,
			initialIndex: 0,
			setGallerySize: false,
			pageDots: false,
			prevNextButtons: false
		});

		// loading images...
		imagesLoaded(stacksWrapper, function() {
			classie.add(bodyEl, 'view-init');
		});

		initEvents();
	}

	function initEvents() {
		stacks.forEach(function(stack) {
			var titleEl = stack.querySelector('.stack-title');

			bodyEl.addEventListener('transitionend', function(){
				if(state){
					if( classie.has(bodyEl, 'view-full') ) { // stack is opened
						var closeStack = function() {
							classie.remove(bodyEl, 'move-items');

							onEndTransition(slider, function() {
								classie.remove(bodyEl, 'view-full');
								bodyEl.style.height = '';
								flkty.bindDrag();
								flkty.options.accessibility = true;
								canMoveHeroImage = true;
							});
						};

						// if the user scrolled down, let's first scroll all up before closing the stack.
						var scrolled = scrollY();
						if( scrolled > 0 ) {
							smooth_scroll_to(isFirefox ? docElem : bodyEl || docElem, 0, 500).then(function() {
								closeStack();
							});
						}
						else {
							closeStack();
						}
					}
				}
			});


			// expand/close the stack
			titleEl.addEventListener('click', function(ev) {
				ev.preventDefault();
				if( classie.has(stack, 'is-selected') ) { // current stack
					if( classie.has(bodyEl, 'view-full') ) { // stack is opened
						var closeStack = function() {
							classie.remove(bodyEl, 'move-items');

							onEndTransition(slider, function() {
								classie.remove(bodyEl, 'view-full');
								bodyEl.style.height = '';
								flkty.bindDrag();
								flkty.options.accessibility = true;
								canMoveHeroImage = true;
							});
						};

						// if the user scrolled down, let's first scroll all up before closing the stack.
						var scrolled = scrollY();
						if( scrolled > 0 ) {
							smooth_scroll_to(isFirefox ? docElem : bodyEl || docElem, 0, 500).then(function() {
								closeStack();
							});
						}
						else {
							closeStack();
						}
					}
					else if( canOpen ) { // stack is closed
						canMoveHeroImage = false;
						classie.add(bodyEl, 'view-full');
						setTimeout(function() { classie.add(bodyEl, 'move-items'); }, 25);
						bodyEl.style.height = stack.offsetHeight + 'px';
						flkty.unbindDrag();
						flkty.options.accessibility = false;
					}
				}
				else if( classie.has(stack, 'stack-prev') ) {
					flkty.previous(true);
				}
				else if( classie.has(stack, 'stack-next') ) {
					flkty.next(true);
				}
			});

			titleEl.addEventListener('mouseenter', function(ev) {
				if( classie.has(stack, 'is-selected') ) {
					canMoveHeroImage = false;
					//imghero.style.WebkitTransform = 'perspective(1000px) translate3d(0,0,0) rotate3d(1,1,1,0deg)';
					//imghero.style.transform = 'perspective(1000px) translate3d(0,0,0) rotate3d(1,1,1,0deg)';
				}
			});

			titleEl.addEventListener('mouseleave', function(ev) {
				// if current stack and it's not opened..
				if( classie.has(stack, 'is-selected') && !classie.has(bodyEl, 'view-full') ) {
					canMoveHeroImage = true;
				}
			});
		});

		window.addEventListener('mousemove', throttle(function(ev) {
			if( !canMoveHeroImage ) return false;
			var xVal = -1/(win.height/2)*ev.clientY + 1,
				yVal = 1/(win.width/2)*ev.clientX - 1,
				transX = 20/(win.width)*ev.clientX - 10,
				transY = 20/(win.height)*ev.clientY - 10,
				transZ = 100/(win.height)*ev.clientY - 50;

			//imghero.style.WebkitTransform = 'perspective(1000px) translate3d(' + transX + 'px,' + transY + 'px,' + transZ + 'px) rotate3d(' + xVal + ',' + yVal + ',0,2deg)';
			//imghero.style.transform = 'perspective(1000px) translate3d(' + transX + 'px,' + transY + 'px,' + transZ + 'px) rotate3d(' + xVal + ',' + yVal + ',0,2deg)';
		}, 100));

		// window resize
		window.addEventListener( 'resize', throttle(function(ev) {
			// recalculate window width/height
			win = { width: window.innerWidth, height: window.innerHeight };
			// reset body height if stack is opened
			if( classie.has(bodyEl, 'view-full') ) { // stack is opened
				bodyEl.style.height = stacks[flkty.selectedIndex].offsetHeight + 'px';
			}
		}, 50));

		// Flickity events:
		flkty.on('cellSelect', function() {
			canOpen = false;
			classie.remove(bodyEl, 'item-clickable');

			var prevStack = stacksWrapper.querySelector('.stack-prev'),
				nextStack = stacksWrapper.querySelector('.stack-next'),
				selidx = flkty.selectedIndex,
				cellsCount = flkty.cells.length,
				previdx = selidx > 0 ? selidx - 1 : cellsCount - 1;
				nextidx = selidx < cellsCount - 1 ? selidx + 1 : 0;

			if( prevStack ) {
				classie.remove(prevStack, 'stack-prev');
			}
			if( nextStack ) {
				classie.remove(nextStack, 'stack-next');	
			}

			classie.add(stacks[previdx], 'stack-prev');
			classie.add(stacks[nextidx], 'stack-next');

		});

		flkty.on('dragStart', function() {
			canOpen = false; 
			classie.remove(bodyEl, 'item-clickable');
		});

		flkty.on('settle', function() { 
			classie.add(bodyEl, 'item-clickable');
			canOpen = true; 
		});
	}

	init();

})();