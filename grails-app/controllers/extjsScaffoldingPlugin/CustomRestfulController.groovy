package extjsScaffoldingPlugin

import sun.org.mozilla.javascript.internal.json.JsonParser;
import grails.rest.*
import groovy.json.*
import org.codehaus.groovy.grails.commons.DefaultGrailsDomainClass

class CustomRestfulController<T> extends RestfulController<T> {
	CustomRestfulController(Class<T> domainClass) {
		this(domainClass, false)
	}
	CustomRestfulController(Class<T> domainClass, boolean readOnly) {
		super(domainClass, readOnly)
	}

	def index(Integer max) {
		params.max = Math.min(max ?: 10, 100)

		def results
		def totalResults

		//Collect sort params from extjs 'sort' json string
		List sortList = []
		if(params.sort) {
			def json = new JsonSlurper().parseText(params.sort)
			params.sort=""
			json.each{
				sortList.add([json[0].property, json[0].direction.toLowerCase()])
			}
		}
		
		//Search relation queries e.g: user.id=1
		Map relations = params.findAll{k, v->
			k.endsWith('.id')
		}

		def searchString = params.query
		//Check if domain class has searchQuery in namedQueries else do a dynamic search (not suitable for production)
		if(resource.metaClass.getStaticMetaMethod('getSearchQuery')){
			//TODO: add relation query
			results = resource.searchQuery(searchString, sortList).list(offset:params.offset, max:params.max)
			totalResults = resource.searchQuery(searchString, sortList).count()
		}else{
			results = resource.createCriteria().list(offset:params.offset, max:params.max) {
				
				//make relation query
				relations.each{k, v->
					eq(k, v.toLong())
				}
				//Search from all String and Numeric fields
				if(searchString) {
					List intNumbers = searchString.findAll( /\d+/ )
					List floatNumbers = searchString.findAll(  /-?\d+\.\d*|-?\d*\.\d+|-?\d+/ )
					or{
						new DefaultGrailsDomainClass(resource).persistentProperties.each {property->
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

							} 
							intNumbers*.toLong().each{ eq("id", it) }
						}
					}
				}
				sortList.each{
					order it[0], it[1]
				}
			}
			totalResults= results.totalCount
		}


		def listObject = [list: results, total: totalResults]
		respond listObject as Object
	}
}