// The static/structural section of a model
// loginOptions and getUser function is passed while creating an instance of this model
// loginOptions attached to the model is used to configure the model dynamic behavior like validations
// errorsBag prop is automatically defined from the BaseModel superclass. It stores all error messages from validations.
var BaseModel = require('./basemodel');

module.exports = BaseModel.extend({
   url: '/api/user',

   initialize: function(opts) {
      this.loginOptions = opts.loginOptions;
      this.getUser = opts.getUser;
   },

   // names should match the input hooks to enable input-to-model binding
   props: {       
      userId:     ['string', false, ''],
      password:   ['string', false, ''],
      token:      ['any',    false, '']
   },

   session: {
      loginOptions: ['object', false, function(){return {}}]      // configurations and settings object
   },

   //This method is called automatically on change event from superclass and also manually for all props 
   validateProp: function(propName, newValue, oldValue) {
      var checksArray ;
      switch (propName) {
         case 'userId': { checksArray = this.loginOptions.userIdChecks(); break; }    // userIdChecks returns an array of validation functions
         case 'password': { checksArray = [this.loginOptions.validatePassword]; break; }  // validatePassword is the single validation function
      };

      if (checksArray) {
         this.executeChecks(propName, checksArray, newValue, oldValue );   // method defined in superclass
      }

      return false;
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

   // server only method  // assuming getUser will be set to a function in the calling script 
   fetchModel: function() {     
      var found = this.getUser(this.userId, this.password);  // Function injected while creating instance
      if (found) { this.token = found.token; } else { this.unset('token'); }
      return found ;
   },
});

