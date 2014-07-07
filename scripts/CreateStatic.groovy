includeTargets << new File(extjsScaffoldingPluginDir, 'scripts/_GrailsGenerate.groovy')

target (createStatic: "Generates the static views for a specified domain class") {
	depends(checkVersion, parseArguments, packageApp)

	promptForName(type: "Domain Class")

	generateViews = false
	generateStores = false
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

setDefaultTarget( createStatic )
