'use strict';

var config = require('../config/'),
	Base,
	User;

module.exports = {
	init: function() {
		require('./base/');
	},
	User: require('./user/'),
	Company: require('./base/'),
};

// ReportSchema: require('./reports/attendanceReportSchema')
