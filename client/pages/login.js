// The binding and event handling methods of a view. Input model is injected while creating the view.
// Model props are bound to the input elements by their data-hook attribute. It has to match the model prop name for DOM-to-model binding to work.
// Model validations happen automatically on DOM change event. model-to-DOM binding works automatically from the binding hash. 
// loginOptions attached to the model is used to configure the view.
 
var PageView = require('./baseview');
var templates = require('../templates');
var _ = require('lodash');
var app = require('ampersand-app');

module.exports = PageView.extend({
    pageTitle: 'login',

    template: templates.pages.login,

    initialize: function(opts) {
      //PageView.prototype.initialize.apply(this, opts);
    },

    session: {
      rememberMe: ['boolean', false, false]
    },

    derived: {
       passwordStrength: {
            deps: ['model.password'],
            fn: function () { return this.model.loginOptions.getPasswordStrength(this.model.password); }
       },
       userIdMessages: {
            deps: ['model.errorsBag.userId'],
            fn: function() { return this.model.getErrMessagesArray('userId').join(', '); }
       },
       passwordMessages: {
            deps: ['model.errorsBag.password'],
            fn: function() { return this.model.getErrMessagesArray('password').join(', '); }
       },
       modelMessages: {
            deps: ['model.errorsBag.model'],
            fn: function() { return this.model.getErrMessagesArray('model').join(', '); }
       }
    },

    // model-to-DOM 1-way bindings
    bindings: _.extend({}, PageView.prototype.bindings, {
       'model.loginOptions.userIdLabel':       [{type: 'text',   hook: 'user-id-label'}],
       'model.loginOptions.passwordLabel':     [{type: 'text',   hook: 'password-label'}],
       'model.loginOptions.rememberMeLabel':   [{type: 'text',   hook: 'rememberme-label'}],
       'model.loginOptions.loginButtonLabel':  [{type: 'value',  hook: 'loginbutton'}],
       'model.loginOptions.rememberMeEnabled': [{type: 'toggle', hook: 'remember-me-area'}], 
       'model.userId':     [{type: 'value', hook: 'userId'}],
       'model.password':   [{type: 'value', hook: 'password'}],
       'rememberMe':       [{type: 'booleanAttribute', hook: 'rememberMe', name: 'checked'}],
       'passwordStrength': [{type: 'text', hook: 'password-strength'}],
       'userIdMessages':   [{type: 'text', hook: 'error-user-id'}],
       'passwordMessages': [{type: 'text', hook: 'error-password'}],
       'model.token':      [{type: 'text', hook: 'model-id'}],
       'modelMessages':    [{type: 'text', hook: 'error-model'}],
    }),

    events: _.extend({}, PageView.prototype.events, {
       'click [data-hook=loginbutton]': 'handleLogin'
    }), 

    render: function() {
       this.renderWithTemplate(this);
       return this;
    },

    handleLogin: function(e) {
       e.preventDefault();
       console.log('State u='+this.model.userId + ' p=' + this.model.password +' r='+this.rememberMe);
       this.model.login({
          success: function(model, response) {  
             if (model.token) { app.trigger('login', response); };
          }, 
          error: function() {
             console.log('backend error');
          }
       });
    },
    
});
