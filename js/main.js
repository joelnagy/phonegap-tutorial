// THE APP
var app = {

    findByName: function() {
        console.log('findByName');
        this.store.findByName($('.search-key').val(), function(employees) {
            var l = employees.length;
            var e;
            $('.employee-list').empty();
            for (var i=0; i<l; i++) {
                e = employees[i];
                $('.employee-list').append('<li><a href="#employees/' + e.id + '">' + e.firstName + ' ' + e.lastName + '</a></li>');
            }
        });
    },

	// RENDER HOME SCREEN
	renderHomeView: function() {
	    var html =
	            "<div class='header'><h1>Home</h1></div>" +
	            "<div class='search-view'>" +
	            "<input class='search-key'/>" +
	            "<ul class='employee-list'></ul>" +
	            "</div>"
	    $('body').html(html);
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
        $('.search-key').on('keyup', $.proxy(this.findByName, this));
    }

};

// Run once the device or browser/page is ready
$(function() {
	app.initialize();
});