define(['./Base', 'ejs!../view/main', 'can/observe'], function (BaseControl, renderer, Observe) {

    return BaseControl.extend({
        init: function (element, options) {
            this._super(element, options);

            var model = new Observe({
                now: new Date()
            });

            // update that property every second
            setInterval(function(){
                model.attr('now', new Date() );
            },1000);

            this.element.html(this.live(renderer({model:model})));

        }
    });
});