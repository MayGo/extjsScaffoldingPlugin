/**
 * This class is the ViewModel for the asset details view.
 */
Ext.define('${appName}.view.${domainClass.propertyName}.DetailModel', {
    extend: 'Ext.app.ViewModel',

    alias: 'viewmodel.${domainClass.propertyName.toLowerCase()}-detailviewmodel',
    data:{
		isReadOnly:true,
		dataHasChanged:false
	}
});
