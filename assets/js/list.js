require([
    'jquery',
    'underscore',
    'app/view/admin-notifications',
    'app/collection/notifications',
], function($, _, App) {

    // initialize notification collection from bootstrap
    var notifications = new App.Collections.Notifications({ mode: 'admin' });
    notifications.reset(window.notifications);

    var notificationsView = new App.Views.AdminNotifications({
        el: '.container',
        notifications: notifications
    });
});
