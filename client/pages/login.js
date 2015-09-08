var PageView = require('./base');
var templates = require('../templates');
var _ = require('lodash');
// Input model is passed while creating the view

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
            fn: function() { return this.model.errorsBag.userId && this.model.errorsBag.userId.map( function(i) {return i.message} ).join('; '); },
       },
       passwordMessages: {
            deps: ['model.errorsBag.password'],
            fn: function() { return this.model.errorsBag.password && this.model.errorsBag.password.map( function(i) {return i.message} ).join('; '); },
       }
    },

    bindings: _.extend({}, PageView.prototype.bindings, {
       'model.userId':                         [{type: 'value',            hook: 'userId'}],
       'model.password':                       [{type: 'value',            hook: 'password'}],
       'model.rememberMe':                     [{type: 'booleanAttribute', hook: 'rememberMe', name: 'checked'}],
       'model.loginOptions.rememberMeEnabled': [{type: 'toggle',           hook: 'remember-me-area'}], 
       'passwordStrength':                     [{type: 'text',             hook: 'password-strength'}],
       'userIdMessages':                       [{type: 'text',             hook: 'error-user-id'}],
       'passwordMessages':                     [{type: 'text',             hook: 'error-password'}],
       'model.token':                          [{type: 'text',             hook: 'model-id'}]
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
       console.log('State u='+this.model.userId + ' p=' + this.model.password +' r='+this.model.rememberMe);

       this.model.validateModel();
       this.model.save();

       if (this.model.rememberMe) 
          document.cookie = 'userid='+this.model.userId;
       else
          document.cookie = 'userid=;';
    }

});
