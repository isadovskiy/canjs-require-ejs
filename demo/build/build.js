({
    appDir: '../src',
    dir: '../www',
    mainConfigFile: '../src/sample/config.js',
    baseUrl: '.',
    paths: {
        'can/util/library': '../../src/ejs.library'
    },
    modules: [
        {
            name: 'sample/app',
            exclude: [
                'jquery'
            ],
            include: [
                'can/util/jquery'
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
        optimizeEJS: true
    }
})
