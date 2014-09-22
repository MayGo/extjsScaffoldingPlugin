<% 
	import grails.plugin.extjsscaffolding.ScaffoldingHelper
%>
Ext.define('${appName}.model.${className}', {
	extend : '${appName}.model.Base',
	fields : [
		
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
