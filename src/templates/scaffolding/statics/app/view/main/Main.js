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
		'${appName}.view.main.MainController',
		'${appName}.view.main.MainModel',
		'${appName}.view.dashboard.View',
	<%
	for(d in domainClasses){%>
		'${appName}.view.${d.propertyName}.List',
		'${appName}.view.${d.propertyName}.EmbeddedArrayList',
		'${appName}.view.${d.propertyName}.EmbeddedRestList',
		'${appName}.view.${d.propertyName}.DetailView',
	<%}
	%>
	],

	 xtype: 'app-main',
	    controller: 'main',
		layout: 'border',

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
		    title: '${appName}',
		    region:'west',
		    layout: {
				type: 'vbox',
				align: 'stretch'
			},
		    margin: '5 0 0 0',
		    width: 200,
		    minWidth: 100,
		    maxWidth: 250,
		    items:[{
		        xtype: 'combo',
		        store: {type:'${domainClasses.first().getShortName().toLowerCase()}-liststore'},
		        displayField: 'uniqueName',
		        reference: 'mainSearch',
		        width:"100%",
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
		        flex: 1,
		        hideHeaders: true,
		        store : 'MenuItems',
		        listeners:{
		        	rowclick:'onClickMenuItem'
		        },
		        columns: [{
		            dataIndex: 'title',
		            flex: 1
		        }, {
		            xtype: 'actioncolumn',
		            width: 40,
		            items: [{
		                tooltip: 'Search items',
		                handler: 'onOpenSearch',
		                icon: 'resources/images/search.png'
		            },{
		                tooltip: 'Create new domain object',
		                handler: 'onCreateDomainObject',
		                icon: 'resources/images/add.png'
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
	        defaults:{
				layout: {
					type: 'vbox',
					align: 'stretch'
				},
				autoScroll : true,
	       		closable:true
	        },
	        items:[
			{
			    xtype: 'dashboard',
			    closable: false
			}
		]
    }]
});
