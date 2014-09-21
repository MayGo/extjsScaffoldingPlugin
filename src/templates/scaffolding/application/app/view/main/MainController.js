Ext.define('${appName}.view.main.MainController', {
    extend: 'Ext.app.ViewController',

    requires: [
        'Ext.MessageBox',
        '${appName}.services.TabService'
    ],

    alias: 'controller.main',

    onClickMenuItem: function ( view, rec, colIdx, rowIdx, e, eOpts ){
     	var title = rec.data['title'];
    	var xtype = ${appName}.services.TabService.domainListXtype(title);
    	${appName}.services.TabService.createTab(xtype, null, {
        	title: title,
            xtype: xtype
        });
    },
    
    onSearchSelect: function( combo, records, eOpts ){
    	 var rec = records[0];
    	 ${appName}.services.TabService.openDomainDetailTab(rec);
	},	
	
	onOpenSearch : function (view, rowIdx, colIdx, item, e, rec) {
		e.preventDefault();
    	var domain = rec.data['title'];
    	var searchBox = this.lookupReference('mainSearch');
    	searchBox.clearValue();
    	searchBox.bindStore({type:Ext.util.Format.lowercase(domain) + "-liststore"});
    	searchBox.store.load();
		searchBox.expand();
    },
    
    onCreateDomainObject: function (view, rowIdx, colIdx, item, e, rec) {
    	var domain = rec.data['title'];
    	var newRecord = Ext.create('${appName}.model.' + domain);
    	${appName}.services.TabService.openDomainDetailTab(newRecord, true);
    }

});
