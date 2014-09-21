includeTargets << new File(extjsScaffoldingPluginDir, 'scripts/_GrailsGenerate.groovy')

target (createStatic: "Generates the static views for application") {
	depends(checkVersion, parseArguments, packageApp)

	generateApplication = true

	uberGenerate()
}

setDefaultTarget( createApplication )
