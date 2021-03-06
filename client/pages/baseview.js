/*global $*/
// base view for pages
var View = require('ampersand-view');
var _ = require('lodash');
//var key = require('keymaster');


module.exports = View.extend({ 

    //extraProperties: 'allow',

    initialize: function(opts) {
       console.log('base init');
    },

   events: {
      'change': 'handleInputChange'
   },

   handleInputChange: function(e) {
      var propName = e.target.getAttribute('data-hook');
      //var propValue = {}; propValue[propName] = this.getInputValue(e.target);
      var propValue = this.getInputValue(e.target);
      if (propName in this) {  
         //this.set( propValue, {validate: true, propName: propName} );
         this[propName] = propValue;
      } else {
         //this.model.set( propValue, {validate: true, propName: propName} );
         this.model[propName] = propValue;    // Assuming model is set as the model
      }
   },

   getInputValue: function(inputEl) {
      return ( inputEl.getAttribute('type') === 'checkbox' ? inputEl.checked : inputEl.value ) ;
   },


   selectBinding: function(el, value, previousValue) {
      var option;
      if (!previousValue || value != previousValue) {
         for (i = 0, l = el.options.length; i < l; i++) {
            el.remove(0);
         }
         _.forEach( value, function(opt) {
            option = document.createElement('option');
            option.text = opt.text;
            option.value = opt.value;
            el.add( option );
         });
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
