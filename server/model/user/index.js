/*
 * Employee Init
 * @path model/employee/index.js
 * @file index.js
 */

/*
 * Module dependencies
 */
var config = require('../../config/'),
	Base,
	User;

module.exports = {
	init: function() {
		require('../base/');
	},
	User: require('./UserSchema'),
};
