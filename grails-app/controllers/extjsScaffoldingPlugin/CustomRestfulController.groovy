package extjsScaffoldingPlugin

import grails.rest.*
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
		
		//Check if domain class has searchQuery in namedQueries
		if(resource.metaClass.getStaticMetaMethod('getSearchQuery')){
			results = resource.searchQuery(params.query).list(params)
			totalResults = resource.searchQuery(params.query).count()
		}else{
			log.info "No searchQuery in namedQueries. Not seaching '${params.query}'."
			results = resource.list(params)
			totalResults = resource.count()
		}
		
		def listObject = [list: results, total: totalResults]
		respond listObject as Object
	}
}