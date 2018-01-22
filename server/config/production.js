/**
 * Production.js
 *
 * Production file is the default setup expected to have on a localmachine to work with the Production config
 *
 * @author  Hamid Raza <hamid.noori@bridgelabz.com>
 * @license ICS
 * @version 1.0
 */

var winston = require('winston'),
	dateFormat = require('dateformat'),
	path = require("path"),
	moment = require('moment');


/**
 * @exports : Exports developement Config Environment based Configuration
 *
 */
module.exports = function(config) {
	var logDir = config.logDir;
	return {
		"name": 'development',
		"host": 'my-domain.com',
		"port": process.env.NODE_PORT || 8080,
		"emailConfig": {
		},
		'secretLoginToken': 'Br1D635e2r31s3ncry9t3d#',
		"database": {
			"debug": true,
			"mongodb": {
				"name": "todo-app",
				"dbURI": "mongodb://localhost:27017/todo-app",
				"username": "user",
				"password": process.env.MONGO_PASSWORD
			}
		},
		"loggers": new winston.Logger({
			"exceptionHandlers": [
				new(winston.transports.Console)({
					"json": true
				}),
				new(winston.transports.File)({
					"level": 'error,warn',
					"filename": path.join(logDir, '/exception.log'),
					"handleExceptions": true,
					"json": true,
					"maxsize": 5242880, //5MB
					"maxFiles": 5,
					"prettyPrint": true,
					"zippedArchive": true,
					"colorize": "all",
					"eol": "\n",
					"timestamp": function() {
						return "" + dateFormat(new Date(), "ddd mmm d yyyy HH:MM:ss TT") + "";
					},
					"formatter": function(options) {
						// Return string will be passed to logger.
						var message = options.timestamp() + ' [' + options.level.toUpperCase() + '] - ' + (undefined !== options.message ? options.message : '') +
							(options.meta && Object.keys(options.meta).length ? '\n\t' + JSON.stringify(options.meta) : '');
						return winston.config.colorize(options.level, message);
					}
				})
			],
			"transports": [
				new winston.transports.File({
					"level": 'info,error,warn',
					"filename": path.join(logDir, '/error.log'),
					"handleExceptions": true,
					"json": true,
					"maxsize": 5242880, //5MB
					"maxFiles": 5,
					"prettyPrint": true,
					"zippedArchive": true,
					"colorize": "all",
					"eol": "\n",
					"timestamp": function() {
						return "" + dateFormat(new Date(), "ddd mmm d yyyy HH:MM:ss TT") + "";
					},
					"formatter": function(options) {
						// Return string will be passed to logger.
						var message = options.timestamp() + ' [' + options.level.toUpperCase() + '] - ' + (undefined !== options.message ? options.message : '') +
							(options.meta && Object.keys(options.meta).length ? '\n\t' + JSON.stringify(options.meta) : '');
						return winston.config.colorize(options.level, message);
					}
				}),
				new winston.transports.Console({
					"level": 'info',
					"handleExceptions": true,
					"json": false,
					"colorize": "all",
					"eol": "\n",
					"timestamp": function() {
						return "" + dateFormat(new Date(), "ddd mmm d yyyy HH:MM:ss TT") + "";
					},
					"formatter": function(options) {
						// Return string will be passed to logger.
						var message = options.timestamp() + ' [' + options.level.toUpperCase() + '] - ' + (undefined !== options.message ? options.message : '') +
							(options.meta && Object.keys(options.meta).length ? '\n\t' + JSON.stringify(options.meta) : '');
						return winston.config.colorize(options.level, message);
					}
				})
			],
			"exitOnError": false,
			"levels": config.levels,
			"colors": config.colors
		}),
		"stream": {
			write: function(message, encoding) {
				this.loggers.info(message);
			}
		}
	};
};
