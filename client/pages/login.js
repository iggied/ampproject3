// The binding and event handling methods of a view. Input model is injected while creating the view.
// Model props are bound to the input elements by their data-hook attribute. It has to match the model prop name for DOM-to-model binding to work.
// Model validations happen automatically on DOM change event. model-to-DOM binding works automatically from the binding hash. 
// loginOptions attached to the model is used to configure the view.
 
var PageView = require('./baseview');
var templates = require('../templates');
var _ = require('lodash');

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
            fn: function () { return this.model.loginOptions.enforcePasswordStrength(this.model.password); }
       },
       userIdMessages: {
            deps: ['model.errorsBag.userId'],
            fn: function() { 
                   return this.model.errorsBag.userId && this.model.errorsBag.userId.map( function(i) {return i.message} ).join('; '); 
            }
       },
       passwordMessages: {
            deps: ['model.errorsBag.password'],
            fn: function() { 
                   return this.model.errorsBag.password && this.model.errorsBag.password.map( function(i) {return i.message} ).join('; '); 
            }
       },
       modelMessages: {
            deps: ['model.errorsBag.model'],
            fn: function() { 
                   return this.model.errorsBag.model && this.model.errorsBag.model.map( function(i) {return i.message} ).join('; '); 
            }
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
       'passwordStrength': [{type: 'text',  hook: 'password-strength'}],
       'userIdMessages':   [{type: 'text',  hook: 'error-user-id'}],
       'passwordMessages': [{type: 'text',  hook: 'error-password'}],
       'model.token':      [{type: 'text',  hook: 'model-id'}],
       'modelMessages':    [{type: 'text',  hook: 'error-model'}],
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

       this.model.validateModel();   // Validates all model props and updates errorsBag accordingly

       if (this.model.isClientModelValid()) {     // Ignore server error messages as server validations will be performed in save
          this.model.save();

          if (this.rememberMe) 
             document.cookie = 'rememberme='+this.model.userId;
          else
             document.cookie = 'rememberme=;';
       }
    }

});
