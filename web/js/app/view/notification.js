define([
    'jquery',
    'underscore',
    'backbone',
    'twig',
    'text!templates/app/notification/notification.html.twig',
    'app/base'
], function($, _, Backbone, Twig, template, App) {

    App.Views.Notification = Backbone.View.extend({
        template: Twig.twig({ data: template }),

        attributes: function () {
            var attrs = {};

            attrs['class'] = 'notification-container';
            attrs['data-cid'] = this.model.cid;

            return attrs;
        },

        initialize: function() {
            this.render();
        },

        render: function() {
            var data = this.model.toJSON();
            this.$el.html($.trim(this.template.render(data)));
        }
    });

    return App;
});
