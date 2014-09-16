Ext.define('${appName}.config.Runtime',{
	    singleton : true,
	    config : {
	        applicationUrl : '${appUrl}'   
	    },
	    constructor : function(config){
	        this.initConfig(config);
	    }
});
