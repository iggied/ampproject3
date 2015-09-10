var AmpersandModel = require('ampersand-model');


module.exports = AmpersandModel.extend({
    url: function() {return '/api/people/'+this.firstName+'/'+this.lastName} ,

    props: {
        id: 'any',
        firstName: ['string', true, ''],
        lastName: ['string', true, ''],
        coolnessFactor: ['number', true, 5]
    },
    session: {
        selected: ['boolean', true, false]
    },
    derived: {
        fullName: {
            deps: ['firstName', 'lastName'],
            fn: function () {
                return this.firstName + ' ' + this.lastName;
            }
        }
    }
});
