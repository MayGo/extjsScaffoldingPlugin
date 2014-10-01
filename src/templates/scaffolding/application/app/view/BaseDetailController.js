Ext.define('${appName}.view.BaseDetailController', {
	extend : 'Ext.app.ViewController',

	requires : ['Ext.window.Toast'],

	onSaveClick : function() {
		var form = this.lookupReference('baseform'), rec;
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
	onResetClick : function() {
		var form = this.lookupReference('baseform');
		console.log("should reset");
		//form.reset();
	},
	onEditClick : function() {
		this.getViewModel().set('isReadOnly', false);
	},
	

	onSuccess : function(list, operation) {
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
			
			var isArrayPattern = /(.*)(?=.*\\[.*\\])/g;
			var relationsErrors = new Ext.util.HashMap();
			Ext.each(operation.responseData.errors, function(error, index) {
				var field = error.field;
				//Search if error contains relation error e.g: user.role[0].name
				var isArrayMatch = field.match(isArrayPattern);
				if(isArrayMatch && isArrayMatch.length > 0){
					var relationName = isArrayMatch[0];
					var relationFieldName = field.substr(field.indexOf(".")+1);
					
					//Hold all relations field errors
					var fieldErrors = relationsErrors.get(relationName);
					if (!fieldErrors) {
						fieldErrors = new Ext.util.HashMap();
					}
					fieldErrors.add(relationFieldName, error.message);
					relationsErrors.add(relationName, fieldErrors);
				}else{
					errors.push({id:field, msg:error.message});
				}
			});
			relationsErrors.each(
				function(key, value, length){
				    errors.push({id:key, msg:value});
				}
			);
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
