//Complementing object to configure model settings and validations. The dynamic section of a model.
var equalIfFilled = function(value1, value2) { return ! (value1 == '' || value2 == '' || value1 != value2) };

module.exports = {
        urlRoot: '/api/user', 
        userIdRequired:      function(value, model) {
                                return [{validity: (value.length > 0), type: 'required', message: 'User Id is required'}]
                             },
        userIdMinimum:       function(value, model) {
                                return {validity: (value.length > 6),  type: 'length',   message: 'User Id should be atleast 7 characters'}
                             },
        validatePassword:    function(value, model) {
                                return [{validity: (value.length > 7),  type: 'length',   message: 'Password should be atleast 8 characters'},
                                        {validity: (value.length > 0),  type: 'required', message: 'Password is required'},
                                        {validity: (!equalIfFilled(value, model.userId)), type: 'sameness', message: 'User Id & Password should not be same'}]
                             },
        getPasswordStrength: function(value) { 
                                    return passwordStrength(value); 
                             }, 
        userIdChecks:        function() { 
                                    return [this.userIdRequired, this.userIdMinimum] ;
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

var passwordStrength = function(pwd) {
   var strength = '';
   var strongRegex = new RegExp("^(?=.{8,})(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*\W).*$", "g");
   var mediumRegex = new RegExp("^(?=.{7,})(((?=.*[A-Z])(?=.*[a-z]))|((?=.*[A-Z])(?=.*[0-9]))|((?=.*[a-z])(?=.*[0-9]))).*$", "g");
   var enoughRegex = new RegExp("(?=.{6,}).*", "g");
   
   if (pwd.length == 0) { strength = ''; }
   else if (strongRegex.test(pwd)) { strength = '[strongi ;)]'; }
   else if (mediumRegex.test(pwd)) { strength = '[medium :|]'; }
   else { strength = '[weak :(]'; }
   return strength;
}

