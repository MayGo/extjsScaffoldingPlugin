Ext.define('${appName}.config.Runtime',{
	    singleton : true,
	    config : {
	        applicationUrl : '${appUrl}',
		    loginUrl : '${appUrl}/api/login' 
	    },
	    constructor : function(config){
	        this.initConfig(config);
	    }
});
