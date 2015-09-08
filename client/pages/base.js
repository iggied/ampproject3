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
      this.model.set( propValue, {validate: true, propName: propName} );
   },

   getInputValue: function(inputEl) {
      return ( inputEl.getAttribute('type') === 'checkbox' ? inputEl.checked : inputEl.value ) ;
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
