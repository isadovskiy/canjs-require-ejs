define(['text', 'can/view/ejs'], function (text, can) {

    var ejs,
        extension,
        includeRegex,
        buildMap;

    // The template extension
    extension = 'ejs';

    // Matches the include statements (i.e. '<% include path/to/file %>').
    includeRegex = new RegExp(/\<\%\sinclude\s(\S+)\s\%\>/g);

    // Holds the raw templates, keyed by relative path.
    buildMap = {};

    // injectIncludes routine is a part of the https://github.com/whitcomb/requirejs-ejs

    // Loops over every include statment and replaces
    // the include with the template.
    // TODO: Add error handling for incorrect paths or missing templates.
    function injectIncludes(req, template, callback, self) {

        var matches,
            match,
            index;

        index = 0;
        matches = [];

        // Fetches and replaces for each match.
        function fetchAndReplace(index) {
            var url;
            url = req.toUrl(matches[index][1] + '.' + extension);
            text.get(url, function (includeTemplate) {
                template = template.replace(matches[index][0], includeTemplate);
                index++;
                if (index === matches.length) {
                    callback.call(self, template);
                } else {
                    fetchAndReplace(index);
                }
            });
        }

        // Gather Matches
        while (match = includeRegex.exec(template)) {
            matches.push(match);
        }

        // Fetch additional includes or call callback
        if (matches.length) {
            fetchAndReplace(index);
        } else {
            callback.call(self, template);
        }

    }

    ejs = {

        version: '0.1.0',

        load: function (name, req, load, config) {
            var url = req.toUrl(name + '.' + extension);
            var id = can.view.toId(url);
            text.get(url, function (template) {
                injectIncludes(req, template, function (processedTemplate) {
                    if (config.isBuild) {
                        if (config.inlineEJS !== false) {
                            buildMap[name] = processedTemplate;
                        }
                        load();
                    } else {
                        var renderer = can.view.ejs(id, processedTemplate);
                        renderer.id = id;
                        load(renderer);
                    }
                }, ejs);
            });
        },

        write: function (pluginName, moduleName, write) {
            if (buildMap.hasOwnProperty(moduleName)) {
                var content = buildMap[moduleName],
                    id = can.view.toId(moduleName + '.' + pluginName);
                var tpl = new can.EJS({
                    text: content
                });
                write('define("' + pluginName + '!' + moduleName + '", ["can/view/ejs"], function (can) {' +
                    'var renderer = can.EJS(function(_CONTEXT,_VIEW) {' + tpl.template.out + '});' +
                    'renderer.id = "' + id +  '";' +
                    'can.view.preload(renderer.id, renderer);' +
                    'return renderer;' +
                '});\n');
            }
        }

    };

    return ejs;

});
