var PageView = require('./base');
var templates = require('../templates');
var _ = require('lodash');

module.exports = PageView.extend({
    pageTitle: 'login',

    template: templates.pages.login,

    initialize: function(opts) {
      //PageView.prototype.initialize.apply(this, opts);
      
      this.loginOptions = opts.loginOptions;		//extraProperty
    },

    session: {
       userId:     ['string', false, ''],
       password:   ['string', false, ''],
       rememberMe: ['boolean', false, false],
       errorsBag:  ['object', false, function(){return {}}]
    },

    derived: {
       passwordStrength: {
            deps: ['password'],
            fn: function () { return this.password && this.password.length ; },
            cache: false
       }
    },

    bindings: _.extend({}, PageView.prototype.bindings, {
       'userId':     [{type: 'value', hook: 'userId'}],
       'password':   [{type: 'value', hook: 'password'}],
       'rememberMe': [{type: 'booleanAttribute', name: 'checked', hook: 'rememberMe'}],
       'loginOptions.rememberMeEnabled': [{type: 'toggle', hook: 'remember-me-area'}], 
       'passwordStrength': [{type: 'text', hook: 'password-strength'}],
       'errorsBag.userId.errorText': [{type: 'text', hook: 'error-user-id'}],
       'errorsBag.password.errorText': [{type: 'text', hook: 'error-password'}]
    }),

    events: _.extend({}, PageView.prototype.events, {
       'click [data-hook=loginbutton]': 'handleLogin'
    }), 

    render: function() {
       this.renderWithTemplate(this);
/*
       this.cacheElements({
          elUserId: '[data-hook=userId]',
          elPassword: '[data-hook=password]',
          elRememberMe: '[data-hook=rememberMe]'
       });
*/
       return this;
    },

    handleLogin: function(e) {
       e.preventDefault();
       console.log('State u='+this.userId + ' p=' + this.password +' r='+this.rememberMe);
       if (this.rememberMe) 
          document.cookie = 'userid='+this.userId;
       else
          document.cookie = 'userid=;';
    },

   validateInput: function(propName, oldVal, newVal) {
      console.log('validate old='+oldVal + ' new='+newVal);

      switch (propName) {
         case 'userId': {
            this.updateErrorBag(propName, 'length', 'User Id should be 7 mininum', (newVal && newVal.length > 6));
            this.updateErrorBag(propName, 'required', 'User Id is required', (newVal && newVal.length > 0));
            break;
         }
         case 'password': {
            this.updateErrorBag(propName, 'length', 'password should be minimum 7', (newVal && newVal.length > 6));
            break;
         }
      }
      return false;
   },

});
