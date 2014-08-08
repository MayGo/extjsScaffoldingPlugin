Ext.define('${appName}.store.${className}List', {
	extend : 'Ext.data.Store',
	requires : [ 'Ext.data.proxy.Rest' ],
	model : '${appName}.model.${className}',
	autoLoad : true,
	autoSync : true,
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
			//TODO:replace with note in sidebar
			Ext.MessageBox.show({
				msg : Ext.String.format("{0} user: {1}", verb, record.getId()),
				icon : Ext.MessageBox.INFO,
				buttons : Ext.Msg.OK
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