require([
    'jquery',
    'underscore',
    'app/view/notifications',
], function($, _, App) {
    var notifications = new App.Views.Notifications({
        el: '.container',
        updateFrequency: 60000
    });
});
