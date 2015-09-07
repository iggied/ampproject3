/*global $*/
// base view for pages
var View = require('ampersand-view');
var _ = require('lodash');
//var key = require('keymaster');


module.exports = View.extend({ 

    extraProperties: 'allow',

    initialize: function(opts) {
       console.log('base init');
    },

   events: {
      'change': 'handleInputChange'
   },

   handleInputChange: function(e) {
      var propName = e.target.getAttribute('data-hook');
      var propValue = {}; propValue[propName] = this.getInputValue(e.target);
      this.set( propValue, {validate: true, propName: propName} );
   },

   getInputValue: function(inputEl) {
      return ( inputEl.getAttribute('type') === 'checkbox' ? inputEl.checked : inputEl.value ) ;
   },

   validate: function(e, opts) {
      var oldVal = this[opts.propName];
      var newVal = e[opts.propName];
      return this.validateInput(opts.propName, oldVal, newVal);
   },

   updateErrorBag: function( propName, type, message, valid ) {
      var errorObject = {type: type, message: message};
      var updated;
      if (!this.errorsBag[propName]) { this.errorsBag[propName]= []; };
      if (valid) {
         _.remove(this.errorsBag[propName], function(v) { return v.type === type })
         updated = true;
      } 
      else {
         if (! _.any(this.errorsBag[propName], {type: type}))
	    this.errorsBag[propName].push(errorObject);  
            updated = true;
      }
      if (updated) {
         this.errorsBag[propName].errorText = this.errorsBag[propName].map( function(i) {return i.message} ).join(', ');
         this.trigger('change:errorsBag', this, valid, errorObject);       // triggering change manually till I find a way to autodetect
      }
   },

    // register keyboard handlers
    registerKeyboardShortcuts: function() {
        /*
        var self = this;
        _.each(this.keyboardShortcuts, function (value, k) {
            // register key handler scoped to this page
            key(k, self.cid, _.bind(self[value], self));
        });
        key.setScope(this.cid);
        */
    },
    unregisterKeyboardShortcuts: function() {
        //key.deleteScope(this.cid);
    }
});
