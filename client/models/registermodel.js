// The static/structural section of a model
// xxxOpts and getUser function is passed while creating an instance of this model
// xxxOpts attached to the model is used to configure the model dynamic behavior like validations
// errorsBag prop is automatically defined from the BaseModel superclass. It stores all error messages from validations.
var Collection = require('ampersand-collection');
var sync = require('ampersand-sync');
var BaseModel = require('./basemodel');

var Address = BaseModel.extend({     // This can only be used as a model within a collection, since it uses the config object from the collection parent
   props: {
      type:    ['string', false, ''],
      line1:   ['string', false, ''],
      line2:   ['string', false, ''],
      city:    ['string', false, ''],
      pin:     ['string', false, ''],
      state:   ['string', false, ''],
      country: ['string', false, ''],
   },

   validation: {
      line1: function(){ return {syncCheck: [this.collection.parent.registerOpts.line1Required]}; },
      city: function(){ return {}; },
   },
});

module.exports = BaseModel.extend({
   urlRoot: function() { 
      return ((typeof window == 'undefined')?'http://localhost:3000':'') + this.registerOpts.urlRoot; 
   },

   url: function(action) { 
      return this.urlRoot() + (action ? '/'+action : '') 
   }, 

   // names should match the input hooks to enable input-to-model binding
   props: {       
      id:     ['string', false, ''],
      name:   ['string', false, ''],
      gender: ['string', false, ''],
      email:  ['string', false, ''],
      mobile: ['string', false, ''],
   },

   children: {
      addresses: Collection.extend({ model: Address })
   },

   session: {
      registerOpts: ['object', false, function(){return {}}],      // configurations and settings object
      countryModel: ['object', false, function(){return {}}],
   },

   validation: {
      name: function(){console.log('nvali', this); return {syncCheck: [this.registerOpts.nameRequired]}; },
      gender: function(){ return {}; },
      email: function(){ return {syncCheck: [this.registerOpts.emailReqdCheck], asyncCheck: [this.registerOpts.emailUniqCheck]}; },
   },

   isClientModelValid: function() {
      // ignoring server based errors as it is checked and set on the server in validateModel
      // Use this to bypass server errors as those will be handled on the server
      return this.isModelValid( function(propName, type){ return type != 'uniqeemail' } ) ;    
   },

   checkDupEmail: function(inputValue, inputBag) {
      var successFn = function(resp){ inputBag.validity = resp; this.asyncCheckResponse(inputBag); };
      var boundFn = successFn.bind(this);
 
      var options = {
         url: this.url('checkemail'), 
         data: {email: inputValue}, 
         success: boundFn,
         error: function(resp, s, msg){ console.log(resp, s, msg); } 
      };
      sync('read', null, options);
   },

   register: function(options) {
      this.validateModel();   // Validates all model props and updates errorsBag accordingly
      if (this.isClientModelValid()) {     // Ignore server error messages as server validations will be performed in save below
         options.url = this.url('register'); 
         this.save(null, options);
      };
   },
});

