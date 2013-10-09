define(['text', './ejs.includes', 'can/view/ejs'], function (text, injectIncludes, can) {

    var ejs,
        extension;

    // The template extension
    extension = 'ejs';

    ejs = {

        version: '0.2.0',

        pluginBuilder: './ejs.builder',

        load: function (name, req, load, config) {
            var url = req.toUrl(name + '.' + extension);
            var id = can.view.toId(url);
            text.get(url, function (template) {
                injectIncludes(template, extension, function (processedTemplate) {
                    var renderer = can.view.ejs(id, processedTemplate);
                    renderer.id = id;
                    load(renderer);
                }, ejs);
            });
        }

    };

    return ejs;

});
