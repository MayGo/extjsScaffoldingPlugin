Ext.define('${appName}.view.BaseDetailView', {
    extend: 'Ext.panel.Panel',
    
    requires: [
        'Ext.form.Panel',
        'Ext.form.field.Text',
        'Ext.form.field.TextArea',
        'Ext.layout.container.VBox',
        'Ext.form.field.ComboBox',
        'Ext.view.View'
    ],
    
    bind: {
        title: '{theDomainObject.tabName}'
    },
    layout: {
        type: 'border',
        align: 'stretch'
    },
    tbar: [{
        text: 'Save',
        handler: 'onSaveClick',
        scale: 'medium',
		hidden: true,
    	 bind: {
             hidden: '{isReadOnly}',
			 disabled : '{!dataHasChanged}'
         }
    },{
        text: 'Reset',
        handler: 'onResetClick',
        scale: 'medium',
		hidden: true,
    	 bind: {
             hidden: '{isReadOnly}',
			 disabled : '{!dataHasChanged}'
         }
    },{
        text: 'Edit',
        handler: 'onEditClick',
        scale: 'medium',
    	 bind: {
             hidden: '{!isReadOnly}'
         }
    }]
});
