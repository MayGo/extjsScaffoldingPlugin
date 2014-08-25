/**
 * This class is the main view for the application. It is specified in app.js as the
 * "autoCreateViewport" property. That setting automatically applies the "viewport"
 * plugin to promote that instance of this class to the body element.
 *
 * TODO - Replace this content of this view to suite the needs of your application.
 */
Ext.define('${appName}.view.main.MainController', {
    extend: 'Ext.app.ViewController',

    requires: [
        'Ext.MessageBox',
        'ResourceManager.services.TabService'
    ],

    alias: 'controller.main',

    onClickMenuItem: function ( view, rec, colIdx, rowIdx, e, eOpts ){
     	var title = rec.data['title'];
    	var xtype = ResourceManager.services.TabService.domainListXtype(title);
        ResourceManager.services.TabService.createTab(xtype, null, {
        	title: title,
            xtype: xtype
        });
    },
    
    onSearchSelect: function( combo, records, eOpts ){
    	 var rec = records[0];
	     ResourceManager.services.TabService.openDomainDetailTab(rec);
	},	
	
	onOpenSearch : function (view, rowIdx, colIdx, item, e, rec) {
		e.preventDefault();
    	var domain = rec.data['title'];
    	var searchBox = this.lookupReference('mainSearch');
    	searchBox.bindStore({type:Ext.util.Format.lowercase(domain) + "list"});
		searchBox.expand();
    },
    
    onCreateDomainObject: function (view, rowIdx, colIdx, item, e, rec) {
    	var domain = rec.data['title'];
    	var newRecord = Ext.create('ResourceManager.model.' + domain);
	    ResourceManager.services.TabService.openDomainDetailTab(newRecord);
    }

});
