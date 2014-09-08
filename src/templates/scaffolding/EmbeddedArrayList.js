
Ext.define('${appName}.view.${domainClass.propertyName}.EmbeddedArrayList', {
	// Extend from Ext.form.field.Base for all the label related business
	extend : 'Ext.form.field.Base',
	xtype : '${domainClass.propertyName.toLowerCase()}-embedded-arraylist',
	
	initComponent : function() {

		this.grid = this.childComponent = Ext.create('${appName}.view.${domainClass.propertyName}.List', {
			loadOnInit : false,
			isEmbeddedList : true
		});
		//Make copy of store
		this.grid.bindStore(Ext.create(Ext.ClassManager.getName(this.grid.store)));
		this.grid.store.sync = function() {
			//TODO: Turn off sync() in rowediting
		};
		
		this.grid.store.addListener('update', function(self, eOpts) {

			//TODO:Would be nice to get store.rawData
			var rawData = [];
			Ext.each(self.getRange(), function(rec) {
				rawData.push(rec.getData());
			});

			//Change data and check if it has changed
			this.value = rawData;
			this.checkDirty();
		}, this);
		
		this.callParent(arguments);
	},// Generates the child component markup and let Ext.form.field.Base handle the rest
	
	getSubTplMarkup : function() {
		// generateMarkup will append to the passed empty array and return it
		var buffer = Ext.DomHelper.generateMarkup(this.childComponent.getRenderTree(), []);
		// but we want to return a single string
		return buffer.join('');
	},
	// Regular containers implements this method to call finishRender for each of their
	// child,     and we need to do the same for the component to display smoothly
	
	finishRenderChildren : function() {

		this.callParent(arguments);
		this.childComponent.finishRender();
	},
	// --- Resizing ---

	// This is important for layout notably
	
	onResize : function(w, h) {

		this.callParent(arguments);
		this.childComponent.setSize(w - this.getLabelWidth(), h);
	},
	
	setValue : function(values) {
		//Load full object from store using objects id
		if (values) {
			Ext.each(values, function(record) {
				this.grid.store.load({
					id : record['id'],
					addRecords : true,
					callback : function(records, operation, success) {
						// Data has not actually changed, consider loaded data not dirty
						var rawData = [];
						Ext.each(this.grid.store.getRange(), function(rec) {
							rawData.push(rec.getData());
						});

						this.value = rawData;
						this.resetOriginalValue();
					},
					scope: this
				});
			}, this);
		}
	},
	getValue : function() {
		return this.value;
	},
	/*
	 * Override isEqual to compare Object's values
	 */
	isEqual: function(value1, value2) {
        return Ext.util.JSON.encode(value1) === Ext.util.JSON.encode(value2);
    },
});
