//Complementing object to configure model settings and validations. The dynamic section of a model.

var requiredCheck = function(name, value) {
                       return {validity: (value.length > 0), type: 'required', message: name + ' is required'}
                    };

module.exports = {
        urlRoot: '/api/user',

        nameMinimum:    function(value, model) {
                           return {validity: (value.length > 1),  type: 'length',   message: 'Name should be atleast 2 characters'}
                        },
        nameRequired:   function(value, model) { return [requiredCheck('Name', value)] },
        countryIsValid: function(value, model) {
                        },
        emailReqdCheck: function(value, model) { return [requiredCheck('Email', value)] },
        emailUniqCheck: function(value, model, propName) {
                           var callKey = propName+Date.now();
                           model.checkDupEmail(value, 
                                 {propName: propName, validity: undefined, type: 'uniqeemail', message: 'Email is already registered', callKey: callKey} ); 
                           return callKey;
                        },
        line1Required:   function(value, model) { return [requiredCheck('Address line 1', value)] },
        genders:      [{text: '<select>', value: ''}, {text: 'Female', value: 'F'}, {text: 'Male', value: 'M'}, {text: 'Trans', value: 'T'}],
        nameLabel:    "Name",
        genderLabel:  "Gender",
        emailLabel:   "Email",
        mobileLabel:  "Mobile",
        countryLabel: "Country",
        pinLabel:     "Pin/Zip code",
        line1Label:   "Address line 1",
        line2Label:   "Address line 2",
        cityLabel:    "City",
        stateLabel:   "State",
        pinLabel:     "Pin/Zip",
        countryLabel: "Country",
      
    }
