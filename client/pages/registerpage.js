// The binding and event handling methods of a view. Input model is injected while creating the view.
// Model props are bound to the input elements by their data-hook attribute. It has to match the model prop name for DOM-to-model binding to work.
// Model validations happen automatically on DOM change event. model-to-DOM binding works automatically from the binding hash. 
// xxxOpts attached to the model is used to configure the view.

var View = require('ampersand-view'); 
var PageView = require('./baseview');
var templates = require('../templates');
var _ = require('lodash');

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
       'model.registerOpts.countryLabel': [{type: 'text', hook: 'country-label'}],
       'model.registerOpts.pinLabel':     [{type: 'text', hook: 'pin-label'}],
       'model.name':       [{type: 'value', hook: 'name'}],
       'model.registerOpts.genders':      [{type: PageView.prototype.selectBinding, hook: 'gender'}],
       'model.gender':     [{type: 'value', hook: 'gender'}],
       'model.email':      [{type: 'value', hook: 'email'}],
       'model.mobile':     [{type: 'value', hook: 'mobile'}],
       'model.country':    [{type: 'value', hook: 'country'}],
       'model.pin':        [{type: 'value', hook: 'pin'}],
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
            prepareView: function (el) {
                return new View({
                    el: el,
                    collection: this.model.addresses
                });
            }
        },
    },


});



