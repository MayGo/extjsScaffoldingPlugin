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
        title: '{theDomainObject.uniqueName}'
    },
    
    layout: {
        type: 'vbox',
        align: 'stretch'
    },
    
    bodyPadding: 20,
    maxWidth : 400,
    tbar: [{
        text: 'Save',
        handler: 'onSaveClick'
    }]
});
