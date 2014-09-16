/**
 * This class is the base class for all entities in the application.
 */
Ext.define('${appName}.model.Base', {
	extend : 'Ext.data.Model',

	fields : [{
		name : 'id',
		type : 'int'
	}, {
		name : 'uniqueName',
		type : 'string',
		convert : function(newValue, model) {
			return Ext.getDisplayName(model).split(".").pop() + " " + (model.get('id')?model.get('id'):"[new]");
		}
	}
	],
	
	schema : {
		namespace : '${appName}.model',

		proxy : {
			type : 'rest',
			
			url : ${appName}.config.Runtime.getApplicationUrl() +'/{entityName:lowercase}s',
			reader: {
			    rootProperty : 'list',
			    totalProperty  : 'total'
			},
			startParam:'offset',
			limitParam:'max'
		}
	},
	
	getDomainName:function(){
		return Ext.getDisplayName(this).split(".").pop();
	},
	
	proxy : {
		listeners:{
			exception :function(proxy, type, operation){
				if(operation.request._records && operation.request._records[0].id && operation.responseData && operation.responseData.errors){ 
					var recordId = operation.request._records[0].id;
				
					var tabView = Ext.getCmp('myTabpanel').getActiveTab();
				
					if(tabView instanceof ${appName}.view.BaseRestGrid){
						var view = tabView.getView();
						var instance = view.getRecord(recordId);
						var editor = tabView.getPlugin('rowediting');
						editor.startEdit(tabView.store.indexOfId(recordId), 0);
	
						Ext.each(operation.responseData.errors, function(error, index) {
							editor.editor.down("[name=" + error.field + "]").markInvalid(error.message);
						});	
					}
				}else{
					Ext.MessageBox.show({
						title : 'Remote Exception',
						msg : operation.responseText,
						icon : Ext.MessageBox.ERROR,
						buttons : Ext.Msg.OK
					});
				}
			}
		}
	}

});
