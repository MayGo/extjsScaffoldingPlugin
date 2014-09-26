/**
 * This class is the ViewModel for the asset details view.
 */
Ext.define('${appName}.view.${domainClass.propertyName}.ListModel', {
    extend: 'Ext.app.ViewModel',

    alias: 'viewmodel.${domainClass.propertyName.toLowerCase()}-listviewmodel',
    stores:{
    	listStore:{
            model: '${className}',
            autoLoad: true
        }	
	}
});
