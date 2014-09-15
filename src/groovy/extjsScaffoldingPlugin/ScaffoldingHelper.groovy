package extjsScaffoldingPlugin

import grails.persistence.Event
import org.codehaus.groovy.grails.commons.DomainClassArtefactHandler


class ScaffoldingHelper {
	
	static getProps(def domainClass, def pluginManager, def comparator, def classLoader) {
		def excludedProps = Event.allEvents.toList() << 'version' << 'dateCreated' << 'lastUpdated'
		def persistentPropNames = domainClass.persistentProperties*.name
		boolean hasHibernate = pluginManager?.hasGrailsPlugin('hibernate') || pluginManager?.hasGrailsPlugin('hibernate4')
		if (hasHibernate) {
			def GrailsDomainBinder = classLoader.loadClass('org.codehaus.groovy.grails.orm.hibernate.cfg.GrailsDomainBinder')
			if (GrailsDomainBinder.newInstance().getMapping(domainClass)?.identity?.generator == 'assigned') {
				persistentPropNames << domainClass.identifier.name
			}
		}
		def props = domainClass.properties.findAll { persistentPropNames.contains(it.name) && !excludedProps.contains(it.name) && (domainClass.constrainedProperties[it.name] ? domainClass.constrainedProperties[it.name].display : true) }
		Collections.sort(props, comparator.constructors[0].newInstance([domainClass] as Object[]))
		return props
	}
}
