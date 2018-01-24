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
	crypto = require('crypto'),
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
	},
	lastIPAddress: String,
	passwordResetToken: String,
	passwordResetExpires: Date
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
		ret.userObjectId = ret._id;
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
UserSchema.statics.saveUser = function(userObj, callback) {
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
					{$set:userObj},
					{new : true},
					function(err, userDoc) {
						if (err) {
							callback(err, null);
						} else {
							callback(null, doc[0]);
						}
					});
			} else {
				var user = new that(userObj);
				// user.password = user.generateHash();
				user.save(callback);
			}
		});
};
UserSchema.statics.updateUserProfile = function(userObj, callback) {
	this.findOneAndUpdate({
			username : empObj.username,
			isDeleted : false
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
UserSchema.statics.findByUsername = function(username, cb) {
	return this.findOne({
			username : username,
			isDeleted : false
		})
		.exec(cb);
};

//Instance Method to generate encrypted password
UserSchema.methods.generateHash = function(password) {
	password = password || this.password; //If not password in arguments
	return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
};

//Instance Method to generate compare password
UserSchema.methods.validPassword = function(password) {
	return bcrypt.compareSync(password, this.password);
};

/**
 * Delete `User` by its _id
 *
 * @param {String} _id
 * @return {Error} err
 * @return {User} employeeObject
 * @api public
 */
UserSchema.statics.deleteUserById = function(_id, cb) {
	this.findOneAndUpdate({
					_id : _id,
					isDeleted : false
				},
				{
					$set:{
					isDeleted : true
					}
				}).exec(cb);
};

/**
 * @description Expose `User` Model
 */
module.exports = mongoose.model("user",UserSchema);
