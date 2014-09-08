Ext.define('${appName}.view.BaseDetailController', {
	extend : 'Ext.app.ViewController',

	requires : ['Ext.window.Toast'],

	onSaveClick : function() {
		this.getViewModel().set('dataHasChanged', false);
		var form = this.lookupReference('baseform'), rec;

		if (form.isValid()) {
			form.updateRecord();
			rec = form.getRecord();
			// TODO: implement isolated sessions
			Ext.Msg.wait('Saving', 'Saving ...');
			rec.save({
				scope : this,
				success : this.onSuccess,
				failure : this.onFailure
			});
		}
	},
	onResetClick : function() {
		this.getViewModel().set('dataHasChanged', false);
		var form = this.lookupReference('baseform');
		form.reset();
	},
	onEditClick : function() {
		this.getViewModel().set('isReadOnly', false);
	},
	

	onSuccess : function(list, operation) {
		this.getViewModel().set('dataHasChanged', false);
		Ext.Msg.hide();
		var record = operation.getRecords()[0], name = Ext.String.capitalize(operation.action), verb;

		if (name == 'Destroy') {
			verb = 'Destroyed';
		} else {
			verb = name + 'd';
		}
		Ext.toast({
			html : Ext.String.format("{0} {1}", verb, record.get('uniqueName')),
			align : 't',
			bodyPadding : 10
		});
		
	},
	
	onFailure : function(obj, operation) {
		this.getViewModel().set('dataHasChanged', true);
		Ext.Msg.hide();
		var form = this.lookupReference('baseform');
		var error = operation.getError(), msg = Ext.isObject(error) ? error.status + ' ' + error.statusText : error;
		var errors = [];
		
		if(operation.responseData){
			Ext.each(operation.responseData.errors, function(error, index) {
				errors.push({id:error.field, msg:error.message});
			});
		}
		
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
