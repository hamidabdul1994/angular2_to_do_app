#!/usr/bin/env node

/**
 * 
 * @author  Hamid Raza <hamid.noori@bridgelabz.com>
 * @license ICS
 * @version 1.0
 */
'use strict';

/*
 * Module dependencies
 */
module.exports = function(config) {
    if (typeof config.mongodb !== undefined) {
        return require('./mongodb').init(config);
    } else {
        config.logger.error("Database configuration for mongodb not set");
    }
};
