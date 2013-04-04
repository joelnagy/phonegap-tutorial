// THE APP
var app = {

    findByName: function() {
        var self = this;
	    this.store.findByName($('.search-key').val(), function(employees) {
	        $('.employee-list').html(self.employeeLiTpl(employees));
	    });
    },

	// RENDER HOME SCREEN
	renderHomeView: function() {
		$('body').html(this.homeTpl());
	    $('.search-key').on('keyup', $.proxy(this.findByName, this));
	},

	// UTILS
	showAlert: function (message, title) {
	    if (navigator.notification) {
	        navigator.notification.alert(message, null, title, 'OK');
	    } else {
	        alert(title ? (title + ": " + message) : message);
	    }
	},

	// INIT
    initialize: function() {
		var self = this;
        this.store = new WebSqlStore(function() {
			self.renderHomeView();
			///self.showAlert('Store Initialized', 'Info');
		});
		
		this.homeTpl = Handlebars.compile($("#home-tpl").html());
		this.employeeLiTpl = Handlebars.compile($("#employee-li-tpl").html());
		
        $('.search-key').on('keyup', $.proxy(this.findByName, this));
    }

};

// Run once the device or browser/page is ready
$(function() {
	app.initialize();
});