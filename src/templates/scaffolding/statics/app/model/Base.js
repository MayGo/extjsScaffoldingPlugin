/**
 * This class is the base class for all entities in the application.
 */
Ext.define('${appName}.model.Base', {
	extend : 'Ext.data.Model',

	fields : [{
		name : 'id',
		type : 'int'
	}],
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
	getUniqueName:function(){
		return Ext.getDisplayName(this).split(".").pop() + " " + this.getId()
	}
});
