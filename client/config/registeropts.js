//Complementing object to configure model settings and validations. The dynamic section of a model.

var requiredCheck = function(name, value) {
                       return {validity: (value.length > 0), type: 'required', message: name + ' is required'}
                    };

module.exports = {
        nameRequired:        function(value, model) {
                                return [requiredCheck('Name', value)]
                             },

        nameLabel:    "Name",
        genderLabel:  "Gender",
        emailLabel:   "Email",
        mobileLabel:  "Mobile",
        countryLabel: "Country",
        pinLabel:     "Pin/Zip code",
        genders: [{text: '<select>', value: ''}, {text: 'Female', value: 'F'}, {text: 'Male', value: 'M'}, {text: 'Trans', value: 'T'}]
    }
