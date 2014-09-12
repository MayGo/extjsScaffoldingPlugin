<% import grails.persistence.Event %>
Ext.define('${appName}.model.${className}', {
	extend : '${appName}.model.Base',
	fields : [
		
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

private renderFieldForProperty(property, owningClass, prefix = "") {
	boolean hasHibernate = pluginManager?.hasGrailsPlugin('hibernate') || pluginManager?.hasGrailsPlugin('hibernate4')
	boolean required = false
	String type = ""
	String andMore = ""
	if (hasHibernate) {
		cp = owningClass.constrainedProperties[property.name]
		required = (cp ? !(cp.propertyType in [boolean, Boolean]) && !cp.nullable : false)
		
		if(cp.propertyType in [boolean, Boolean]){
			 type = "boolean"
		}else if(cp.propertyType in [int, Integer, long, Long]){
			 type = "int"
		}else if(Number.isAssignableFrom(property.type) || (property.type?.isPrimitive() && property.type != boolean)){
			 type = "number"
		}else if(property.type == Date || property.type == java.sql.Date || property.type == java.sql.Time || property.type == Calendar){
			 type = "date"
			andMore=",dateWriteFormat: 'Y-m-d H:i:s.uO'"
		}else if(property.type == String){
			 type = "string"
		}
	}
	
	%>
	{
		name : '${property.name}',
		type: '${type}'${andMore}
	},
<%  } %>
]
});
