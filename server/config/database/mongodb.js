'use-strict';

var mongoose = require('mongoose'),
    config = require('../../config/').config,
    logger = config.logger;

mongoose.set('debug', function(coll, method, query, doc) {
    // if(config.)
    // console.log("mongodb production", JSON.stringify([coll, method, query], 0, 4));
});
mongoose.Promise = global.Promise; // Fix for error : Mongoose: mpromise (mongoose's default promise library) is deprecated, plug in your own promise library instead: http://mongoosejs.com/docs/promises.html

/**
 * @description Connecting the mongodb
 */
var connect = function() {
	mongoose.connect(config.database.mongodb.dbURI, {
        //poolSize: 10
        // other options can go here
    }, function(err) {
        if (err) {
            logger.log("error", 'MongoDB connection error');
            logger.error('MongoDB connection error: ' + err);
            process.exit(1);
        }
    });
    return mongoose;
}

mongoose.connection.on('connected', function() {
    logger.info('MongoDB event connected : ' + config.database.mongodb.dbURI);
});

mongoose.connection.once('open', function() {
    //logger.info('MongoDB event open');
    if (config.isProduction) {
        logger.debug('MongoDB connected [%s]');
    } else {
        logger.debug('MongoDB connected [%s]', config.database.mongodb.dbURI);
    }

    mongoose.connection.on('disconnected', function() {
        logger.info('MongoDB event disconnected');
        if (config.isProduction) {
            logger.warn('MongoDB event disconnected ');
        } else {
            logger.warn('MongoDB event disconnected : ' + config.database.mongodb.dbURI);
        }
    });

    mongoose.connection.on('disconnect', function(err) {
        logger.info('Mongoose disconnect');
        //console.log('Mongoose disconnect', err);
    });

    mongoose.connection.on('reconnected', function() {
        logger.info('MongoDB event reconnected');
    });

    mongoose.connection.on('error', function(err) {
        logger.error('MongoDB event error: ' + JSON.stringify(err, 0, 4));
    });

    mongoose.connection.on('parseError', function(err) {
        logger.error('Mongoose parseError:', JSON.stringify(err, 0, 4));
    });
});

mongoose.connection.on('timeout', function(err) {
    logger.info('Mongoose timeout');
    logger.error('Mongoose timeout ' + JSON.stringify(err, 0, 4));
    //console.log('Mongoose timeout', err);
});

var gracefulExit = function() {
    mongoose.connection.close(function() {
        if (config.isProduction) {
            logger.info('Mongoose default connection with DB :' + config.database.mongodb.dbURI + ' is disconnected through app termination');
        } else {
            logger.warn('MongoDB event disconnected : ' + config.database.mongodb.dbURI);
        }
        logger.info('Mongoose default connection with DB :' + config.database.mongodb.dbURI + ' is disconnected through app termination');
        //console.log('Mongoose default connection with DB :' + config.database.mongodb.dbURI + ' is disconnected through app termination');
        process.exit(0);
    });
}
// If the Node process ends, close the Mongoose connection
process.on('SIGINT', gracefulExit); //.on('SIGTERM', gracefulExit);

module.exports = {
    init: function() {
        return connect();
    }
    // mongoose
}
