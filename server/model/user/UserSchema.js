/**
 * @description User Schema
 * @path model/employee/UserSchema.js
 * @file UserSchema.js
 */
'use strict';

/**
 * @description Module dependencies
 */
var mongoose = require('mongoose'),
	extend = require('mongoose-schema-extend'),
	BaseImport = require('../base/').Base,
	config = require('../../config/').get(),
	logger = config.logger,
	util = require('util'),
	Schema = mongoose.Schema,
	Promise = require('bluebird'),
	async = require("async"),
	_ = require("underscore"),
	exclude = require('lodash');

// Require the thing
var stringify = require('json-stringify-safe');

var ObjectId = Schema.Types.ObjectId;
var Base = BaseImport.AbstractSchema;
var Common = BaseImport.schemaValidator;


var UserSchema = Base.extend({
	username: {
		type: String,
		unique: true,
		required: true
	},
	password: {
		type: String,
		trim: true,
		default: ""
	},
	firstName: {
		type: String,
		trim: true,
		required: false,
		default: ""
	},
	middleName: { // No earlier existance, New implementation - 11th April 2017
		type: String,
		trim: true,
		required: false,
		default: ""
	},
	lastName: {
		type: String,
		trim: true,
		required: false,
		default: ""
	}
},
 {
	//  _id: false,
	// minimize: false,
	strict: true
});

UserSchema.set('validateBeforeSave', true);

UserSchema.set('toJSON', {
	virtuals: true,
	transform: function(doc, ret, field) {
		ret.employeeObjectId = ret._id;
		delete ret._id;
		delete ret.__v;
		delete ret.id;
		return ret;
	}
});

/**
 * Save Employee
 *
 * @return {Error} err
 * @return {User} user
 * @api For administrator
 */
UserSchema.statics.saveEmployee = function(userObj, callback) {
	var that = this;
	this.find({
			username : userObj.username,
			isDeleted : false
		},
		function(err, doc) {
			if (err) {
				callback(err, null);
			}
			if (doc.length > 0) {
				that.findOneAndUpdate({
						username: userObj.username,
						isDeleted: false
					},
					{$set:empObj},
					{new : true},
					function(err, employeeDoc) {
						if (err) {
							callback(err, null);
						} else {
							callback(null, doc[0]);
						}
					});
			} else {
				var employee = new that(userObj);
				employee.save(callback);
			}
		});
};
UserSchema.statics.updateEmployeeProfile = function(empObj, callback) {
	this.findOneAndUpdate({
			tenantID : empObj.tenantID,
			emailAddress: empObj.emailAddress,
			isDeleted: false
		},
		{$set:empObj},
		{new : true},callback);
};
/**
 * Find `User` by its email
 *
 * @param {String} email
 * @return {Error} err
 * @return {User} employeeObject
 * @api public
 */
UserSchema.statics.findByEmail = function(email, cb) {
	return this.findOne({
			emailAddress: email
		})
		.exec(cb);
};

/**
 * @description Expose `User` Model
 */
module.exports = mongoose.model("user",UserSchema);
