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
			
			url : 'http://localhost:8080/${appName}/{entityName:uncapitalize}s',
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
	}

});
