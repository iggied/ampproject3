var app = require('ampersand-app');
var Router = require('ampersand-router');
var HomePage = require('./pages/home');
var loginOptions = require('./config/loginoptions');
var LoginPage = require('./pages/login');
var Person = require('./models/person');

module.exports = Router.extend({
    routes: {
        '': 'home',
        'login': 'login',
        '(*path)': 'catchAll'
    },

    // ------- ROUTE HANDLERS ---------
    home: function () {
        app.trigger('page', new HomePage({
            model: app.me
        }));
    },
    login: function () {
        var page = new LoginPage({
            loginOptions: loginOptions,
            model: new Person()
        });
        app.trigger('page', page);
    },
    catchAll: function () {
        this.redirectTo('');
    }
});
