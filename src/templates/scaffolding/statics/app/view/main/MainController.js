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
        'Ext.MessageBox'
    ],

    alias: 'controller.main',

    createTab: function (prefix, rec, cfg) {
        var tabs = this.lookupReference('main');
        var  id = prefix + "_tab";
        if(rec) id =prefix + '_' + rec.getId();
        var  tab = tabs.items.getByKey(id);


        if (!tab) {
            cfg.itemId = id;
            cfg.closable = true;
            if(rec) cfg.title = rec.get('uniqueName');
            tab = tabs.add(cfg);
        }

        tabs.setActiveTab(tab);
    },
    onClickMenuItem: function ( view, rec, colIdx, rowIdx, e, eOpts ){
     	var title = rec.data['title'];
    	var xtype = this.domainListXtype(title);
        this.createTab(xtype, null, {
        	title: title,
            xtype: xtype
        });
     },
    
    onSearchSelect: function( combo, records, eOpts ){
    	 var rec = records[0];
	     this.openDomainDetailTab(rec);
	},	
	
	openDomainDetailTab: function(rec){
		var domain = rec.getDomainName();
    	var xtype = this.domainDetailXtype(domain);
        this.createTab(domain, rec, {
            xtype: xtype,
            session: new Ext.data.Session({
                data: [rec]
            }),
            viewModel: {
                data: {
                    theDomainObject: rec
                }
            }
        });
	},
	
	onOpenSearch : function (view, rowIdx, colIdx, item, e, rec) {
		e.preventDefault();
    	var domain = rec.data['title'];
    	var searchBox = this.lookupReference('mainSearch');
    	searchBox.bindStore(domain + "List");
		searchBox.expand();
    },
    
    onCreateDomainObject: function (view, rowIdx, colIdx, item, e, rec) {
    	var domain = rec.data['title'];
    	var newRecord = Ext.create('ResourceManager.model.' + domain);
	    this.openDomainDetailTab(newRecord);
    },
    
	domainListXtype:function(domainName){
		return  Ext.util.Format.lowercase(domainName) + "gridlist";
	},	
	
	domainDetailXtype:function(domainName){
		return  Ext.util.Format.lowercase(domainName) + "detail";
	}

});
