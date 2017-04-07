module.exports = {
	host: "0.0.0.0",
	port: 3000,
	publicDir: "src/public",

    db: {
        host: 'localhost', // server name or IP address;
        port: 5432,  // PG server port
        database: 'api_platform',
        user: 'api_platform',
        password: 'api_platform'
    }
};