var Model = require('ampersand-model');
var _ = require('lodash');

module.exports = Model.extend({

   props: {
      errorsBag: ['object', false, function(){return {}}]
   },

   validate: function(e, opts) {        //This method is automatically called while setting the value of props with validate: true & propName 
      var oldVal = this[opts.propName];
      var newVal = e[opts.propName];
      this.validateProp(opts.propName, newVal, oldVal );       //This method has to be defined in the subclass
      return false;		// false means no errors / only then will the value be set on the model
   },

   validateModel: function() {
       for (propName in this.getAttributes({props: true})) {
          this.validateProp(propName, this[propName], this[propName]);
       }
   },

   // Called from subclass to iterate over an array of functions which return an array/object of error messages.
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
         count += ( includeFn(prop) ? this.errorsBag[prop].length : 0) ;
      }
      return count === 0;
   }
});


