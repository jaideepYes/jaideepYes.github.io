( function( $ ){
// From here on, $ = jQuery

	var $window, windowWidth, resizeEnd, menuWrapper, menu, menuToggle, panelOptions, bgOptions, mobileOptions;
		
		//Menu
		$window = $( window );
		windowWidth = $window.width();
		menuWrapper = $( '#side-nav' ); 
		menu    = menuWrapper.find( '.main-menu' ); 
		menuToggle = $( '#nav-toggle' );
		
		// For bigger screens.
		bgOptions = {
						'menu':"#side-nav",
						'push': ".content-box",
						//'menuWidth' : "25%",
						'menuWidth' : menu.css( 'width' ),
						'state': 'open',
						'side' : 'left',
						'easing': 'easeOutQuart',
						'speed': '500',
						'mode': 'reveal'
						};
		// For Mobile					
		mobileOptions = {
						'menu':"#side-nav",
						'push': ".content-box",
						'menuWidth' : menu.css( 'width' ),
						'state': 'closed',
						'side' : 'top',
						'easing': 'easeOutQuart',
						'speed': '500',
						'mode': 'push',
						'inside': true,
						'position': 'relative',
						'menuHeight': menu.css( 'height' )
						};
		
		// If Browser viewport width less than 769 ,use mobile settings.
		if( windowWidth <= 768 )
			panelOptions = mobileOptions;
		else panelOptions = bgOptions;
		
		// Init panel
		menuToggle.panel( panelOptions );
		
		// For Browser Resizing.
		// call resize with delay of 100ms.
		$(window).on('resize', function() {
			clearTimeout(resizeEnd);
			resizeEnd = setTimeout(function() {
				$(window).trigger('resizeEnd');
			}, 100);
		});
		
		// trigger on resize.
		$window.on('resizeEnd', function() {
			if( $window.width() <= 768 ) {
			
				// Mobile
				menuToggle.data("panel").controller.destroy();
				mobileOptions.menuWidth = menu.css( 'width' );
				mobileOptions.menuHeight = menu.css( 'height' );
				menuToggle.panel( mobileOptions );
				
			} else{
				// Big
				menuToggle.data("panel").controller.destroy();
				bgOptions.menuWidth = menu.css( 'width' );
				bgOptions.menuHeight = menu.css( 'height' );
				menuToggle.panel( bgOptions );

			}
		});
		
})( jQuery );