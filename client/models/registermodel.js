// The static/structural section of a model
// xxxOpts and getUser function is passed while creating an instance of this model
// xxxOpts attached to the model is used to configure the model dynamic behavior like validations
// errorsBag prop is automatically defined from the BaseModel superclass. It stores all error messages from validations.
var BaseModel = require('./basemodel');
var sync = require('ampersand-sync');

module.exports = BaseModel.extend({
   urlRoot: function() { 
      return ((typeof window == 'undefined')?'http://localhost:3000':'') + this.registerOpts.urlRoot; 
   },

   url: function(action) { 
      return this.urlRoot() + (action ? '/'+action : '') 
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
      registerOpts: ['object', false, function(){return {}}],      // configurations and settings object
      countryModel: ['object', false, function(){return {}}],
   },

   validation: {
      name: function(self){ return {syncCheck: [self.registerOpts.nameRequired]} },
      gender: function(self){ return {} },
      email: function(self){ return {syncCheck: [self.registerOpts.emailReqdCheck], asyncCheck: [self.registerOpts.emailUniqCheck]} },
   },

   validateModel: function() {
      BaseModel.prototype.validateModel.apply(this);
      if (typeof window == 'undefined') {      // server only block
         //this.updateErrorBag('model', 'auth', 'invalid user', !!this.token);
      }
   },

   isClientModelValid: function() {
      // ignoring server based errors as it is checked and set on the server in validateModel
      // Use this to bypass server errors as those will be handled on the server
      return this.isModelValid( function(propName, type){ return type != 'uniqeemail' } ) ;    
   },

   checkDupEmail: function(inputValue, callback) {
      var options = {
         url: this.url('checkemail'), 
         data: {email: inputValue}, 
         success: function(resp){ callback(resp); }, 
         error: function(resp, s, msg){ console.log(resp, s, msg); } 
      };
      sync('read', null, options);
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

