define(['jquery', './control/Main'], function ($, MainControl) {

    return function (el) {

        $(function () {
            var mainControl = MainControl(el);
        });

    };

});