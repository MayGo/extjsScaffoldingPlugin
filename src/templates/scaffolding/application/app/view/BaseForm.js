Ext.define('${appName}.view.BaseForm', {
    extend: 'Ext.form.Panel',
	
	xtype: 'base-form',
	
	trackResetOnLoad:true,
	modelValidation:true,

	viewModel:{
		
	},
    bind: {
        formReadOnly: '{isReadOnly}',
        formRecord:'{theDomainObject}'
    },
    setFormRecord:function(record){
		this.loadRecord(record);
    },
    setFormReadOnly:function(readOnly){
		var form = this.getForm();
		var fields = form.getFields();
		Ext.each(fields.items, function (field) {
			field.setReadOnly(readOnly);
		});
	}
});
