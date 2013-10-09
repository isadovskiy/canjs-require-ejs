requirejs({
    baseUrl: '..',
    paths: {
        'jquery': '../lib/jquery-1.10.1/jquery.min',
        'can': '../lib/canjs-1.1.8',
        'text': '../lib/require-text-2.0.10/text'
    },
    map: {
        '*': {
            'ejs': 'plugin/ejs'
        }
    },
    shim: {
        'jquery': {
            exports: 'jQuery'
        }
    }
});
