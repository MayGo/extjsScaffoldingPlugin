Ext.define('${appName}.config.Runtime',{
	singleton : true,
	config : {
		applicationUrl : '${config.grails.serverURL}',
		loginUrl : '${config.grails.serverURL}${config.grails.plugin.springsecurity.rest.login.endpointUrl}',
		securityEnabled : ${(config.grails.plugin.springsecurity.rest.login.active)?:false}
	},
	constructor : function(config){
		this.initConfig(config);
	}
});
