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
    
    domainRecord: null, //Is Added in TabService.openDomainDetailTab
    listeners:{
		beforerender: function (self, eOpts){
			this.lookupReference('baseform').loadRecord(this.domainRecord);
		}
	},
    layout: {
        type: 'vbox',
        align: 'stretch'
    },
    
    bodyPadding: 20,
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
