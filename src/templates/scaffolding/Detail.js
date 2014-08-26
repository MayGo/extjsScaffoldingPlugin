<% 
	import grails.persistence.Event
	import org.codehaus.groovy.grails.commons.DomainClassArtefactHandler
%>
Ext.define('${appName}.view.${domainClass.propertyName}.Detail', {
    extend: '${appName}.view.BaseDetailView',
    alias: 'widget.${domainClass.propertyName.toLowerCase()}detail',
    
    requires: [
        '${appName}.view.${domainClass.propertyName}.DetailModel',
        '${appName}.view.${domainClass.propertyName}.DetailController'
    ],
  
    componentCls: '${domainClass.propertyName.toLowerCase()}-detail',
    
    controller: '${domainClass.propertyName.toLowerCase()}detail',
    viewModel: {
        type: '${domainClass.propertyName.toLowerCase()}detail'
    },
    
  
    items: [{
        xtype: 'component',
        bind: '{theDomainObject.uniqueName}',
        cls: 'title',
        margin: '0 0 20 0'
    }, {
        xtype: 'form',
        border: false,
        maxWidth: 400,
        reference: 'form',
        defaults: {
            anchor: '95%'
        },
        items: [

		<%  excludedProps = Event.allEvents.toList() << 'version' << 'dateCreated' << 'lastUpdated'
		persistentPropNames = domainClass.persistentProperties*.name
		boolean hasHibernate = pluginManager?.hasGrailsPlugin('hibernate') || pluginManager?.hasGrailsPlugin('hibernate4')
		if (hasHibernate) {
			def GrailsDomainBinder = getClass().classLoader.loadClass('org.codehaus.groovy.grails.orm.hibernate.cfg.GrailsDomainBinder')
			if (GrailsDomainBinder.newInstance().getMapping(domainClass)?.identity?.generator == 'assigned') {
				persistentPropNames << domainClass.identifier.name
			}
		}
		props = domainClass.properties.findAll { persistentPropNames.contains(it.name) && !excludedProps.contains(it.name) && (domainClass.constrainedProperties[it.name] ? domainClass.constrainedProperties[it.name].display : true) }
		Collections.sort(props, comparator.constructors[0].newInstance([domainClass] as Object[]))
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
		
		private renderFieldForProperty(p, owningClass, prefix = "") {
			boolean hasHibernate = pluginManager?.hasGrailsPlugin('hibernate') || pluginManager?.hasGrailsPlugin('hibernate4')
			boolean required = false
			if (hasHibernate) {
				cp = owningClass.constrainedProperties[p.name]
				required = (cp ? !(cp.propertyType in [boolean, Boolean]) && !cp.nullable : false)
			}
			%>
			{
	            fieldLabel: '${p.naturalName}',
	            name:'${p.name}',
	            <% if (p.association){%>
	            bind: '{theDomainObject.${p.name}.id}',
	            <% }else{%>
	            bind: '{theDomainObject.${p.name}}',
	            <% }%>
				${renderEditor(p, true)}
				
			},
		<%  } %>        
		]
    }]
});
