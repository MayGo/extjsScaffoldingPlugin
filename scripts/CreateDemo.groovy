includeTargets << new File( extjsScaffoldingPluginDir,  'scripts/_ExtjsGenerate.groovy' )

target( createDemo:'Generate demo application (all artefacts)' ) {
  	depends(checkVersion, parseArguments, packageApp)

	generateDomain = true
  generateAssets = true
	generateApplication = true
	addAnnotations = false
	generateControllers = true

	uberGenerate()
}

setDefaultTarget( createDemo )