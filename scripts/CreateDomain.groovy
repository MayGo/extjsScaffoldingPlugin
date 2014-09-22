includeTargets << new File(extjsScaffoldingPluginDir, 'scripts/_ExtjsGenerate.groovy')

target (createModel: "Generates the model for a specified domain class") {
	depends(checkVersion, parseArguments, packageApp)

	promptForName(type: "Domain Class")

	generateDomain = true

	uberGenerate()
}

setDefaultTarget( createDomain )
