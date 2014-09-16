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
		def props = domainClass.properties.findAll {
			persistentPropNames.contains(it.name) && !excludedProps.contains(it.name) && (domainClass.constrainedProperties[it.name] ? domainClass.constrainedProperties[it.name].display : true)
		}
		//sorting. id is first, then simple fields by name, then assaciations by type and then by name
		props.sort{a, b ->
			if (a.equals(domainClass.getIdentifier())) {
				return -1;
			}
			if (b.equals(domainClass.getIdentifier())) {
				return 1;
			}

			if(getAssociationType(a).equals(getAssociationType(b))) {
				return a.getName().compareTo(b.getName());
			}else {
				return getAssociationType(a).compareTo(getAssociationType(b))
			}
		}
		return props
	}

	static private String getAssociationType(def property) {
		String assType = "";
		if(property.isManyToMany()) {
			assType = "4";
		} else if(property.isOneToMany()) {
			assType = "1";
		} else if(property.isOneToOne()) {
			assType = "2";
		} else if(property.isManyToOne()) {
			assType = "3";
		} else if(property.isEmbedded()) {
			assType = "0";
		}
		return assType
	}
}
