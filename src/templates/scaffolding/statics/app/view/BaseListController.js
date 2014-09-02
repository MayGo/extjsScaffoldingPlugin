Ext.define('${appName}.view.BaseListController', {
	extend : 'Ext.app.ViewController',
	
	 requires: [
        '${appName}.services.TabService'
    ],

    addItemHandler : function() {
		var grid = this.view;
		var store = grid.store;
		var plugin = grid.getPlugin('rowediting');
		store.insert(0, Ext.create(store.model));
		plugin.startEdit(0, 0);
	},
	deleteItemHandler : function() {
		var grid = this.view;
		var store = grid.store;
		var selection = grid.getView().getSelectionModel().getSelection()[0];
		if (selection) {
			store.remove(selection);
		}
	},

	onSelectionChangeListener : function(model, selection) {
		var grid = this.view;
		grid.down('#delete').setDisabled(selection.length === 0);
	},

	init : function() {

	},
	openDomainObjectInTab: function (view, rowIdx, colIdx, item, e, rec) {
		${appName}.services.TabService.openDomainDetailTab(rec);
    },
    
});
