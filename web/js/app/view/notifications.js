define([
    'jquery',
    'underscore',
    'backbone',
    'app/collection/notifications',
    'app/view/notification',
], function($, _, Backbone, App) {

    App.Views.Notifications = Backbone.View.extend({
        polling: false,
        timeout: null,
        updateFrequency: 60000,
        lastModel: null,
        views: {},

        events: {
            'click .notification-close': 'closeNotification'
        },

        initialize: function(options) {
            var self = this;

            if (options.updateFrequency) {
                self.updateFrequency = options.updateFrequency;
            }

            this.notifications = new App.Collections.Notifications(null, {
                mode: 'view'
            });

            this.render();
            this.listenTo(this.notifications, 'sync', this.addNotifications);;
            this.notifications.fetch().then(function () {
                self.startPolling(self.updateFrequency);
            });
        },

        addNotifications: function (collection) {
            if (collection.length === 0) {
                return;
            }

            var self = this;
            this.lastModel = collection.last();

            collection.each(function (model) {
                if (!model.isValid()) {
                    return false;
                }

                var view = new App.Views.Notification({
                    model: model
                });

                self.views[model.cid] = view;

                view.render();
                self.$el.prepend(view.$el);
            });
        },

        closeNotification: function (event) {
            var $notification = $(event.currentTarget).closest('.notification-container');
            
            if ($notification.length > 0 && $notification.data('cid')) {
                var cid = $notification.data('cid');
                var view = this.views[cid];

                this.notifications.remove(cid);
                
                if (view) {
                    view.$el.fadeOut(300, view.remove);
                }
            }
        },

        startPolling: function(ms) {
            this.polling = true;
            ms = ms || 12000;

            this._executePolling(ms);
        },

        stopPolling: function () {
            this.polling = false;
            if (this.timeout) {
                clearTimeout(this.timeout);
                this.timeout = null;
            }
        },

        _executePolling: function (ms) {
            var self = this;
            var params = {};

            if (this.lastModel) {
                params.data = {
                    after: this.lastModel.id
                }
            }

            this.timeout = setTimeout(function () {
                self.notifications.fetch(params).then(function () {
                    self._executePolling(ms).bind(self);
                });
            }, ms);
        }
    });

    return App;
});
