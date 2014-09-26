
Ext.define('${appName}.view.${domainClass.propertyName}.EmbeddedArrayList', {
	// Extend from Ext.form.field.Base for all the label related business
	extend : 'Ext.form.field.Base',
	xtype : '${domainClass.propertyName.toLowerCase()}-embedded-arraylist',
	width:'100%',	
	//load store data with parameter domain.id(eg: user.id=1) or takes relations ids and loads them separatelly
	referencedPropertyName: null, 
	
	initComponent : function() {
		this.grid = this.childComponent = Ext.create('${appName}.view.${domainClass.propertyName}.RestList', {
			isEmbeddedList : (this.referencedPropertyName)?false:true
		});
		
		//disable remote sorting  if there is no search property
		if(!this.referencedPropertyName) this.grid.store.remoteSort = false
		//Make copy of store
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
			var form = this.ownerCt;
			if(this.referencedPropertyName){
				
				var id = form.getRecord().getId();
				var name = this.referencedPropertyName;
				//Load only "referencedPropertyName" reference values
				this.grid.store.proxy.extraParams[name]=id;
				this.grid.store.load({
					callback : this.loadStoreCallback,
					scope: this
				});
			}else{
				Ext.each(values, function(record) {
					this.grid.store.load({
						id : record['id'],
						addRecords : true,
						callback : this.loadStoreCallback,
						scope: this
					});
				}, this);
			}
		}
	},
	
	setReadOnly: function(readOnly) {
        var me = this,
            inputEl = me.inputEl;
        readOnly = !!readOnly;
        console.log("readonly")
       // me.fireEvent('writeablechange', me, readOnly);
    },
	
	
	loadStoreCallback: function(records, operation, success) {
		// Data has not actually changed, consider loaded data not dirty
		var rawData = [];
		Ext.each(this.grid.store.getRange(), function(rec) {
			rawData.push(rec.getData());
		});
	
		this.value = rawData;
		this.resetOriginalValue();
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
    markInvalid : function(errors) {
		console.log("mark invalid");
		console.log(errors)

		// Save the message and fire the 'invalid' event
		var me = this, oldMsg = me.getActiveError(), active;
		
		var i = 0;
		errors.each(function(field, error, length) {
			console.log(field, error, length);
			//var model = me.grid.store.getAt(i);

			var view = me.grid.getView();
			var editor = me.grid.getPlugin('rowediting');
			editor.startEdit(i, 0);
			console.log(editor.editor.down("[name=" + field + "]"));
			editor.editor.down("[name=" + field + "]").markInvalid(error);

			i++;
		});
		/*me.setActiveErrors(Ext.Array.from(errors));
		active = me.getActiveError();
		if (oldMsg !== active) {
			me.setError(active);
		}*/
	}
});
