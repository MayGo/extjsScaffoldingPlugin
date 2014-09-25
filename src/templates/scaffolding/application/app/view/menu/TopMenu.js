Ext.define('${appName}.view.menu.TopMenu', {
    extend: 'Ext.container.Container',
    requires:[
		'Ext.layout.container.Border',
	],

	xtype: 'top-menu',
	controller: 'topmenu',
	
	layout:'hbox',
	items:[{
        xtype: 'segmentedbutton',
        flex: 1,
        defaults:{
        	 scale: 'medium',
        	 height:50,
        	 
        },
        allowToggle: false,
        items: [{
        		glyph: 0xf015,
                text: '<h1>${appName}</h1>'
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
    },{
		xtype: 'combo',
		flex:1,
		margin: '0 5',
		height: '100%',
		store: {type:'author-liststore'},
		displayField: 'uniqueName',
		reference: 'mainSearch',
		minChars: 1,
		
		listConfig: {
		    loadingText: 'Searching...',
		    emptyText: 'No matching results found.',
		},
		listeners:{
				select:'onSearchSelect' 
		}
	}]		
});
