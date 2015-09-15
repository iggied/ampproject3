//Complementing object to configure model settings and validations. The dynamic section of a model.

var requiredCheck = function(name, value) {
                       return {validity: (value.length > 0), type: 'required', message: name + ' is required'}
                    };

module.exports = {
        urlRoot: '/api/user',

        nameRequired:   function(value, model) { return [requiredCheck('Name', value)] },
        countryIsValid: function(value, model) {
                                 
                        },
        emailReqdCheck:  function(value, model) { return [requiredCheck('Email', value)] },

        emailUniqCheck: function(value, model, propName) {
                           var sign = propName+Date.now();
                           model.checkDupEmail(value, function(resp){ 
                                 model.asyncCheckResponse( {propName: propName, validity: resp , type: 'uniqeemail', message: 'Email is already registered', sign: sign} ); 
                                                      }
                                              );
                           return sign;
                        },
        nameLabel:    "Name",
        genderLabel:  "Gender",
        emailLabel:   "Email",
        mobileLabel:  "Mobile",
        countryLabel: "Country",
        pinLabel:     "Pin/Zip code",
        genders: [{text: '<select>', value: ''}, {text: 'Female', value: 'F'}, {text: 'Male', value: 'M'}, {text: 'Trans', value: 'T'}]
    }
