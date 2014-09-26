package grails.plugin.extjsscaffolding

import groovy.json.*
import org.codehaus.groovy.grails.commons.DefaultGrailsDomainClass


class ExtjsScaffoldingService{
	
	static Map parseParamsAndRetrieveListAndCount(def resource, Map param){

		//Collect sort param from extjs 'sort' json string
		List sortList = []
		if(param.sort) {
			def json = new JsonSlurper().parseText(param.sort)
			param.sort=""
			json.each{
				sortList.add([json[0].property, json[0].direction.toLowerCase()])
			}
		}
		
		//Search relation queries e.g: user.id=1
		Map relations = param.findAll{k, v->
			k.endsWith('.id')
		}

		def searchString = param.query
		
		
		def persistentProperties = new DefaultGrailsDomainClass(resource).persistentProperties
		
		def persistentPropertiesMap = [:] as HashMap
		persistentProperties.each { 
			persistentPropertiesMap.put(it.name, it)
		}
		def	results = resource.createCriteria().list(offset:param.offset, max:param.max) {
			
			//make relation query
			relations.each{k, v->
				eq(k, v.toLong())
			}
			
			//Search params values from properties
			param.each{key, value->
				def property = persistentPropertiesMap[key]
				if(property && value) {
					if (property.type == String) {
						ilike ("$property.name",  value+'%')
					} else if(property.type == Integer){
						eq("$property.name", value.toInteger())
					} else if(property.type == Long){
						eq("$property.name", value.toLong())
					} else if(property.type == Double){
						eq("$property.name", value.toDouble())
					} else if( property.type == Float){
						eq("$property.name", value.toFloat())
					}  else if( property.manyToOne || property.oneToOne){
						eq("${property.name}.id", value.toLong())
					}
				}
			}
			//Search from all String and Numeric fields
			if(searchString) {
				List intNumbers = searchString.findAll( /\d+/ )
				List floatNumbers = searchString.findAll(  /-?\d+\.\d*|-?\d*\.\d+|-?\d+/ )
				or{
					persistentProperties.each {property->
						if (property.type == String) {
							ilike ("$property.name",  searchString+'%')
						} else if(property.type == Integer){
							intNumbers*.toInteger().each{
								eq("$property.name", it)
							}
						} else if(property.type == Long){
							intNumbers*.toLong().each{
								eq("$property.name", it)
							}

						} else if(property.type == Double){
							floatNumbers*.toDouble().each{
								eq("$property.name", it)
							}

						} else if( property.type == Float){
							floatNumbers*.toFloat().each{
								eq("$property.name", it)
							}

						}  else if( property.manyToOne || property.oneToOne){
							intNumbers*.toLong().each{
								eq("${property.name}.id", it)
							}
						}
						intNumbers*.toLong().each{ eq("id", it) }
					}
				}
			}
			sortList.each{
				order it[0], it[1]
			}
		}
		
		return [list: results, total: results.totalCount]
	}
}
