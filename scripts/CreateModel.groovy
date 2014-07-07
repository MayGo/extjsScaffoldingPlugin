includeTargets << new File(extjsScaffoldingPluginDir, 'scripts/_GrailsGenerate.groovy')

target (createModel: "Generates the model for a specified domain class") {
	depends(checkVersion, parseArguments, packageApp)

	promptForName(type: "Domain Class")

	generateViews = false
	generateStores = false
	generateStatics = false

	String name = argsMap['params'][0]
	if (!name || name == '*') {
		uberGenerate()
	}
	else {
		generateForName = name
		generateForOne()
	}
}

setDefaultTarget( createModel )
