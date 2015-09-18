// The binding and event handling methods of a view. Input model is injected while creating the view.
// Model props are bound to the input elements by their data-hook attribute. It has to match the model prop name for DOM-to-model binding to work.
// Model validations happen automatically on DOM change event. model-to-DOM binding works automatically from the binding hash. 
// xxxOpts attached to the model is used to configure the view.

var View = require('ampersand-collection-view'); 
var PageView = require('./baseview');
var templates = require('../templates');
var _ = require('lodash');


//AddressView = require('ampersand-view').extend({
AddressView = PageView.extend({
   template: templates.pages.register.address,

    derived: {
       line1Messages: {
            deps: ['model.errorsBag.line1'],
            fn: function() { return this.model.getErrMessagesArray('line1').join(', '); }
       },
    },

   bindings: {
      'model.type':    [{type: 'value', hook: 'type'}],
      'model.line1':   [{type: 'value', hook: 'line1'}],
      'model.line2':   [{type: 'value', hook: 'line2'}],
      'model.city':    [{type: 'value', hook: 'city'}],
      'model.state':   [{type: 'value', hook: 'state'}],
      'model.pin':     [{type: 'value', hook: 'pin'}],
      'model.country': [{type: 'value', hook: 'country'}],
      'model.collection.parent.registerOpts.line1Label'  : [{type: 'text', hook: 'line1-label'}],
      'model.collection.parent.registerOpts.line2Label'  : [{type: 'text', hook: 'line2-label'}],
      'model.collection.parent.registerOpts.cityLabel'   : [{type: 'text', hook: 'city-label'}],
      'model.collection.parent.registerOpts.countryLabel': [{type: 'text', hook: 'country-label'}],
      'model.collection.parent.registerOpts.pinLabel'    : [{type: 'text', hook: 'pin-label'}],
      'model.collection.parent.registerOpts.stateLabel'  : [{type: 'text', hook: 'state-label'}],
      'line1Messages': [{type: 'text', hook: 'line1-error'}],
   },
});

module.exports = PageView.extend({
    pageTitle: 'Registration',

    template: templates.pages.register,

    initialize: function(opts) {
      //PageView.prototype.initialize.apply(this, opts);
    },

    session: {
      countryData: ['object', false, function(){return{}}]
    },

    derived: {
       nameMessages: {
            deps: ['model.errorsBag.name'],
            fn: function() { return this.model.getErrMessagesArray('name').join(', '); }
       },
       emailMessages: {
            deps: ['model.errorsBag.email'],
            fn: function() { return this.model.getErrMessagesArray('email').join(', '); }
       },
    },

    // model-to-DOM 1-way bindings
    bindings: _.extend({}, PageView.prototype.bindings, {
       'model.registerOpts.nameLabel':    [{type: 'text', hook: 'name-label'}],
       'model.registerOpts.genderLabel':  [{type: 'text', hook: 'gender-label'}],
       'model.registerOpts.emailLabel':   [{type: 'text', hook: 'email-label'}],
       'model.registerOpts.mobileLabel':  [{type: 'text', hook: 'mobile-label'}],
       'model.name':       [{type: 'value', hook: 'name'}],
       'model.registerOpts.genders':      [{type: PageView.prototype.selectBinding, hook: 'gender'}],
       'model.gender':     [{type: 'value', hook: 'gender'}],
       'model.email':      [{type: 'value', hook: 'email'}],
       'model.mobile':     [{type: 'value', hook: 'mobile'}],
       'nameMessages':     [{type: 'text', hook: 'name-error'}],
       'genderMessages':   [{type: 'text', hook: 'gender-error'}],
       'emailMessages':    [{type: 'text', hook: 'email-error'}],
       'modelMessages':    [{type: 'text', hook: 'model-error'}],
    }),

    events: _.extend({}, PageView.prototype.events, {
       'click [data-hook=registerbutton]': 'handleRegistration'
    }), 

    render: function() {
       this.renderWithTemplate(this);

//       this.renderCollection( this.model.addresses, AddressView, this.queryByHook('address-container'));

       return this;
    },

    handleRegistration: function(e) {
       e.preventDefault();
       console.log('State n='+this.model.name+ ' g=' + this.model.gender+' c='+this.model.country);

       this.model.register({
          success: function(model, response) {  
             if (model.id) { app.trigger('register', response); };
          }, 
          error: function() {
             console.log('backend error');
          }
       });
    },

    subviews: {
        addressesView: {
            selector: '[data-hook=address-container]',
            //waitFor: 'model.addresses',
            prepareView: function(el) {
console.log(el);
                return new View({
                    el: el,
                    collection: this.model.addresses,
                    view: AddressView
                });
            }
        },
    },


});



