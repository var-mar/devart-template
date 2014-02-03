var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var BSON = require('mongodb').BSON;
var ObjectID = require('mongodb').ObjectID;

WishProvider = function(host, port) {
  this.db= new Db('wishwall', new Server(host, port,{}), {safe: true});
  this.db.open(function(){});
};

WishProvider.prototype.getCollection= function(callback) {
  this.db.collection('wishes', function(error, Wish_collection) {
    if( error ) callback(error);
    else callback(null, Wish_collection);
  });
};

//find all Wishes
WishProvider.prototype.findAll = function(callback) {
    this.getCollection(function(error, Wish_collection) {
      if( error ) callback(error)
      else {
        Wish_collection.find().toArray(function(error, results) {
          if( error ) callback(error)
          else callback(null, results)
        });
      }
    });
};

//save new Wish
WishProvider.prototype.save = function(Wishes, callback) {
    this.getCollection(function(error, Wish_collection) {
      if( error ) callback(error)
      else {
        if( typeof(Wishes.length)=="undefined")
          Wishes = [Wishes];

        for( var i =0;i< Wishes.length;i++ ) {
          Wish = Wishes[i];
          Wish.created_at = new Date();
        }

        Wish_collection.insert(Wishes, function() {
          callback(null, Wishes);
        });
      }
    });
};

exports.WishProvider = WishProvider;