Ext.define('Horizon.view.login.LoginController', {
	extend : 'Ext.app.ViewController',
	alias : 'controller.login',

	views : [ 'main.Main' ],

	onLogin:function(loginBtn) {
		var form = loginBtn.up('form').getForm();
		form.submit({
			url: Horizon.config.Runtime.getLoginUrl(),
			waitTitle : 'Connecting',
			waitMsg : 'Sending data...',

			success : function(form, action) {
				console.log(action)
				Ext.Msg.alert('Success', action.result.message);
				// Set the localStorage value to true
				localStorage.setItem("loggedIn", true);

				// Remove Login Window
				this.getView().destroy();

				// Add the main view to the viewport
				Ext.widget('app-main');
			},

			failure : function(form, action) {
				
				console.log(action);
				if(action.response.status == 401){
					Ext.Msg.alert('Login Failed!',	action.response.statusText);
				}else {
				    var txt = (action.response.responseText)?action.response.responseText:action.response.statusText
				    Ext.Msg.alert('Warning!', 'Authentication server is unreachable : ' + txt);
				}
				// login.getForm().reset();
			}					
		});	
	}
});
