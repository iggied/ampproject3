var app = require('ampersand-app');
var Router = require('ampersand-router');
var HomePage = require('./pages/home');
var loginOptions = require('./config/loginoptions');
var LoginPage = require('./pages/login');
var LoginModel = require('./models/loginmodel');
var registerOpts = require('./config/registeropts');
var RegisterPage = require('./pages/registerpage');
var RegisterModel = require('./models/registermodel');

module.exports = Router.extend({
    routes: {
        '': 'home',
        'login': 'login',
        'register': 'register',
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
                      model: new LoginModel( {loginOptions: loginOptions} )
        });
        app.trigger('page', page);
    },
    register: function () {
        var page = new RegisterPage({
                      model: new RegisterModel( {registerOpts: registerOpts} )
        });
        app.trigger('page', page);
    },
    catchAll: function () {
        this.redirectTo('');
    }
});
