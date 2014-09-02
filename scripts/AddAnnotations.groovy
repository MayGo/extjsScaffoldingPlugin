includeTargets << new File(extjsScaffoldingPluginDir, 'scripts/_GrailsGenerate.groovy')

target (addAnnotations: "Generates the CRUD views for a specified domain class") {
	depends(checkVersion, parseArguments, packageApp)

	generateViews = false
	generateStores = false
	generateStatics = false
	generateModels = false
	addAnnotations = true

	String name = argsMap['params'][0]
	if (!name || name == '*') {
		uberGenerate()
	}
	else {
		generateForName = name
		generateForOne()
	}
}

setDefaultTarget( addAnnotations )
