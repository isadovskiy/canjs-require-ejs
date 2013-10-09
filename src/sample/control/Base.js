define(['can/control', 'can/view', 'can/construct/proxy', 'can/construct/super'], function (Control, can) {
    return Control.extend({
        constructorExtends: false
    },{
        init: function (element, options) {
            //
        },

        view: function (view, data, helpers, callback) {
            return can.view(view, data, helpers, callback);
        },

        live: function (template) {
            return can.view.frag(template);
        }
    });
});