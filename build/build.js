({
    appDir: '../src',
    dir: '../www',
    mainConfigFile: '../src/sample/config.js',
    baseUrl: '.',
    paths: {
        'can/util/optimize': 'plugin/ejs.library'
    },
    modules: [
        {
            name: 'sample/app',
            exclude: [
                'jquery'
            ],
            excludeShallow: [
                'can/util/optimize'
            ]
        }
    ],
    findNestedDependencies: false,
    optimize: 'none',
    skipDirOptimize: true,
    generateSourceMaps: false,
	removeCombined: false,
    preserveLicenseComments: false,
    pragmasOnSave: {
        //optimizeEJS: true
    }
})
