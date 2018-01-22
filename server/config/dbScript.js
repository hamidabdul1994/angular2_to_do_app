/**
 * @description DB Script to ensure the index on mongodb
 * @path config/dbScript.js
 * @file dbScript.js
 */
'use strict';

var async = require("async");

var createUniqueIndex = function(mongoose, callback) {
    mongoose.on("open", function(){
        try {
          var connection = mongoose;
          async.parallel([
            function (callback) {
              var userCollection = connection.db.collection("users");

              userCollection.ensureIndex({
                  "username" : 1
              }, {
                  "unique": true
              }, function (err, result){
                  if(err){
                      throw err;
                  }
                  if(result !== "username_1"){
                      userCollection.createIndex({
                              "username_1" : 1
                          }, {
                              unique : true
                          }, function(err, result){
                              if(err){
                                  throw err;
                              }
                          });
                  };
              });
              callback(null, "All index for collections OK! for User ");
            }
          ],callback);

        } catch (e) {
            console.log("error", e)
            callback(e, null)
        }
    });
};

module.exports = createUniqueIndex;
