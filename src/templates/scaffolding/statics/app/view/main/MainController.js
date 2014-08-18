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
        var tabs = this.lookupReference('main'),
            id = prefix + '_' + rec.getId(),
            tab = tabs.items.getByKey(id);

        if (!tab) {
            cfg.itemId = id;
            cfg.closable = true;
            cfg.title = rec.getUniqueName();
            tab = tabs.add(cfg);
        }

        tabs.setActiveTab(tab);
    },
    onMenuClick: function (view, rowIdx, colIdx, item, e, rec) {
        this.createTab('asset', rec, {
            xtype: 'assetlist-grid'
        });
    },
    onSearchSelect: function( combo, records, eOpts ){
		console.log(records);
		var rec = records[0]
		this.createTab('asset', rec, {
	        xtype: 'assetlist-grid'
        });
	}
});
