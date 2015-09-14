// The static/structural section of a model
// xxxOpts and getUser function is passed while creating an instance of this model
// xxxOpts attached to the model is used to configure the model dynamic behavior like validations
// errorsBag prop is automatically defined from the BaseModel superclass. It stores all error messages from validations.
var BaseModel = require('./basemodel');
var sync = require('ampersand-sync');

module.exports = BaseModel.extend({
   urlRoot: function(){ return ((typeof window == 'undefined')?'http://localhost:3000':'') + this.registerOpts.urlRoot; },

   url: function(action){ return this.urlRoot() + (action ? '/'+action : '') }, 

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
      registerOpts: ['object', false, function(){return {}}],      // configurations and settings object
      countryModel: ['object', false, function(){return {}}],
   },

   //This method is called automatically on change event from superclass and also manually for all props 
   validateProp: function(propName, newValue, oldValue) {
      var checksArray ;
      var asyncChecksArray ;
      switch (propName) {
         case 'name':    { checksArray = [this.registerOpts.nameRequired]; break; }    
         case 'gender':  { checksArray = []; break; }  
         case 'email':   { checksArray = [this.registerOpts.emailReqdCheck];
                           asyncChecksArray = [this.registerOpts.emailUniqCheck]; 
                           break; 
                         } 
         case 'mobile':  { checksArray = []; break; }
         case 'country': { checksArray = []; break; } 
         case 'pin':     { checksArray = []; break; } 
      };

      if (checksArray) {
         this.executeChecks(propName, checksArray, newValue, oldValue );   // method defined in superclass
      }

      if (asyncChecksArray) {
         this.executeAsyncChecks(propName, asyncChecksArray, newValue, oldValue );   // method defined in superclass
      }
      return false;
   },

   validateModel: function(opts) {
      BaseModel.prototype.validateModel.apply(this, [opts]);
      if (typeof window == 'undefined') {      // server only block
         //this.updateErrorBag('model', 'auth', 'invalid user', !!this.token);
      }
   },

   isClientModelValid: function() {
      return this.isModelValid( function(propName, type){ return type != 'uniqeemail' } ) ;    // ignoring model errors as it is set only on server in validateModel
   },

   checkDupEmail: function(value, callback) {
      var options = {
         url: this.url('checkemail'), 
         data: {email: value}, 
         success: function(resp){ console.log('success', resp); callback(resp); }, 
         error: function(resp, s, msg){ console.log(resp, s, msg); } 
      };

      var rawRequest = sync('read', null, options);
   },

   validateCountry: function() {

   },

   register: function(opts) {
      this.validateModel();   // Validates all model props and updates errorsBag accordingly
      if (this.isClientModelValid()) {     // Ignore server error messages as server validations will be performed in save below
         if (!opts.url) { opts.url = this.url('register'); };
         this.save(null, opts);
      };
   },

   // server only method  // assuming getUser will be set to a function in the calling script 
   fetchModel: function() {     
/*      var found = this.getUser(this.userId, this.password);  // Function injected while creating instance
      if (found) { this.token = found.token; } else { this.unset('token'); }
      return found ;
*/
   },
});

