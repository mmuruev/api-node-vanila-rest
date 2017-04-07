const path = require('path');
const fs = require('fs');

const server = require('./src/lib/server');
const router = require('./src/lib/router')(server);
const config = require('./config/defaultConfig');
const clientController = require('./src/controller/client');

const MANUAL_TEMPLATE = 'manual.html';

const API_PREFIX = '/api';

// DOC
router.get('/', function (req, res) {
    const indexFileURL = path.join(__dirname, config.publicDir, MANUAL_TEMPLATE);
    res.writeHead(200, {
        'Content-Type': 'text/html'
    });

    fs.readFile(indexFileURL, function (err, data) {
        if (err) {
            res.end('Template error', err.message);
            console.error('Error:', err);
        }
        res.end(data);
    });
});


// REST
router.get(API_PREFIX + '/clients', clientController.get);
router.post(API_PREFIX + '/client', clientController.post);
router.put(API_PREFIX + '/client/:id', clientController.put);
router.delete(API_PREFIX + '/client/:id', clientController.delete);