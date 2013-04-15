var $_ = $_ || {}; // primary namespace
$_.logging = 'Trace';

// THE APP
var app = {
	// UTILS
	showAlert: function (message, title) {
	    if (navigator.notification) {
	        navigator.notification.alert(message, null, title, 'OK');
	    } else {
	        alert(title ? (title + ": " + message) : message);
	    }
	},

	registerEvents: function() {
	    // Check of browser supports touch events...
	    if (document.documentElement.hasOwnProperty('ontouchstart')) {
	        // ... if yes: register touch event listener to change the "selected" state of the item
	        $('body').on('touchstart', 'a', function(event) {
	            $(event.target).addClass('tappable-active');
	        });
	        $('body').on('touchend', 'a', function(event) {
	            $(event.target).removeClass('tappable-active');
	        });
	    } else {
	        // ... if not: register mouse events instead
	        $('body').on('mousedown', 'a', function(event) {
	            $(event.target).addClass('tappable-active');
	        });
	        $('body').on('mouseup', 'a', function(event) {
	            $(event.target).removeClass('tappable-active');
	        });
	    }
	},

	slidePage: function(page) {
	    var currentPageDest,
	        self = this;

	    // If there is no current page (app just started) -> No transition: Position new page in the view port
	    if (!this.currentPage) {
	        $(page.el).attr('class', 'page stage-center');
	        $('#Root').append(page.el);
	        this.currentPage = page;
	        return;
	    }

	    // Cleaning up: remove old pages that were moved out of the viewport
	    $('.stage-right, .stage-left').not('.homePage').remove();

	    if (page === app.homePage) {
	        // Always apply a Back transition (slide from left) when we go back to the search page
	        $(page.el).attr('class', 'page stage-left');
	        currentPageDest = "stage-right";
	    } else {
	        // Forward transition (slide from right)
	        $(page.el).attr('class', 'page stage-right');
	        currentPageDest = "stage-left";
	    }

	    $('#Root').append(page.el);

	    // Wait until the new page has been added to the DOM...
	    setTimeout(function() {
	        // Slide out the current page: If new page slides from the right -> slide current page to the left, and vice versa
	        $(self.currentPage.el).attr('class', 'page transition ' + currentPageDest);
	        // Slide in the new page
	        $(page.el).attr('class', 'page stage-center transition');
	        self.currentPage = page;
	    });
	},

	route: function() {
		var self = this;
	    var hash = window.location.hash;
	    if (!hash) {
	        if (this.homePage) {
	            this.slidePage(this.homePage);
	        } else {
	            this.homePage = new HomeView(this.store).render();
	            this.slidePage(this.homePage);
	        }
	        return;
	    }
	    var match = hash.match(this.detailsURL);
	    if (match) {
	        this.store.findById(Number(match[1]), function(employee) {
	            self.slidePage(new EmployeeView(employee).render());
	        });
	    }
	},

	// INIT
    initialize: function() {
$_.log('init...');
		var self = this;
        this.store = new WebSqlStore(function() {
			//$('#Root').html(new HomeView(self.store).render().el);
			self.route();
		});

		this.detailsURL = /^#employees\/(\d{1,})/;
		$(window).on('hashchange', $.proxy(this.route, this));

		this.registerEvents();

		delete initialize;
    }

};

$_.log = function(msg) {
	if ($_.logging != false) {
		try {
			if (console != null && $_.logging != 'Trace')
				$_.log(msg);
			else {
				if ($('#Trace').length == 0) $('body').append('<div id="Trace" style="position: absolute; padding: 2px; background: yellow; color: black; bottom: 0; right: 0; z-index: 99999999999;"></div>');
				s = $('#Trace').html();
				if (s != '') s+='<br />';
				$('#Trace').css({'display': 'block'}).html(s+msg);
			}
		} catch (e) { }
	}
};

// Run once the device or browser/page is ready
$(function() {
	document.addEventListener("offline", onOffline, false);

	app.initialize();

	function onOffline() {
		$_.log('Offline!');
		//app.showAlert('Please activate the Internet.');
		return false;
	}
	
});