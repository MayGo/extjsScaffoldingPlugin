Ext.define('${appName}.view.BaseRestGrid', {
	extend : 'Ext.grid.Panel',
	requires : 'Ext.grid.filters.Filters',
	columnLines : true,
	height : 400,
	width : 910,
	multiColumnSort : true,
	multiSelect : true,

	selModel : {
		pruneRemoved : false,
		listeners : {
			selectionchange : 'onSelectionChangeListener'
		}
	},

	defaultColumns : [{
		xtype : 'rownumberer',
		width : 40,
		sortable : false
	}, {
		text : 'ID',
		width : 50,
		sortable : true,
		dataIndex : 'id',
		renderer : function(v, meta, rec) {
			return rec.phantom ? '' : v;
		}
	}],
	dockedItems : [{
		dock : 'top',
		xtype : 'toolbar',
		items : [{
			width : 400,
			fieldLabel : 'Search',
			labelWidth : 50,
			xtype : 'searchfield',
			store : 'AssetList'
		}, '->', {
			xtype : 'component',
			itemId : 'status',
			tpl : 'Matching threads: {count}',
			style : 'margin-right:5px'
		}, {
			text : 'Add',
			iconCls : 'icon-add',
			handler : 'addItemHandler'
		}, '-', {
			itemId : 'delete',
			text : 'Delete',
			iconCls : 'icon-delete',
			disabled : true,
			handler : 'deleteItemHandler'
		}]
	}, {
		xtype : 'pagingtoolbar',
		store : this.store, // same store GridPanel is using
		dock : 'bottom',
		displayInfo : true
	}],
	viewConfig : {
		stripeRows : true
	},
	plugins : [{
		ptype : 'rowediting',
		pluginId : 'rowediting'
	}]
});
