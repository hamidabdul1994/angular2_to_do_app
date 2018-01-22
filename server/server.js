require('rootpath')();
var express = require('express');
var app = express();
var cors = require('cors');
var bodyParser = require('body-parser');
var expressJwt = require('express-jwt'),
//config = require('config.json');
	configIni = require("./config/").set(process.env.NODE_ENV, app),
    config = require("./config/").get(),
    logger = config.logger,
    modelInit = require("./model/").init(config);
    app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// use JWT auth to secure the api, the token can be passed in the authorization header or querystring
app.use(expressJwt({
    secret: config.secretLoginToken,
    getToken: function (req) {
        if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
            return req.headers.authorization.split(' ')[1];
        } else if (req.query && req.query.token) {
            return req.query.token;
        }
        return null;
    }
}).unless({ path: ['/users/authenticate', '/users/register'] }));

// routes
app.use('/users', require('./controllers/users.controller'));

// start server
app.listen(config.port, function() {
	logger.info("Express server listening on port " + config.port);
});

