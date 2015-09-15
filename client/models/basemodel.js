var Model = require('ampersand-model');
var _ = require('lodash');
var isObject = require('lodash.isobject');
var Q = require('q');

module.exports = Model.extend({

   props: {
      errorsBag: ['object', false, function(){return {}}]
   },

   session: {
      asyncPendingCalls: ['array', false, function(){ return[] }]
   },

   set: function(key, value, options) {
      var attrs;

      // Handle both `"key", value` and `{key: value}` -style arguments.
      if (isObject(key) || key === null) {
          return Model.prototype.set.apply(this, [key, value, options]);
      } else {
         options = options || {};
         if (this.validationExists(key)) {
            // Doing this hack to automatically validate single attribute
            options['validate'] = true;
            options['propName'] = key; 
         };

         return Model.prototype.set.apply(this, [key, value, options]);
      }
   },

   //This method is automatically called while setting the value of props with validate: true & propName   
   validate: function(attrs, opts) {        
      var oldVal = this[opts.propName];
      var newVal = attrs[opts.propName];
      //validateProp method is defined in the subclass
      this.validateProp(opts.propName, newVal, oldVal );       
      return false;		// false means no errors / only then will the value be set on the model
   },

   validateModel: function() {
       for (propName in this.getAttributes({props: true})) {
          if (this.validationExists(propName)) { 
             this.validateProp(propName, this[propName], this[propName], false);
          };
       }
   },

   //This method is called automatically on set>>change event and also manually for all props 
   validateProp: function(propName, newValue, oldValue, inspectOnly) {
console.log('validateProp', propName, newValue, oldValue, inspectOnly);
      var checks, checksArray, asyncChecksArray, checkExists = false ;
      if (this.validation && typeof this.validation[propName] == 'function' ) {
         checks = this.validation[propName](this);
         checksArray = checks.syncCheck;
         asyncChecksArray = checks.asyncCheck;
      };

      if (checksArray) {
         checkExists = true;
         inspectOnly || this.executeChecks(propName, checksArray, newValue, oldValue );   // method defined in superclass
      };

      if (asyncChecksArray) {
         checkExists = true;
         inspectOnly || this.executeAsyncChecks(propName, asyncChecksArray, newValue, oldValue );   // method defined in superclass
      };
      return checkExists;
   },

   validationExists: function(propName) {
      return this.validateProp(propName,null,null,true);
   },

   //Called from subclass to iterate over an array of functions which return an array/object of error messages.
   executeChecks: function(propName, checksArray, newValue, oldValue) {
      var result ;

      _.forEach(checksArray, function(checkFn) {
         result = checkFn(newValue, this);
         result = (Array.isArray(result)) ? result : [result]; 
               
         _.forEach(result, function(inResult) {
             this.updateErrorBag(propName, inResult.type, inResult.message, inResult.validity);
         }, this)
      }, this);
   },

   //Called from subclass to iterate over an array of functions which return an array/object of error messages.
   executeAsyncChecks: function(propName, checksArray, newValue, oldValue) {
      var sign;
      _.forEach(checksArray, function(checkFn) {
         sign = checkFn(newValue, this, propName);
         this.asyncPendingCalls.push(sign);
      }, this);
   },

   asyncCheckResponse: function(inResult) {
      this.updateErrorBag(inResult.propName, inResult.type, inResult.message, inResult.validity);
      _.remove(this.asyncPendingCalls, function(v) { return v = inResult.sign});
   }, 

   asyncChecksCompleted: function() {
      var deferred = Q.defer();
      var self = this;
      var execCount = 0;
      var fn = function() { 
         if (self.asyncPendingCalls.length == 0) { 
            deferred.resolve(); 
         } else {
	    if (execCount++ < 5){ setTimeout(fn, 20); } else { deferred.reject('timeout') };
         }
      };
      fn();

      return deferred.promise
   },

   updateErrorBag: function( propName, type, message, valid ) {
      var errorObject = {type: type, message: message};
      var updated;
      this.errorsBag[propName] = this.errorsBag[propName] || [];
      if (valid) {
         _.remove(this.errorsBag[propName], function(v) { return v.type === type });
         updated = true;
      } 
      else {
         if (! _.any(this.errorsBag[propName], {type: type}))
	    this.errorsBag[propName].push(errorObject);  
            updated = true;
      }
      if (updated) {
         this.trigger('change:errorsBag', this, valid, errorObject);       // triggering change manually till I find a way to autodetect
      }
   },

   getErrMessagesArray: function(propName) {
      return (this.errorsBag[propName] ? this.errorsBag[propName].map( function(i) {return i.message} ) : []) ;
   },

   isModelValid: function(includeFn) {
      var count = 0;
      includeFn = includeFn || function(){ return true };
      for (prop in this.errorsBag) {
         _.forEach(this.errorsBag[prop], function(item) {
            count += ( includeFn(prop, item.type) ? 1 : 0) ;
         });
      }
      return count === 0;
   }
});


