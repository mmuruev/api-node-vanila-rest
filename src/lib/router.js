let url = require('url');
let reqCallbacks = {};

/**
 * Router class
 *
 * @param server NodeJS server
 * @constructor
 */
let Router = function (server) {
    server.on('request', function (req, res) {
        let method = req.method;
        let urlParsed = url.parse(req.url);
        let query = urlParsed.query;
        let payload = '';

        req.query = {};

        req.on('data', function (data) {
            payload += data;
        });

        req.on('end', function () {

            if (method === 'PUT' || method === 'DELETE') {
                let urlParts = urlParsed.pathname.split('/');

                let url = '';
                for (let index = 1; index < urlParts.length - 1; index++) {
                    url += ('/' + urlParts[index]);
                }

                urlParsed.pathname = url + '/:id';
                let id = parseInt(urlParts[urlParts.length - 1])
                req.query.id = isNaN(id) ? urlParts[urlParts.length - 1] : id;
            }

            let callback = reqCallbacks[method + ':' + urlParsed.pathname];


            if (query) {
                query.split("&")
                    .forEach(function (item) {
                        let param = item.split("=");
                        param[0] ? req.query[param[0]] = decodeURIComponent(param[1]) : null;
                    });


            }
            if (payload) {
                try {
                    req.payload = JSON.parse(payload);
                } catch (ex) {
                    req.payload = payload;
                }
            }
            //}

            if (callback) {
                callback.call({}, req, res);
            } else if (reqCallbacks.default) {
                reqCallbacks.default.call({}, req, res);
            } else if (reqCallbacks.notFound) {
                reqCallbacks.notFound.call({}, req, res);
            } else {
                defaultNotFoundCallback.call({}, req, res);
            }
        });
    });

    /**
     * Default 'Not found' response callback
     *
     * @param req {IncomingMessage}
     * @param res {ServerResponse}
     */
    function defaultNotFoundCallback(req, res) {
        res.writeHead(404, {
            "Content-type": "application/json"
        });
        res.write(JSON.stringify({
            message: 'URL not found!',
            method: req.method,
            url: req.url
        }));
        res.end();
    }
};

Router.prototype = {
    get: function (path, callback) {
        reqCallbacks['GET:' + path] = callback;
    },

    post: function (path, callback) {
        reqCallbacks['POST:' + path] = callback;
    },

    put: function (path, callback) {
        reqCallbacks['PUT:' + path] = callback;
    },

    delete: function (path, callback) {
        reqCallbacks['DELETE:' + path] = callback;
    },

    setDefaultResponse: function (callback) {
        reqCallbacks.default = callback;
    },

    setNotFoundResponse: function (callback) {
        reqCallbacks.notFound = callback;
    }
};

module.exports = function (server) {
    return new Router(server);
};