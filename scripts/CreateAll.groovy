includeTargets << new File( extjsScaffoldingPluginDir,  'scripts/_GrailsGenerate.groovy' )

target( createAll:'Generate all domain artifacts' ) {
  	depends(checkVersion, parseArguments, packageApp)

	promptForName(type: "Domain Class")

	String name = argsMap['params'][0]
	if (!name || name == '*') {
		uberGenerate()
	}
	else {
		generateForName = name
		generateForOne()
	}

}

setDefaultTarget( createAll )