define([
    'jquery',
    'underscore',
    'backbone',
    'app/base'
], function($, _, Backbone, App) {

    App.Models.Notification = Backbone.Model.extend({
        url: function() {
            if (this.isNew()) {
                return '/notification/new';
            } else {
                return '/notification/' + this.get('id');
            }
        }
    });

    return App;
});
