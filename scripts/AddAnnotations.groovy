includeTargets << new File(extjsScaffoldingPluginDir, 'scripts/_ExtjsGenerate.groovy')

target (addAnnotations: "Generates the CRUD views for a specified domain class") {
	depends(checkVersion, parseArguments, packageApp)

	addAnnotations = true
	uberGenerate()
}

setDefaultTarget( addAnnotations )
