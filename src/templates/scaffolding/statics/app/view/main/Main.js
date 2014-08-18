/**
 * This class is the main view for the application. It is specified in app.js as the
 * "autoCreateViewport" property. That setting automatically applies the "viewport"
 * plugin to promote that instance of this class to the body element.
 *
 * TODO - Replace this content of this view to suite the needs of your application.
 */
Ext.define('${appName}.view.main.Main', {
    extend: 'Ext.container.Container',
    requires:[
		'Ext.layout.container.Border',
		'ResourceManager.view.main.MainController',
		'ResourceManager.view.main.MainModel',
	<%
	for(d in domainClasses){%>
		'${appName}.view.${d.propertyName}.List',
	<%}
	%>
	],

	 xtype: 'app-main',
	    controller: 'main',
		layout: 'border',
		width: 500,
		height: 400,
		
		bodyBorder: false,
		
		defaults: {
		    collapsible: true,
		    split: true,
		    bodyPadding: 1,
		    floatable: false
		},
		
		items: [
		    {
		    title: 'Ver. 0.1. Build: 2.23234.1',
		    region: 'south',
		    height: 100,
		    collapsed:true,
		    minHeight: 75,
		    maxHeight: 150,
		    html: '<p>Information about application</p>'
		},
		{
			xtype: 'panel',
		    title: 'ResourceManager',
		    region:'west',
		    margin: '5 0 0 0',
		    width: 200,
		    minWidth: 100,
		    maxWidth: 250,
		    items:[{
		        xtype: 'combo',
		        store: 'AssetList',
		        displayField: 'name',
		        minChars: 1,
		        listConfig: {
		            loadingText: 'Searching...',
		            emptyText: 'No matching results found.',
		        },
		        listeners:{
		        	select:'onSearchSelect' 
		        }
		    },
		    {
		        xtype: 'grid',
		        hideHeaders: true,
		        store : 'MenuItems',
		        columns: [{
		            dataIndex: 'title',
		            flex: 1
		        }, {
		            xtype: 'actioncolumn',
		            width: 20,
		            handler: 'onProjectSearchClick',
		            stopSelection: false,
		            items: [{
		                tooltip: 'Search tickets',
		                iconCls: 'search'
		            }]
		        }]
		    }]
		},{
			region: 'center',
	        collapsible: false,
	        margin: '5 0 0 0',
	        xtype: 'tabpanel',
	        id: 'myTabpanel',
	        reference: 'main',
	        items:[
		<%
	for(d in domainClasses){%>
		{
            xtype: '${d.propertyName}list-grid'
        },
	<%}
	%>
		]
    }]
});
