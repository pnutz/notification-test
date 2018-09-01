define([
    'jquery',
    'underscore',
    'backbone',
    'twig',
    'text!templates/app/notification/notification_form.html.twig',
    'app/model/notification'
], function($, _, Backbone, Twig, template, App) {

    App.Views.NotificationForm = Backbone.View.extend({
        template: Twig.twig({ data: template }),
        defaults: {
            title: '',
            message: '',
            validFrom: '',
            validTo: '',
            active: true
        },

        events: {
            'click #save-notification': 'saveNotification'
        },

        initialize: function(options) {
            this.render();
            this.$el.hide();
        },

        render: function(notification) {
            this.$el.show();

            if (notification) {
                this.model = notification;
            } else {
                this.model = new App.Models.Notification(this.defaults);
            }

            var data = this.model.toJSON();
            this.$el.html($.trim(this.template.render(data)));
        },

        saveNotification: function(e) {
            var self = this;

            this.model.set('active', false, { silent: true });

            var formData = this.$('form').serializeArray();
            _.each(formData, function(attributeData) {
                if (attributeData.name == 'active') {
                    attributeData.value = true;
                }
                self.model.set(attributeData.name, attributeData.value, { silent: true });
            });

            this.model.save({}, {
                success: function() {
                    self.trigger('change', self.model);
                }
            });

            this.$el.slideUp();
            e.preventDefault();
            return false;
        }
    });

    return App;
});
