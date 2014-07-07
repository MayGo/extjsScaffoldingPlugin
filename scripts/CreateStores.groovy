includeTargets << new File(extjsScaffoldingPluginDir, 'scripts/_GrailsGenerate.groovy')

target (createStores: "Generates the Store class for a specified domain class") {
	depends(checkVersion, parseArguments, packageApp)

	promptForName(type: "Domain Class")

	generateViews = false
	generateStatics = false
	generateModels = false

	String name = argsMap['params'][0]
	if (!name || name == '*') {
		uberGenerate()
	}
	else {
		generateForName = name
		generateForOne()
	}
}

setDefaultTarget( createStores )
