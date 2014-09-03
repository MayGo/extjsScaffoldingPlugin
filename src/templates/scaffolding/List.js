<% 
	import grails.persistence.Event
	import org.codehaus.groovy.grails.commons.DomainClassArtefactHandler
%>

Ext.define('${appName}.view.${domainClass.propertyName}.List', {
	extend : '${appName}.view.BaseRestGrid',
	xtype : '${domainClass.propertyName.toLowerCase()}-gridlist',
	store : '${className}List',
	title : '${className}',
	requires : ['${appName}.view.${domainClass.propertyName}.ListController'],
	controller : '${domainClass.propertyName.toLowerCase()}-listcontroller',
	loadOnInit : true,
	
	initComponent: function() {
    	this.columns = this.defaultColumns.concat(this.columns);
        this.callParent();
        if(this.loadOnInit) this.store.load();
    },
    
	columns : [
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
			text : '${p.naturalName}',
			sortable : true,
			dataIndex : '${p.name}',
			groupable : true,
			flex: 1,
			${renderEditor(p)}
			
		},
<%  } %>
	]
});
