define([
    'jquery',
    'underscore',
    'backbone',
    'app/model/notification'
], function($, _, Backbone, App) {

    App.Collections.Notifications = Backbone.Collection.extend({
        model: App.Models.Notification,

        url: function() {
            if (this.mode == 'admin') {
                return '/notification/all';
            } else {
                return '/notification';
            }
        },

        initialize: function(options) {
            this.mode = options.mode;
        }
    });

    return App;
});
