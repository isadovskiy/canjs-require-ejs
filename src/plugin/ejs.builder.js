require.config({
    map: {
        '*': {
            'can/util/library': 'can/util/optimize'
        }
    }
});

define(['text', './ejs.includes', 'can/view/ejs'], function (text, injectIncludes, can) {

    var ejs,
        extension,
        buildMap;

    // The template extension
    extension = 'ejs';

    // Holds the raw templates, keyed by relative path.
    buildMap = {};

    ejs = {

        load: function (name, req, load, config) {
            if (config.inlineEJS !== false) {
                var url = req.toUrl(name + '.' + extension);
                text.get(url, function (template) {
                    injectIncludes(template, extension, function (processedTemplate) {
                        var id = can.view.toId(url);
                        var tpl = new can.EJS({
                            text: processedTemplate
                        });
                        buildMap[name] = {
                            id: id,
                            text: tpl.template.out
                        };
                        load();
                    });
                });
            } else {
                load();
            }
        },

        write: function (pluginName, moduleName, write) {
            if (buildMap.hasOwnProperty(moduleName)) {
                var content = buildMap[moduleName];
                write.asModule(pluginName + '!' + moduleName, 'define(["can/view/ejs"], function (can) {' +
                    'var renderer = can.EJS(function(_CONTEXT,_VIEW) {' + content.text + '});' +
                    'var frag = can.view.preload("' + content.id +  '", renderer);' +
                    'frag.id = "' + content.id +  '";' +
                    'return frag;' +
                '});\n');
            }
        }

    };

    return ejs;

});
