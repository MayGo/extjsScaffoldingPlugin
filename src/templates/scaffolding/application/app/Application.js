/**
 * The main application class. An instance of this class is created by app.js when it calls
 * Ext.application(). This is the ideal place to handle application launch and initialization
 * details.
 */
Ext.define('${appName}.Application', {
    extend: 'Ext.app.Application',
    
    name: '${appName}',
    requires : ['${appName}.config.Runtime'],

    views: [
		'login.Login',
		'main.Main'
    ],

    stores: [
             'MenuItems',
	<%
	for(d in domainClasses){%>
		'${d.getShortName()}List',
	<%}
	%>
    ],
    
    launch: function () {
    	var loggedIn = false;
    	if(Horizon.config.Runtime.getSecurityEnabled()){
			var supportsLocalStorage = Ext.supports.LocalStorage;
	
			if (!supportsLocalStorage) {
				// Alert the user if the browser does not support localStorage
				Ext.Msg.alert('Your Browser Does Not Support Local Storage');
				return;
			}
	
			var profile = Ext.create('${appName}.model.Profile');
			profile.setLoginDataFromLocalStorage();
			
			if(profile.isLoggedIn()) loggedIn = true;
    	}else{
    		loggedIn = true;
    	}
		// If loggedIn isn't true, we display the login window,
		// otherwise, we display the main view
		Ext.widget(loggedIn ? 'app-main' : 'login');
    }
});
