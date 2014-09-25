Ext.define('${appName}.view.main.MainController', {
    extend: 'Ext.app.ViewController',

    requires: [
        'Ext.MessageBox',
        '${appName}.services.TabService'
    ],

    alias: 'controller.main',

       
    onLogout:function(){
    	Ext.Ajax.request({
            url: Horizon.config.Runtime.getLogoutUrl(),
            method: 'POST',
            success: function(response, options) {
            	this.getView().destroy();
            	Ext.widget('login')
            },
            failure: function(response, options) {
            	Ext.Msg.alert('Logout Failed!',	response.statusText);
            },
            scope:this
        });
    }

});
