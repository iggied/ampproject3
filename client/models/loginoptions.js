var State = require('ampersand-state');

var ModelType = { string: 'string', boolean: 'boolean' };

module.exports = State.extend({
    type: 'loginOptions',
    props: {
        //userId: [ModelType.string, true, ''],
        //password: ['string', true, ''],
        enforcePasswordStrength: ['boolean', false, false],
        rememberMeEnabled: [ModelType.boolean, false, true],
        forgotUserIdEnabled: [ModelType.boolean, false, false], 
        forgotPasswordEnabled: ['boolean', false, true],
        changePasswordEnabled: ['boolean', false, false],
        registrationEnabled: ['boolean', false, true],
        verificationEnabled: ['boolean', false, false],
        deregistrationEnabled: ['boolean', false, false]
    }
});

