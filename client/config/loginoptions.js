//Complementing object to configure model settings and validations. The dynamic section of a model.

module.exports = {
        userIdRequired:     function(value) {
                               return [{validity: (value.length > 0), type: 'required', message: 'User Id is required'}]
                            },
        userIdMinimum:      function(value) {
                               return {validity: (value.length > 6), type: 'length', message: 'User Id should be atleast 7 characters'}
                            },
        passwordRequired:   function(value) {
                               return {validity: (value.length > 0), type: 'required', message: 'Password is required'}
                            },
        passwordMinimum:    function(value) {
                               return {validity: (value.length > 7), type: 'length', message: 'Password should be atleast 8 characters'}
                            },
        passwordUserIdSame: function(value, model) {
                               return {validity: ( (value != model.userId) || (value == '') || (model.userId == '')), 
                                       type: 'sameness', message: 'User Id & Password should not be same'}
                            },
        enforcePasswordStrength: function(value) { 
                                    return value && value.length 
                                 }, 
        userIdChecks: function() { 
                         return [this.userIdRequired, this.userIdMinimum] ;
                      },
        passwordChecks: function() { 
                         return [this.passwordUserIdSame, this.passwordRequired, this.passwordMinimum] ;
                      },

        userIdLabel: "User Id",
        passwordLabel: "Password",
        rememberMeLabel: "Remember me",
        loginButtonLabel: 'Log me in',
        rememberMeEnabled: true,
        forgotUserIdEnabled: false,
        forgotPasswordEnabled: true,
        changePasswordEnabled: false,
        registrationEnabled: true,
        verificationEnabled: false,
        deregistrationEnabled: false
    }


