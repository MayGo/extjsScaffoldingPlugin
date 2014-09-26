Ext.define('${appName}.view.main.Main', {
    extend: 'Ext.container.Container',
    plugins : 'viewport',
    requires:[
		'Ext.layout.container.Border',
		'${appName}.view.main.MainController',
		'${appName}.view.main.MainModel',
		'${appName}.view.menu.TopMenu',
		'${appName}.view.menu.TopMenuController',
		'${appName}.view.dashboard.View',
		'${appName}.view.BaseForm',
	<%
	for(d in domainClasses){%>
		'${appName}.view.${d.propertyName}.ListView',
		'${appName}.view.${d.propertyName}.EmbeddedArrayList',
		'${appName}.view.${d.propertyName}.EmbeddedRestList',
		'${appName}.view.${d.propertyName}.DetailView',
	<%}
	%>
	],

	 xtype: 'app-main',
	    controller: 'main',
	    layout: {
	        type: 'vbox',
	        align : 'stretch',
	        pack  : 'start'
	    },

		bodyBorder: false,
		
		defaults: {
		    bodyPadding: 1,
		},
		
		items: [
		{
			xtype: 'panel',
		    layout: {
		    	type: 'hbox',
		        pack: 'start',
		        align: 'stretch'
			},
		    items: [
		        {
			    	xtype:'top-menu',
			    	flex: 1
			    },
			    {
			    	type:'component', 
			    	flex: 1
			    },
			    {
					xtype: 'combo',
					margin: '3 10',
			    	width: 200,
					store: {type:'author-liststore'},
					displayField: 'uniqueName',
					itemId: 'mainSearch',
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
			    	type:'component', 
			    	layout:'fit',
			    	items:[{ xtype: 'button', text: 'Logout', handler: 'onLogout', scale: 'medium'}]
			    }
		
		    ]
		},{
	        flex:1,
	        margin: '5 0 0 0',
	        xtype: 'tabpanel',
	        id: 'myTabpanel',
	        reference: 'main',
	        items:[
			{
			    xtype: 'dashboard',
			    closable: false
			}
		]
    },{
	    title: 'Ver. 0.1. Build: 2.23234.1',
	    region: 'south',
	    height: 100,
	    collapsed:true,
	    collapsible: true,
	    minHeight: 75,
	    maxHeight: 150,
	    html: '<p>Information about application</p>'
	}]
});
