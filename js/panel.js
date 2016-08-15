/**
* jquery panel plugin v1.0 - 2015-06-17
* Inspired by http://ascott1.github.io/bigSlide.js/ */

(function (factory) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['jquery'], factory);
  } else if (typeof exports === 'object') {
    // Node/CommonJS
    module.exports = factory(require('jquery'));
  } else {
    // Browser globals
    factory(jQuery);
  }
}(function($) {
  'use strict';

  $.fn.panel = function(options) {
    // store the menuLink in a way that is globally accessible
    var menuLink = this;

    // plugin settings
    var settings = $.extend({
      'menu': ('#menu'),
      'push': ('.push'),
      'side': 'left',
	  'insideToggle': ('#nav-close'),
      'menuWidth': '15.625em', // menu.css( 'width' )
      'speed': '300',
	  'easing': 'swing',
	  'noFallback': false,
	  'mode':'push', // 'push' or 'reveal'
	  'inside' : false, // for inside use, mandatory to specify, true.
	  'position':'fixed', // for inside use, 'relative'
	  'menuHeight':'100%',    // for inside use, 'auto' or menu.css( 'height' )
	  'transition': 'ease',
      'state': 'closed',
      'activeBtn': 'active',
      'easyClose': false,
      'beforeOpen': function () {},
      'afterOpen': function() {},
      'beforeClose': function() {},
      'afterClose': function() {}
    }, options);

	//If no Modernizr, remove fallback.
	if (typeof Modernizr === "undefined"){
		window.Modernizr = { 'csstransitions': settings.noFallback } ;
	}
		
    // store the menu's state in the model
    var model = {
      'state': settings.state
    };

    // talk back and forth between the view and state
    var controller = {
      init: function(){
        view.init();
      },
      // update the menu's state
      changeState: function(){
        if (model.state === 'closed') {
          model.state = 'open'
        } else {
          model.state = 'closed'
        }
      },
      // check the menu's state
      getState: function(){
        return model.state;
      },
	  destroy:function(){
		view.destroy();
	  }
    };

    // the view contains all of the visual interactions
    var view = {
      init: function(){
        // cache DOM values
        this.$menu = $(settings.menu);
        this.$push = $(settings.push);
        this.width = settings.menuWidth;
		this.height = settings.menuHeight;
		this.insideToggle = $(settings.insideToggle);
		
		// evaluate to use, height or width.
		if( settings.inside && settings.position == 'relative' ){
			if( settings.side == 'left' || settings.side == 'right' ){
				this.dim = this.width;
			}
			else{
				this.dim = this.height;
			} 
		
		}else{
			this.dim = this.width;
		}
	
        // CSS for how the menu will be positioned off screen
        var positionOffScreen = {
          'position': settings.position,
          'top': '0',
          'bottom': '0',
          'height': settings.menuHeight
        };
		
        // manually add the Width values
        positionOffScreen.width = settings.menuWidth;
		
		// default CSS for push container.
		var pushNextbox = {
				'postion' : 'relative',
			};
		// manually add the settings values
		if( settings.inside && settings.position == 'relative' && settings.mode == 'push' ){
				// If push needed, on inside container
				positionOffScreen[settings.side] = '-' + this.dim;
				pushNextbox[settings.side] = '-' + this.dim;
		}
		else{
			positionOffScreen[settings.side] = '-' + this.dim;
		}

        // add the css values to position things offscreen
        if (settings.state === 'closed') {
	
          this.$menu.css(positionOffScreen);
		  
		  if( settings.mode == 'push' ){
			if( settings.inside && settings.position == 'relative' ){
				this.$push.css(pushNextbox);
			}
			else{ 
				this.$push.css(settings.side, '0');
			}
		  }
		  
        }
	
        // register a click listener for desktop & touchstart for mobile
        menuLink.on('click.panel touchstart.panel', function(e) {
          e.preventDefault();
          if (controller.getState() === 'open') {
            view.toggleClose();
          } else {
            view.toggleOpen();
          }
        });

        // this makes my eyes blead, but adding it back in as it's a highly requested feature
        if (settings.easyClose) {
          $('body').on('click.panel', function(e) {
           if (!$(e.target).parents().andSelf().is(menuLink) && controller.getState() === 'open')  {
             view.toggleClose();
           }
          });
        }
		
		// add panel enabled class on menu.
		this.$menu.addClass( 'panel-enabled' );
      },
	  // toggle the menu open
	  toggleOpen: function() {
		if( Modernizr.csstransitions ){
			// add the animation css
			var animateSlide = view.transitionCss();
			this.$menu.css(animateSlide);
			if( settings.mode == 'push' )
				this.$push.css(animateSlide);
			// do toggle.
			view.toggleOpentransition();
		}
		else{
			// use Jquery animate() function for transition
			view.toggleOpenanimation();
		}
		// Add ARIA attributes.
			menuLink.attr( 'aria-expanded', 'true' );
			this.insideToggle.attr( 'aria-expanded', 'true' );
			this.$menu.attr( 'aria-expanded', 'true' );
	  },
	  // toggle the menu closed
      toggleClose: function() {
		if( Modernizr.csstransitions ){
			// add the animation css
			var animateSlide = view.transitionCss();
			this.$menu.css(animateSlide);
			if( settings.mode == 'push' )
				this.$push.css(animateSlide);
			// do toggle.
			view.toggleClosetransition();
		}
		else{
			// use Jquery animate() function for transition
			view.toggleCloseanimation();
		}
		// Add ARIA attributes.
			menuLink.attr( 'aria-expanded', 'false' );
			this.insideToggle.attr( 'aria-expanded', 'false' );
			this.$menu.attr( 'aria-expanded', 'false' );
	  },
      // toggle the menu open
      toggleOpentransition: function() {
        settings.beforeOpen();
        controller.changeState();
        this.$menu.css(settings.side, '+=' + this.dim);
		if( settings.mode == 'push' )
			this.$push.css(settings.side, '+=' + this.dim);
        menuLink.addClass(settings.activeBtn);
        settings.afterOpen();
      },

      // toggle the menu closed
      toggleClosetransition: function() {
        settings.beforeClose();
        controller.changeState();
        this.$menu.css(settings.side, '-=' + this.dim);
		if( settings.mode == 'push' )
			this.$push.css(settings.side, '-=' + this.dim );
        menuLink.removeClass(settings.activeBtn);
        settings.afterClose();
      },
	  // toggle open with animate()
	  toggleOpenanimation: function() {
        settings.beforeOpen();
        controller.changeState();
		var p = {};
			p[settings.side] = '+=' + this.dim;
		this.$menu.animate( p, settings.speed, settings.easing );
		if( settings.mode == 'push' ){
			var q = {};
			q[settings.side] = '+=' + this.dim;
			this.$push.animate( q, settings.speed, settings.easing, function(){
				menuLink.addClass(settings.activeBtn);
				settings.afterOpen();
			});
		}
      },
	  // toggle the menu closed
      toggleCloseanimation: function() {
        settings.beforeClose();
        controller.changeState();
		var p = {};
			p[settings.side] = '-=' + this.dim;
		this.$menu.animate( p, settings.speed, settings.easing );
        
		if( settings.mode == 'push' ){
			var q = {};
			q[settings.side] = '-=' + this.dim;
			this.$push.animate( q, settings.speed, settings.easing, function(){
				menuLink.removeClass(settings.activeBtn);
				settings.afterClose();
			});
		}
      },
	  transitionCss: function(){
	    // css for the sliding animation
        var animateSlide = {
          '-webkit-transition': settings.side + ' ' + settings.speed + 'ms ' + settings.transition,
          '-moz-transition': settings.side + ' ' + settings.speed + 'ms ' + settings.transition,
          '-ms-transition': settings.side + ' ' + settings.speed + 'ms ' + settings.transition,
          '-o-transition': settings.side + ' ' + settings.speed + 'ms ' + settings.transition,
          'transition': settings.side + ' ' + settings.speed + 'ms ' + settings.transition,
		  '-moz-backface-visibility': 'hidden',
          '-webkit-backface-visibility': 'hidden',
          'backface-visibility': 'hidden'
        };
		return animateSlide;
	  },
		destroy: function(){
			
			// Remove event listeners.
			menuLink.off('.panel').removeAttr( 'aria-expanded' );;
			$('body').off('.panel');
			
			// Remove inline css on push container and panel.
			this.$menu.attr( 'style', '' ).removeAttr( 'aria-expanded' );
			//if( settings.mode == 'push' )
			this.$push.attr( 'style', '' );
			
			//Remove ARIA attr.
			this.insideToggle.removeAttr( 'aria-expanded' );
			
			// remove panel enabled class on menu.
			this.$menu.removeClass( 'panel-enabled' );
			
			// Remove plugin panel object from this
			menuLink.removeData("panel");
			
			return;
		}
    }

    controller.init();
	
	// Use jQuery data() to add object on DOM.
	this.data( "panel", { 	"settings": settings,
							"model": model,
							"controller": controller,
							"view": view 
							});
	
    return this;

  };

}));