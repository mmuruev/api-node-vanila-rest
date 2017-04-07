
const http = require('http');
const config = require('../../config/defaultConfig');

let server = http.createServer().listen(config.port, config.host, function () {
    console.log('App is running on port: ' + config.port);
});

module.exports = server;