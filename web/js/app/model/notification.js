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
        },

        isValid: function () {
            var from = new Date(this.get('validFrom'));
            var to = new Date(this.get('validTo'));
            var now = new Date();
            
            return now >= from && now <= to;
        }
    });

    return App;
});
