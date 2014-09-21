includeTargets << new File( extjsScaffoldingPluginDir,  'scripts/_GrailsGenerate.groovy' )

target( createDemo:'Generate demo application (all artefacts)' ) {
  	depends(checkVersion, parseArguments, packageApp)

	generateDomain = true
    generateAssets = true
	generateApplication = true
	addAnnotations = true
	promptForName(type: "Domain Class")

	uberGenerate()
}

setDefaultTarget( createDemo )