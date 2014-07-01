// Saving each two seconds package
function UDPListener(db){
  var self = this;
  var dgram = require('dgram');
  var server = dgram.createSocket('udp4');
  packageButterfly = null;
  this.db = db;

  setInterval(function() {
    if(packageButterfly!=null){
      self.updateButterFlyPackage( packageButterfly );
    }
  },30000);

  this.updateButterFlyPackage = function(){
    this.db.findAllButterfliesPackages(function(err,packages){
      if(packages==null || packages.length==0){
        self.db.saveButterfliesPackages(packageButterfly, function(){
        });
      }else{
        //console.log(packages);
        self.db.updateButterfliesPackages({'id':packages[0]._id,'package':packageButterfly}, function(){
        });
      }
    });
  };

  this.getLastButterFlyPackage = function(callback){
    this.db.findAllButterfliesPackages(function(err,packages){
      if(err==null){
        callback(err,packages[0]);
      }else{
        callback(err,null);
      }
    });
  };

  server.on("listening", function() {
    var address = server.address();
  });

  server.on("message", function(message, rinfo) {
     packageButterfly = message; 
  });

  server.on("close", function() {
    console.log("Socket closed");
  });
  server.bind(3011);
}

exports.UDPListener = UDPListener;