Ext.define('${appName}.view.menu.TopMenu', {
    extend: 'Ext.container.Container',
    requires:[
		'Ext.layout.container.Border',
	],

	xtype: 'top-menu',
	controller: 'topmenu',
	items:[{
        xtype: 'segmentedbutton',
        defaults:{
        	 scale: 'medium',
        	 height:30
        },
        allowToggle: false,
        items: [{
        		glyph: 0xf015,
                text: '<b>${appName}</b>'
            },\
            <%
            int i = 70
            for(d in domainClasses){%>
            	{
            		xtype: 'splitbutton',
            		text: '${d.getShortName()}',
            		value: '${d.getShortName()}',
            		glyph: $i,
            		handler: 'onClickMenuItem',
                    menu: [
                        { 
                        	text: 'Search items',
                        	handler: 'onOpenSearch',
                        	value: '${d.getShortName()}',
                        	glyph: 0xf002
                        },
                        { 
                        	text: 'Create new',
                        	handler: 'onCreateDomainObject',
                        	value: '${d.getShortName()}',
                        	glyph: 0xf067 
                        }
                    ]
            	},\
            <%
            i++
            }%>]
    }]		
});
