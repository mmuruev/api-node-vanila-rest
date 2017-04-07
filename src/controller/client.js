const clientService = require('../service/client');
// Require `PhoneNumberFormat`.
const PNF = require('google-libphonenumber').PhoneNumberFormat;
const phoneUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance();
const validator = require('node-validator');
const phoneGbValidator = require('../validator/phone');

module.exports = {

    get: function (req, res) {
        let check = validator.isAnyObject()
            .withOptional('id', validator.isInteger({message: 'Id must be integer'}))
            .withOptional('phone', validator.isString({
                message: 'Invalid Phone'
            }))
            .withOptional('phone', phoneGbValidator.isPhone(req))
            .withOptional('email', validator.isString({
                regex: /^[a-zA-Z0-9_.+-]+@([a-z0-9]+([\-\.]{1}[a-z0-9\-]+)*\.[a-z\d\-]{1,10}(:[0-9]{1,5})?(\/.*‌​)?)$/,
                message: 'Invalid email'
            }));

        validator.run(check, req.query, function (errorCount, errors) {

            if (errorCount !== 0) {
                res.writeHead(400, {
                    'Content-Type': 'application/json'
                });
                return res.end(JSON.stringify(errors));
            }

            clientService.get(req.context, req.query, function (data) {
                res.writeHead(200, {
                    'Content-Type': 'application/json'
                });
                res.end(JSON.stringify(data));
            });
        });

    },

    post: function (req, res) {
        let check = validator.isAnyObject()
            .withRequired('phone', validator.isString({
                message: 'Invalid Phone'
            }))
            .withRequired('phone', phoneGbValidator.isPhone(req))
            .withRequired('email', validator.isString({
                regex: /^[a-zA-Z0-9_.+-]+@([a-z0-9]+([\-\.]{1}[a-z0-9\-]+)*\.[a-z\d\-]{1,10}(:[0-9]{1,5})?(\/.*‌​)?)$/,
                message: 'Invalid email'
            }));

        validator.run(check, req.payload, function (errorCount, errors) {

            if (errorCount !== 0) {
                res.writeHead(400, {
                    'Content-Type': 'application/json'
                });
                return res.end(JSON.stringify(errors));
            }

            clientService.post(req.context, req.payload, function (data) {
                res.writeHead(201, {
                    'Content-Type': 'application/json'
                });
                res.end(JSON.stringify(data));
            });
        });
    },

    put: function (req, res) {

        let checkData = validator.isAnyObject()
            .withOptional('phone', validator.isString({
                message: 'Invalid Phone'
            }))
            .withOptional('phone', phoneGbValidator.isPhone(req))
            .withOptional('email', validator.isString({
                regex: /^[a-zA-Z0-9_.+-]+@([a-z0-9]+([\-\.]{1}[a-z0-9\-]+)*\.[a-z\d\-]{1,10}(:[0-9]{1,5})?(\/.*‌​)?)$/,
                message: 'Invalid email'
            }));
        let checkId = validator.isObject()
            .withRequired('id', validator.isNumber({message: 'Id must be integer'}));


        validator.run(checkId, req.query, function (errorCount, errors) {

            if (errorCount !== 0) {
                res.writeHead(400, {
                    'Content-Type': 'application/json'
                });
                return res.end(JSON.stringify(errors));
            }
            // Fine to go!
            validator.run(checkData, req.payload, function (errorCount, errors) {

                if (errorCount !== 0) {
                    res.writeHead(400, {
                        'Content-Type': 'application/json'
                    });
                    return res.end(JSON.stringify(errors));
                }


                clientService.put(req.context, req.query.id, req.payload, function (data) {
                    res.writeHead(202, {
                        'Content-Type': 'application/json'
                    });
                    res.end(JSON.stringify({status:'success'}));
                });
            });
        });

    },

    delete: function (req, res) {
        let check = validator.isObject()
            .withRequired('id', validator.isInteger({message: 'Id must be integer'}));

        validator.run(check, req.query, function (errorCount, errors) {

            if (errorCount !== 0) {
                res.writeHead(400, {
                    'Content-Type': 'application/json'
                });
                return res.end(JSON.stringify(errors));
            }

            clientService.delete(req.context, req.query.id, function (data) {
                res.writeHead(204, {
                    'Content-Type': 'application/json'
                });
                res.end(JSON.stringify(data));
            });
        });
    }
};