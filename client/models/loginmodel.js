// The static/structural section of a model
// loginOptions and getUser function is passed while creating an instance of this model
// loginOptions attached to the model is used to configure the model dynamic behavior like validations
// errorsBag prop is automatically defined from the BaseModel superclass. It stores all error messages from validations.
var BaseModel = require('./basemodel');
var _ = require('lodash');

module.exports = BaseModel.extend({
   urlRoot: function() { 
      return ((typeof window == 'undefined')?'http://localhost:3000':'') + this.loginOptions.urlRoot; 
   },

   url: function(action) { 
      return this.urlRoot() + (action ? '/'+action : '') 
   }, 

   // names should match the input hooks to enable input-to-model binding
   props: {       
      userId:     ['string', false, ''],
      password:   ['string', false, ''],
      token:      ['any',    false, '']
   },

   session: {
      loginOptions: ['object', false, function(){return {}}],      // configurations and settings object
   },

   validation: {
      userId: function() { return {syncCheck: this.loginOptions.userIdChecks()}; },
      password: function() { return {syncCheck: [this.loginOptions.validatePassword]}; },   
   },

   validateModel: function() {
      BaseModel.prototype.validateModel.apply(this);
      if (typeof window == 'undefined') {      // server only block
         this.updateErrorBag('model', 'auth', 'invalid user', !!this.token);
      }
   },

   isClientModelValid: function() {
      return this.isModelValid( function(propName){ return propName !== 'model' } ) ;    // ignoring model errors as it is set only on server in validateModel
   },

   login: function(opts) {
      this.validateModel();   // Validates all model props and updates errorsBag accordingly
      if (this.isClientModelValid()) {     // Ignore server error messages as server validations will be performed in save below
         if (!opts.url) { 
            opts.url = this.url('login'); };
         this.save(null, opts);
      };
   },

   // server only method  
   fetchUser: function(users) {     
      var found = _.findWhere(users, {userId: this.userId, password: this.password});
      if (found) { this.set(found); } else { this.unset('token'); }
      this.validateModel();  
      return found ;
   },

});

