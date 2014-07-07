Ext.define('${appName}.store.${className}List', {
	extend : 'Ext.data.Store',
	requires : ['Ext.data.proxy.Rest'],
	model : '${appName}.model.${className}',
	autoLoad : true,
	autoSync : true,

	pageSize : 50,

	// This web service seems slow, so keep lots of data in the pipeline ahead!
	leadingBufferZone : 1000,
	remoteFilter : true
}); 