includeTargets << new File( extjsScaffoldingPluginDir,  'scripts/_ExtjsGenerate.groovy' )

target( createAll:'Generate all domain artifacts' ) {
  	depends(checkVersion, parseArguments, packageApp)
	  
    generateDomain = true
    generateAssets = true
    generateApplication = true

		uberGenerate()
}

setDefaultTarget( createAll )