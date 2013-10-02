require.undef('can/util/library');

define('can/util/library', [], function () {

    var can = {};

    function likeArray(obj) {
        return typeof obj.length == 'number';
    }

    function flatten(array) {
        return array.length > 0 ? Array.prototype.concat.apply([], array) : array
    }

    // This extend() function is ruthlessly and shamelessly stolen from
    // jQuery 1.8.2:, lines 291-353.
    can.extend = function() {
        var options, name, src, copy, copyIsArray, clone,
            target = arguments[0] || {},
            i = 1,
            length = arguments.length,
            deep = false;

        // Handle a deep copy situation
        if ( typeof target === "boolean" ) {
            deep = target;
            target = arguments[1] || {};
            // skip the boolean and the target
            i = 2;
        }

        // Handle case when target is a string or something (possible in deep copy)
        if ( typeof target !== "object" && !can.isFunction(target) ) {
            target = {};
        }

        // extend jQuery itself if only one argument is passed
        if ( length === i ) {
            target = this;
            --i;
        }

        for ( ; i < length; i++ ) {
            // Only deal with non-null/undefined values
            if ( (options = arguments[ i ]) != null ) {
                // Extend the base object
                for ( name in options ) {
                    src = target[ name ];
                    copy = options[ name ];

                    // Prevent never-ending loop
                    if ( target === copy ) {
                        continue;
                    }

                    // Recurse if we're merging plain objects or arrays
                    if ( deep && copy && ( can.isPlainObject(copy) || (copyIsArray = can.isArray(copy)) ) ) {
                        if ( copyIsArray ) {
                            copyIsArray = false;
                            clone = src && can.isArray(src) ? src : [];

                        } else {
                            clone = src && can.isPlainObject(src) ? src : {};
                        }

                        // Never move original objects, clone them
                        target[ name ] = can.extend( deep, clone, copy );

                        // Don't bring in undefined values
                    } else if ( copy !== undefined ) {
                        target[ name ] = copy;
                    }
                }
            }
        }

        // Return the modified object
        return target;
    };

    can.isFunction = (typeof document !== 'undefined' && typeof document.getElementsByTagName('body') === 'function')
        ? function (value) {
        return Object.prototype.toString.call(value) === '[object Function]';
    }
        : function (value) {
        return typeof value === 'function';
    };

    can.map = function(elements, callback) {
        var value, values = [],
            i, key;
        if (likeArray(elements)) for (i = 0; i < elements.length; i++) {
            value = callback(elements[i], i);
            if (value != null) values.push(value)
        } else for (key in elements) {
            value = callback(elements[key], key);
            if (value != null) values.push(value)
        }
        return flatten(values);
    };

    return can;
});


define(['text'], function (text, can) {

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
            if (config.inlineEJS !== false) {
                var url = req.toUrl(name + '.' + extension);
                text.get(url, function (template) {
                    injectIncludes(req, template, function (processedTemplate) {
                        var id = can.view.toId(url);
                        var tpl = new can.EJS({
                            text: processedTemplate
                        });
                        buildMap[name] = {
                            id: id,
                            text: tpl.template.out
                        };
                        load();
                    }, ejs);
                });
            } else {
                load();
            }
        },

        write: function (pluginName, moduleName, write) {
            if (buildMap.hasOwnProperty(moduleName)) {
                var content = buildMap[moduleName];
                write('define("' + pluginName + '!' + moduleName + '", ["can/view/ejs"], function (can) {' +
                    'var renderer = can.EJS(function(_CONTEXT,_VIEW) {' + content.text + '});' +
                    'renderer.id = "' + content.id +  '";' +
                    'can.view.preload(renderer.id, renderer);' +
                    'return renderer;' +
                '});\n');
            }
        }

    };

    return ejs;

});
