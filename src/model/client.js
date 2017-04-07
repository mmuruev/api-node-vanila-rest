const config = require('../../config/defaultConfig');
const db = require('pg-promise')(/*options*/)(config.db);

const CLIENT_TABLE = 'client';

const ID_FIELD = 'id';

const PHONE_FIELD = 'phone';

const EMAIL_FILED = 'email';

const DATA_JSON_FIELD = 'data';


module.exports = {

    FIELD: {
        ID: ID_FIELD,
        PHONE: PHONE_FIELD,
        EMAIL: EMAIL_FILED
    },

    getById: function (id, callback) {
        db.one("SELECT * FROM " + CLIENT_TABLE + " WHERE id=$1", id)
            .then(function (user) {
                callback(user);
            })
            .catch(function (error) {
                console.log("ERROR:", error.message || error);
                callback(error);
            })
    },

    findBy(criteriaData, callback){
        let criteriaValues = [];
        for (const field in criteriaData) {
            criteriaValues.push(field + ' = ' + this._fieldPlaceholder(field));
        }
        let criteriaQuery = criteriaValues.length ? ' WHERE ' + criteriaValues.toString() : '';

        db.any('SELECT * FROM ' + CLIENT_TABLE + criteriaQuery, criteriaData)
            .then(dataCollection => {
                dataCollection.forEach(function (data) {
                    if (data && data.data) {
                        for (const field in data.data) {
                            data[field] = data.data[field];
                        }
                        delete data.data;
                    }
                });
                callback(dataCollection);
            })
            .catch(error => {
                console.log('SEARCH ERROR:', error.message || error);
                callback(error);
            });
    },

    update: function (id, data, callback) {

        let values = [];

        let query = this._getFieldsAndValues(data);

        for (const index in query.fields) {
            values.push('"' + query.fields[index] + '" = ' + query.placeholders[index]);
        }


        db.none('UPDATE ' + CLIENT_TABLE + ' SET ' + values.toString() + ' WHERE id = ' + parseInt(id, 10), query.data)
            .then(data => {
                callback(data)
            })
            .catch(error => {
                console.log('UPDATE ERROR:', error.message || error);
                callback(error);
            });
    },

    insert: function (data, callback) {

        let query = this._getFieldsAndValues(data);
        db.one('INSERT INTO ' + CLIENT_TABLE + '(' + query.fields.toString() + ') VALUES(' + query.placeholders.toString() + ') returning id', query.data)
            .then(response => {
                callback({id: response.id, status: 'created'});
            })
            .catch(error => {
                console.log('INSERT ERROR:', error.message || error);
                callback(error);
            });
    },

    remove: function (id, callback) {
        db.none('DELETE FROM ' + CLIENT_TABLE + ' WHERE id = ${id}', {id: id})
            .then(() => {
                callback({id: id, status: 'deleted'})
            })
            .catch(error => {
                console.log('DELETE ERROR:', error.message || error);
                callback(error);
            });
    },

    _fieldPlaceholder: function (field) {
        return '${' + field + '}';
    },

    _getFieldsAndValues(inputData){
        let fields = [];
        let placeholders = [];
        let additionalData = {};
        let data = {};

        for (let field in inputData) {
            switch (field) {
                case ID_FIELD:
                case PHONE_FIELD:
                case EMAIL_FILED:
                    fields.push(field);
                    placeholders.push(this._fieldPlaceholder(field));
                    data[field] = inputData[field];

                    break;
                default:
                    additionalData[field] = inputData[field];
                    break;
            }

        }

        if (additionalData) {
            fields.push(DATA_JSON_FIELD);
            placeholders.push(this._fieldPlaceholder(DATA_JSON_FIELD));
            data.data = JSON.stringify(additionalData);
        }

        return {
            fields: fields,
            placeholders: placeholders,
            additionalData: additionalData,

            data: data
        }
    }
};