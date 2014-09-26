<% 
	import grails.plugin.extjsscaffolding.ScaffoldingHelper
%>
Ext.define('${appName}.view.${domainClass.propertyName}.DetailSearchView', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.${domainClass.propertyName.toLowerCase()}-detailsearchview',
    
//    requires: [
//        '${appName}.view.${domainClass.propertyName}.DetailModel',
//        '${appName}.view.${domainClass.propertyName}.DetailController'
//    ],
  
//    componentCls: '${domainClass.propertyName.toLowerCase()}-detailsearch',
    
//    controller: '${domainClass.propertyName.toLowerCase()}-detailsearchcontroller',
//    viewModel: {
//        type: '${domainClass.propertyName.toLowerCase()}-detailsearchviewmodel'
//    },
    
    title:'search',
    items: [{
    	xtype:'form',
    	defaults: {
           //anchor: '95%',
           maxWidth: 400,
           margin:15
        },
    	items: [
				<%  
				
				props = ScaffoldingHelper.getProps(domainClass, pluginManager, comparator, getClass().classLoader)
				
				for (p in props) {
					if (p.embedded) {
						def embeddedPropNames = p.component.persistentProperties*.name
						def embeddedProps = p.component.properties.findAll { embeddedPropNames.contains(it.name) && !excludedProps.contains(it.name) }
						Collections.sort(embeddedProps, comparator.constructors[0].newInstance([p.component] as Object[]))
						//NOT USED
					} else {
						renderSearchForProperty(p, domainClass)
					}
				}
				
				private renderSearchForProperty(property, owningClass, prefix = "") {
					boolean hasHibernate = pluginManager?.hasGrailsPlugin('hibernate') || pluginManager?.hasGrailsPlugin('hibernate4')
					boolean required = false
					if (hasHibernate) {
						cp = owningClass.constrainedProperties[property.name]
						required = (cp ? !(cp.propertyType in [boolean, Boolean]) && !cp.nullable : false)
					}
					if ((property.oneToMany && !property.bidirectional) || property.manyToMany) {
						
					}else{
					%>
						{
				            fieldLabel: '${property.naturalName}',
				            name:'${property.name}',    
							${renderEditor(property, true)}
							
						},
					<% }
				} %>               
    	         ]
    }]
});
