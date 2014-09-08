Ext.define('${appName}.view.BaseForm', {
    extend: 'Ext.form.Panel',
	
	xtype: 'base-form',
	
	trackResetOnLoad:true,
	
	viewModel:{
		
	},
    bind: {
        formReadOnly: '{isReadOnly}'
    },
    setFormReadOnly:function(readOnly){
		var form = this.getForm();
		var fields = form.getFields();
		Ext.each(fields.items, function (field) {
			field.setReadOnly(readOnly);
		});
	},
	listeners:{
		dirtychange: function( self, dirty, eOpts ){
			//Change data on DetailView-s viewModel
			this.lookupViewModel(true).set('dataHasChanged', dirty);
		}
		
	}
});
