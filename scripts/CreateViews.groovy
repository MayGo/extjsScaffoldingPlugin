includeTargets << new File(extjsScaffoldingPluginDir, 'scripts/_GrailsGenerate.groovy')

target (createViews: "Generates the CRUD views for a specified domain class") {
	depends(checkVersion, parseArguments, packageApp)

	promptForName(type: "Domain Class")

	generateController = false

	String name = argsMap['params'][0]
	if (!name || name == '*') {
		uberGenerate()
	}
	else {
		generateForName = name
		generateForOne()
	}
}

setDefaultTarget( createViews )
