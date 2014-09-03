
Ext.define('${appName}.services.TabService', {
   singleton: true,
   
   createTab: function (prefix, rec, cfg) {
        var tabs = Ext.getCmp('myTabpanel');
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
	domainListXtype:function(domainName){
		return  Ext.util.Format.lowercase(domainName) + "-gridlist";
	},	
	
	domainDetailXtype:function(domainName){
		return  Ext.util.Format.lowercase(domainName) + "-detailview";
	}
	
});
