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
		    collapsible: false,
		    split: false,
		    bodyPadding: 1,
		    floatable: false
		},
		
		items: [
		{
			xtype: 'panel',
		    region:'north',
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
			    	layout:'fit',
			    	items:[{ xtype: 'button', text: 'Logout', handler: 'onLogout', scale: 'medium'}]
			    }
		
		    ]
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
