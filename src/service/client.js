let clientModel = require('../model/client');
let crypto = require('./crypt');

const UNMASKED_PHONE_NUMBERS_LENGTH = 4;

module.exports = {

    get: function (ctx, criteria, callback) {
        if (criteria && criteria.phone) {
            criteria.phone = crypto.encrypt(criteria.phone);
        }
        clientModel.findBy(criteria, function (dataCollection) {
            dataCollection.forEach(function (data) {
                if (data && data.phone) {
                    let decryptedPhone = crypto.decrypt(data.phone);

                    function pad(width, string, padding) {
                        return (width <= string.length) ? string : pad(width, padding + string, padding)
                    }

                    data.phone = decryptedPhone && decryptedPhone.length > UNMASKED_PHONE_NUMBERS_LENGTH ?
                        pad(decryptedPhone.length, decryptedPhone.substring(decryptedPhone.length - UNMASKED_PHONE_NUMBERS_LENGTH, decryptedPhone.length), '*') : null;
                }
            });

            callback(dataCollection);
        });
    },

    post: function (ctx, data, callback) {
        if (data && data.phone) {
            data.phone = crypto.encrypt(data.phone);
        }
        clientModel.insert(data, callback);
    },

    put: function (ctx, id, data, callback) {
        if (data && data.phone) {
            data.phone = crypto.encrypt(data.phone);
        }
        clientModel.update(id, data, callback);
    },

    delete: function (ctx, id, callback) {
        clientModel.remove(id, callback);
    }

};