Ext.define('${appName}.view.BaseDetailController', {
	extend : 'Ext.app.ViewController',

	requires : ['Ext.window.Toast'],

	onSaveClick : function() {
		var form = this.lookupReference('form'), rec;

		if (form.isValid()) {
			rec = this.getViewModel().getData().theDomainObject;
			// TODO: implement isolated sessions
			Ext.Msg.wait('Saving', 'Saving ...');
			rec.save({
				scope : this,
				success : this.onSuccess,
				failure : this.onFailure
			});
		}
	},

	onSuccess : function(list, operation) {
		Ext.Msg.hide();
		Ext.toast({
			title : 'Save',
			html : 'Saved successfully',
			align : 't',
			bodyPadding : 10
		});
	},
	
	onFailure : function(obj, operation) {
		Ext.Msg.hide();
		var form = this.lookupReference('form');
		var error = operation.getError(), msg = Ext.isObject(error) ? error.status + ' ' + error.statusText : error;
		var errors = [];
		
		Ext.each(operation.responseData.errors, function(error, index) {
			errors.push({id:error.field, msg:error.message});
		});
		
		if(errors.length>0){
			form.getForm().markInvalid(errors);
		}else{
			Ext.MessageBox.show({
				title : 'Save Failed',
				msg : msg,
				icon : Ext.Msg.ERROR,
				buttons : Ext.Msg.OK
			});
		}
	}
});
