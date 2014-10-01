
Ext.define('${appName}.view.${domainClass.propertyName}.EmbeddedRestList', {
	extend : '${appName}.view.${domainClass.propertyName}.RestList',
	xtype : '${domainClass.propertyName.toLowerCase()}-embedded-restlist',
	requires: [
	          '${appName}.view.${domainClass.propertyName}.EmbeddedListModel'
	],
	viewModel: {
		type: '${domainClass.propertyName.toLowerCase()}-embedded-listviewmodel'
	}
});
