// The static/structural section of a model
// xxxOpts and getUser function is passed while creating an instance of this model
// xxxOpts attached to the model is used to configure the model dynamic behavior like validations
// errorsBag prop is automatically defined from the BaseModel superclass. It stores all error messages from validations.
var BaseModel = require('./basemodel');

module.exports = BaseModel.extend({
   url: '/api/register',

   initialize: function(opts) {
      this.registerOpts = opts.registerOpts;
      //this.getUser = opts.getUser;
   },

   idAttribute: 'id',

   // names should match the input hooks to enable input-to-model binding
   props: {       
      id:     ['string', false, ''],
      name:   ['string', false, ''],
      gender: ['string', false, ''],
      email:  ['string', false, ''],
      mobile: ['string', false, ''],
      country:['string', false, ''],
      pin:    ['string', false, '']
   },

   session: {
      registerOpts: ['object', false, function(){return {}}]      // configurations and settings object
   },

   //This method is called automatically on change event from superclass and also manually for all props 
   validateProp: function(propName, newValue, oldValue) {
      var checksArray ;
      switch (propName) {
         case 'name':    { checksArray = [this.registerOpts.nameRequired]; break; }    
         case 'gender':  { checksArray = []; break; }  
         case 'email':   { checksArray = []; break; } 
         case 'mobile':  { checksArray = []; break; }
         case 'country': { checksArray = []; break; } 
         case 'pin':     { checksArray = []; break; } 
      };

      if (checksArray) {
         this.executeChecks(propName, checksArray, newValue, oldValue );   // method defined in superclass
      }
      return false;
   },

   validateModel: function() {
      BaseModel.prototype.validateModel.apply(this);
      if (typeof window == 'undefined') {      // server only block
         //this.updateErrorBag('model', 'auth', 'invalid user', !!this.token);
      }
   },

   // server only method  // assuming getUser will be set to a function in the calling script 
   fetchModel: function() {     
/*      var found = this.getUser(this.userId, this.password);  // Function injected while creating instance
      if (found) { this.token = found.token; } else { this.unset('token'); }
      return found ;
*/
   },
});

