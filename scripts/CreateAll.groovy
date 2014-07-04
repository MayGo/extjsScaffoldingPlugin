includeTargets << new File( extjsScaffoldingPluginDir,  'scripts/CreateViews.groovy' )
target( createAll:'Generate all domain artifacts' ) {
    depends( checkVersion, configureProxy, packageApp, loadApp, configureApp, createViews )
    def msg = "Finished generation of domain artifacts"
    event( 'StatusFinal', [ msg ] )

}

setDefaultTarget( createAll )