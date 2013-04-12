var HomeView = function(store) {
    this.findByName = function() {
	    store.findByName($('.search-key').val(), function(employees) {
	        $('.employee-list').html(HomeView.liTemplate(employees));
	        if (this.iscroll) {
	            $_.log('Refresh iScroll');
	            this.iscroll.refresh();
	        } else {
	            $_.log('New iScroll');
	            this.iscroll = new iScroll($('.scroll', this.el)[0], {hScrollbar: false, vScrollbar: false });
	        }
	    });
	
    },

	// RENDER HOME SCREEN
	this.render = function() {
	    this.el.html(HomeView.template());
	    return this;
	},

	this.initialize = function() {
		// Define a div wrapper for the view. The div wrapper is used to attach events.
		this.el = $('<div/>');
		this.el.on('keyup', '.search-key', this.findByName);
	};

	this.initialize(); 
}
 
HomeView.template = Handlebars.compile($("#home-tpl").html());
HomeView.liTemplate = Handlebars.compile($("#employee-li-tpl").html());