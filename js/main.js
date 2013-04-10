var $_ = $_ || {}; // primary namespace
$_.logging = 'Trace';

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
		$('#Root').html(this.homeTpl());
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
$_.log('init...');
		var self = this;
        this.store = new WebSqlStore(function() {
			self.renderHomeView();
			///self.showAlert('Store Initialized', 'Info');
		});
		
		this.homeTpl = Handlebars.compile($("#home-tpl").html());
		this.employeeLiTpl = Handlebars.compile($("#employee-li-tpl").html());
		
        $('.search-key').on('keyup', $.proxy(this.findByName, this));
		delete initialize;
    }

};

$_.log = function(msg) {
	if ($_.logging != false) {
		try {
			if (console != null && $_.logging != 'Trace')
				console.log(msg);
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
	app.initialize();
});