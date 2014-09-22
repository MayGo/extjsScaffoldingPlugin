includeTargets << new File(extjsScaffoldingPluginDir, 'scripts/_ExtjsGenerate.groovy')

target (createStatic: "Generates the static views for application") {
	depends(checkVersion, parseArguments, packageApp)

	generateApplication = true

	uberGenerate()
}

setDefaultTarget( createApplication )
