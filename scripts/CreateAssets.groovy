includeTargets << new File(extjsScaffoldingPluginDir, 'scripts/_ExtjsGenerate.groovy')

target (createStatic: "Generates the assets for application") {
	depends(checkVersion, parseArguments, packageApp)

	generateAssets = true

	uberGenerate()
}

setDefaultTarget( createStatic )
