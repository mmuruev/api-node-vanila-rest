let config = require('../../config/defaultConfig');
let pgp = require('pg-promise')(/*options*/);

module.exports = function(){
    return pgp(config.db); // database instance;
};