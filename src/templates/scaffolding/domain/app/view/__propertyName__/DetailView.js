<% 
	import grails.plugin.extjsscaffolding.ScaffoldingHelper
%>
Ext.define('${appName}.view.${domainClass.propertyName}.DetailView', {
    extend: '${appName}.view.BaseDetailView',
    alias: 'widget.${domainClass.propertyName.toLowerCase()}-detailview',
    
    requires: [
        '${appName}.view.${domainClass.propertyName}.DetailModel',
        '${appName}.view.${domainClass.propertyName}.DetailController'
    ],
  
    componentCls: '${domainClass.propertyName.toLowerCase()}-detail',
    
    controller: '${domainClass.propertyName.toLowerCase()}-detailcontroller',
    viewModel: {
        type: '${domainClass.propertyName.toLowerCase()}-detailviewmodel'
    },
    
    items: [{
        xtype: 'base-form',
        reference: 'baseform',
        defaults: {
            anchor: '95%',
            maxWidth: 400
        },
        items: [\
		<%  
		
		props = ScaffoldingHelper.getProps(domainClass, pluginManager, comparator, getClass().classLoader)
		
		for (p in props) {
			if (p.embedded) {
				def embeddedPropNames = p.component.persistentProperties*.name
				def embeddedProps = p.component.properties.findAll { embeddedPropNames.contains(it.name) && !excludedProps.contains(it.name) }
				Collections.sort(embeddedProps, comparator.constructors[0].newInstance([p.component] as Object[]))
				//NOT USED
			} else {
				renderFieldForProperty(p, domainClass)
			}
		}
		
		private renderFieldForProperty(property, owningClass, prefix = "") {
			boolean hasHibernate = pluginManager?.hasGrailsPlugin('hibernate') || pluginManager?.hasGrailsPlugin('hibernate4')
			boolean required = false
			if (hasHibernate) {
				cp = owningClass.constrainedProperties[property.name]
				required = (cp ? !(cp.propertyType in [boolean, Boolean]) && !cp.nullable : false)
			}
			%>
			{
	            fieldLabel: '${property.naturalName}',
	            name:'${property.name}',    
				${renderEditor(property, true)}
				
			},
		<%  } %>        
		]
    }]
});
