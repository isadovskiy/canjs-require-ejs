// this routine is a part of the https://github.com/whitcomb/requirejs-ejs
define(['require', 'text'], function (req, text) {

    var includeRegex = new RegExp(/\<\%\sinclude\s(\S+)\s\%\>/g);

    // Loops over every include statment and replaces
    // the include with the template.
    function injectIncludes(template, extension, callback, scope) {

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
                    callback.call(scope, template);
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
            callback.call(scope, template);
        }

    }

    return injectIncludes;
});