define([
    'jquery',
    'underscore',
    'backbone',
    'app/collection/notifications',
    'app/view/notification',
], function($, _, Backbone, App) {

    App.Views.Notifications = Backbone.View.extend({
        initialize: function(options) {
            this.notifications = new App.Collections.Notifications({
                mode: 'view'
            });
            this.notifications.fetch();

            this.render();
        },

        render: function() {
            this.notifications.each(function(notification) {
                console.log(notification);
            });
            // var notificationView = new App.Views.Notification({
            //  model: notification
            // });
            // notificationView.render();
            // loop through notifications and render
            //this.$el.html($.trim(this.template.render()));
        }
    });

    return App;
});
