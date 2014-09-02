Ext.define('${appName}.store.${className}List', {
	extend : 'Ext.data.Store',
	alias: 'store.${className.toLowerCase()}list',
	requires : [ 'Ext.data.proxy.Rest' ],
	model : '${appName}.model.${className}',
	autoLoad : false,
	autoSync : false,
	pageSize : 50,
	remoteFilter : true,
	
	listeners : {
		write : function(store, operation, eOpts) {
			var record = operation.getRecords()[0], name = Ext.String.capitalize(operation.action), verb;

			if (name == 'Destroy') {
				verb = 'Destroyed';
			} else {
				verb = name + 'd';
			}
			Ext.toast({
				html : Ext.String.format("{0} {1}", verb, record.get('uniqueName')),
				align : 't',
				bodyPadding : 10
			});
		},

		exception : function(proxy, response, operation) {
			Ext.MessageBox.show({
				title : 'REMOTE EXCEPTION',
				msg : operation.getError(),
				icon : Ext.MessageBox.ERROR,
				buttons : Ext.Msg.OK
			});
		}
	}
});