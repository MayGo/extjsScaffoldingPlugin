Ext.define('${appName}.config.Runtime',{
	singleton : true,
	config : {
		applicationUrl : '${config.grails.serverURL}',
		loginUrl : '${config.grails.serverURL}${(config.grails.plugin.springsecurity.rest.login.endpointUrl)?:"/api/login"}',
		logoutUrl : '${config.grails.serverURL}${(config.grails.plugin.springsecurity.rest.logout.endpointUrl)?:"/api/logout"}',
		validationUrl:  '${config.grails.serverURL}${(config.grails.plugin.springsecurity.rest.token.validation.endpointUrl)?:"/api/validate"}',
		securityEnabled : ${(config.grails.plugin.springsecurity.rest.login.active)?:false}
	},
	constructor : function(config){
		this.initConfig(config);
	}
});
