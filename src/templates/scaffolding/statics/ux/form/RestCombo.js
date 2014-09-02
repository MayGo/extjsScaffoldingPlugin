Ext.define('Ext.ux.form.RestCombo', {
	extend: 'Ext.form.field.ComboBox',

	alias: 'widget.restcombo',

	listeners: {
		afterrender: function() {
			//Load full object from store using objects id
			var customObj = this.bind.value.getValue();
			if(customObj){
				var id = customObj['id'];
				this.store.load({
					id: id,
					scope:this,
					callback: function(records, operation, success){
						if(success && records.length == 1){
							this.setValue(records[0])
						}
					}
				});
			}
		}
	}
});