require([
    'jquery',
    'underscore',
    'app/view/notifications',
], function($, _, App) {
    console.log('notification');

    var notifications = new App.Views.Notifications({
        el: '.container'
    });
});
