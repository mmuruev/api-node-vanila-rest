const PNF = require('google-libphonenumber').PhoneNumberFormat;
const phoneUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance();
const validator = require('node-validator');

module.exports = {
    isPhone: function (req) {
        return {
            validate: function validate(value, onError) {

                if (value === null || value === undefined) {
                    return onError('Required value.');
                }

                // Parse number with country code.
                let phoneNumber = phoneUtil.parse(value, 'GB');

                if (!phoneUtil.isValidNumberForRegion(phoneNumber, 'GB')) {
                    return onError('Incorrect phone. Expected GB correct phone number');
                }
                // Filter to canonical format
                req.query.phone = phoneUtil.format(phoneNumber, PNF.E164);
            }
        }
    }
};