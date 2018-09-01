define([
    'jquery',
    'underscore',
    'backbone',
    'twig',
    'text!templates/app/notification/admin_notifications.html.twig',
    'text!templates/app/notification/admin_notification.html.twig',
    'app/collection/notifications',
    'app/view/notification-form',
], function($, _, Backbone, Twig, template, rowTemplate, App) {

    App.Views.AdminNotifications = Backbone.View.extend({
        template: Twig.twig({ data: template }),
        rowTemplate: Twig.twig({ data: rowTemplate }),

        initialize: function(options) {
            if (options.notifications) {
                this.notifications = options.notifications;
            } else {
                this.notifications = new App.Collections.Notifications({ mode: 'admin' });
                this.notifications.fetch();
            }

            this.render();
        },

        renderNotification: function(notification) {
            if (this.notifications.get(notification.get('id'))) {
                var $row = this.$('tr[data-id="' + notification.get('id') + '"]');
                $row.replaceWith($.trim(this.rowTemplate.render(notification.toJSON())));
            } else {
                this.notifications.add(notification);
                this.$('#notification-list').append($.trim(this.rowTemplate.render(notification.toJSON())));
            }
        },

        events: {
            'click #new-notification': 'renderNewNotification',
            'click .edit-notification': 'renderEditNotification'
        },

        render: function() {
            var self = this;
            this.$el.html($.trim(this.template.render()));

            this.notifications.each(function(notification) {
                self.$('#notification-list').append($.trim(self.rowTemplate.render(notification.toJSON())));
            });

            if (!this.notificationForm) {
                this.notificationForm = new App.Views.NotificationForm({
                    el: this.$('#notification-form')
                });
                this.listenTo(this.notificationForm, 'change', this.renderNotification);
            } else {
                this.notificationForm.setElement(this.$('#notification-form'));
                this.notificationForm.render();
            }
        },

        renderNewNotification: function(e) {
            this.notificationForm.render();

            $('html, body').animate({
                scrollTop: this.notificationForm.$el.offset().top + 'px'
            }, 'fast');
        },

        renderEditNotification: function(e) {
            var editId = $(e.currentTarget).data('id');
            var notification = this.notifications.get(editId);
            this.notificationForm.render(notification);

            $('html, body').animate({
                scrollTop: this.notificationForm.$el.offset().top + 'px'
            }, 'fast');
        }
    });

    return App;
});
