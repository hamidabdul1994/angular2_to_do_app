/**
 * @name Base Schema
 * @path model/base/user/base.js
 * @file base.js
 * @description This provides all the different models for the various user & other schema in the API
 * Each exchange has slightly different data and organization, so each exchange has its own model
 * Each model uses a schema, which inherits from AbstractSchema
 */
'use strict';

/*
 * Module dependencies
 */
var bcrypt = require('bcryptjs'),
	crypto = require('crypto'),
	mongoose = require('mongoose'),
	uniqueValidator = require('mongoose-unique-validator'),
	util = require('util'),
	// config = require('../../config').get(),
	// logger = config.logger,
	express = require('express'),
	mongooseSchemaJSONschema = require('mongoose-schema-jsonschema')(mongoose);

var Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;
var User = {};

var AbstractSchema = new Schema({
	createdAt: {
		type: Date,
		default: new Date
	},
	createdBy: {
		type: ObjectId,
		ref: 'users',
		default: null
	},
	updatedAt: {
		type: Date,
		default: new Date
	},
	updatedBy: {
		type: ObjectId,
		ref: 'users'
	},
	isDeleted: {
		type: Boolean,
		default: false
	},
	deletedAt: Date,
	deletedBy: {
		type: ObjectId,
		ref: 'users'
	}
});

/**
 * @description Set logged user
 */
var setUser = function(userDetails){
	User = userDetails;
};

/**
 * @description Pre save for base schema inherting in all the schema
 */
AbstractSchema.pre('save', function(next, done) {
	var dateNow = new Date(); //Date.now;
	if (this.isNew) {
		this.createdBy = User.id;
		this.createdAt = dateNow;
		this.isDeleted = false;
	} else {
		this.updatedBy = User.id;
		this.updatedAt = dateNow;
	}
	next();
});
AbstractSchema.pre('update', function(next, done) {
	var dateNow = new Date();
	if (this.isNew) {
	} else {
		this.updatedBy = User.id;
		this.updatedAt = dateNow;
	}
	next();
});
module.exports = {
	setUser : setUser,
	AbstractSchema: AbstractSchema
};
