/*
Wishing wall
*/

// Load config json file
var nconf = require('nconf');
nconf.file('./config.json');

// hand butterfly OF Communication
var dgram = require('dgram');
var clientUDP = dgram.createSocket('udp4');

var osc = require('node-osc');
var oscServer = new osc.Server(nconf.get('osc-port-in'), '0.0.0.0'); 
var handIp = nconf.get('hand-chrome-computer-ip');
oscServer.on("message", function (msg, rinfo) {
  //console.log(msg[2]);
  //msg[2][0]
  var json = {'position':{'x':msg[2][1],'y':msg[2][2],'z':msg[2][3]},
    'touchingWall':msg[2][4],
    'microphoneID':msg[2][5]};
  var jsonString = JSON.stringify(json);
  var message = new Buffer(jsonString);
  // send to hand by UDP
  clientUDP.send(message, 0, message.length, 4000, handIp);
  //counter += 1;
});
/*
counter = 0;
setInterval(
function(){
  console.log(counter);
  counter = 0;
},1000
);
*/

function sendOSCMessageNewButterfly(id,x,y,z,microphoneID){
  var client = new osc.Client(nconf.get('hand-OF-computer-ip'), nconf.get('osc-port-out')); client.send('/newbutterfly',id,microphoneID, x,y,z);
}
/*
function sendOSCMessageUpdateButterfly(id,x,y,z,microphoneID){
  var client = new osc.Client(nconf.get('hand-computer-ip'), nconf.get('osc-port-out')); client.send('/updatebutterfly',id,microphoneID, x,y,z);
}
*/
function sendOSCMessageButterflyFinishWaitingHand(id,microphoneID){
  var client = new osc.Client(nconf.get('hand-OF-computer-ip'), nconf.get('osc-port-out')); client.send('/butterflyFinishWaitingHand',id,microphoneID);
}

// webserver
var express = require('express');
var app = express();
app.use( 
  "/", //the URL throught which you want to access to you static content
  express.static(__dirname+"/public") //where your static content is located in your filesystem
);
app.disable('etag');
app.listen(6001);

// Socket for spread peer id to others peers conected
function analizeWish(){
  this.debug = true;
  var self = this;
}

function wishManager(){
  // language analysis
  this.analyze = require('Sentimental').analyze;
  this.positivity = require('Sentimental').positivity;
  this.negativity = require('Sentimental').negativity;
  this.languageDetect = require('languagedetect');
  var emotionsObj = require('./emotions').EmotionLexicon;
  this.emotions = new emotionsObj();

  var swearFilterObj = require('./swear-filter').swearFilter;
  this.swearFilter = new swearFilterObj();

  // sockets
  this.io = require('socket.io').listen(7001);
  this.io.set('log level', 1);
  // database
  var WishMongo = require('./db_objects').WishMongo;
  this.wishDB = new WishMongo();

  var UDPListener = require('./udpListener').UDPListener;
  this.myUdpListener = new UDPListener(this.wishDB);

  var renderButterfly = require('./renderButterfly').renderButterfly;

  // general
  this.debug = true;
  var self = this;

  // call when a microphone get activated
  this.openMicrophone = function(microphoneID, exhibition_id, callback){
    id = "";
    var myDate = new Date();
    myDate.setHours(myDate.getHours() + nconf.get("hour_difference_greenwich"));
    this.wishDB.saveNewWish({
      microphoneID:microphoneID,
      exhibition_id: exhibition_id,
      status: 'openMicrophone',
      lang:nconf.get("lang"),
      time_openMicrophone: myDate
    }, function( error, id,microphoneID) {
      callback(microphoneID,id);
      console.log(id);
    });
    return id;
  };
  
  // call when speech API send words to system
  this.updateWords = function(id, text){
    this.wishDB.updateText(
    {
      'id': id,
      'text':text
    },function(){});
  };

  // call when a microphone get desactivated
  this.closeMicrophone = function(id,text){
    if(id!=undefined && id!="" && text!=""){
      var myDate = new Date();
      myDate.setHours(myDate.getHours() + nconf.get("hour_difference_greenwich"));
      var analyze = {'sentiment':this.analyze(text),'emotions':this.emotions.analyse(text)};
      console.log(analyze);
      var filterText = self.swearFilter.filter(text);
      // save in database
      this.wishDB.updateCloseAnalyze(
      {
        'id': id,
        'analyze':analyze,
        'text':text,
        'filterText':filterText,
        'status': 'renderCocoon',
        time_closeMicrophone: myDate
      },
      function(){
        // call rendering
        var renderer = new renderButterfly();
        renderer.start(id,analyze, function(){
          self.finishRenderButterfly(id);
        });
      });
    }
  };

  this.finishRenderButterfly = function(id){
    this.wishDB.updateDataById(id,function(err, data){
      if(err==null){
        console.log("emit::load-new-butterfly :"+data._id);
        self.io.sockets.emit('load-new-butterfly',{'microphoneID':data.microphoneID, 'wishID':data.id,'energy':data.analyze.sentiment.comparative});
      }else{
        console.log("error in => emit::new-butterfly ");
      }
    });
  };

  this.emitWishId = function(microphoneID,id){
    // For Chrome App speaking
    self.io.sockets.emit('newWishID',{'microphoneID':microphoneID, 'wishID':id});
    // For rendering cocoons
    self.io.sockets.emit('render-new-wish',{'microphoneID':microphoneID, 'wishID':id});
  };

  // socketIO methods
  this.io.sockets.on('connection', function (socket) {
    console.log("connected");
    self.socket = socket;

    socket.on('openMicrophone', function (data) {
      console.log('openMicrophone'+data);
      myWishManager.openMicrophone(data.microphoneID, nconf.get("exhibition_id"), self.emitWishId);
      // send to screen cocoons
      self.io.sockets.emit('openMicrophone',{'microphoneID':data.microphoneID});
    });

    socket.on('new-wish-words', function (data) {
      console.log('new-wish-words');
      console.log(data);
      var filterText = self.swearFilter.filter(data.text);
      if(data.text!=""){
        myWishManager.updateWords(data.wishID,data.text,filterText);
        // send to screen cocoons
        self.io.sockets.emit('render-new-words',{'wishID':data.wishID,'lastWords':data.lastWords,'microphoneID':data.microphoneID, 'text':filterText});
      }
    });

    socket.on('butterfly-to-flock', function (data) {
      console.log('butterfly-to-flock');
      self.io.sockets.emit('butterfly-to-flock', data);
    });

    socket.on('butterfly-added', function (data) {
      console.log('butterfly-added');
      self.io.sockets.emit('butterfly-added', data);
    });

    //var lastFlockBytes = [];
    //for (var i=0; i<6400; i++) lastFlockBytes[i] = 0;
    // Send last recorded flock UDP packet bytes to flocking server.    
    socket.on('last-flock', function() {
      lastFlockBytes = self.myUdpListener.getLastButterFlyPackage(function(err,lastFlockBytes){
        if(err==null){
          self.io.sockets.emit('last-flock', { 'bytes': lastFlockBytes });
        }
      });
    });

    socket.on('closeMicrophone', function (data) {
      console.log("closeMicrophone");
      console.log(data);
      myWishManager.closeMicrophone(data.wishID,data.text);
      // send to screen cocoons
      self.io.sockets.emit('closeMicrophone',{'microphoneID':data.microphoneID});
    });

    // this could be change to UDP
    socket.on('levelMicrophone', function (data) {
      // send to screen cocoons
      self.io.sockets.emit('levelMicrophone',{'microphoneID':data.microphoneID, 'wishID':data.id,'microphoneLevel':data.level});
    });

    // one butterfly available
    socket.on('butterfly-available', function (data) {
      console.log("newButterflyWaitingforHand");
      console.log(data);
      //sendOSCMessageNewButterfly(data.wishID,data.position.x,data.position.y,data.position.z,data.microphoneID);
      //cocoonLookingForHand['microphoneID'+data.microphoneID] = true;
      self.io.sockets.emit('butterfly-available',data);
    });

    socket.on('butterfly-not-available', function (data) {
      self.io.sockets.emit('butterfly-not-available',data);
    });

    socket.on('take-butterfly', function (data) {
      self.io.sockets.emit('take-butterfly',data);
    });

    socket.on('hand-lost', function (data) {
      self.io.sockets.emit('hand-lost',data);
    });

    socket.on('remove-repulsor-cocoon', function (data) {
      self.io.sockets.emit('remove-repulsor-cocoon',data);
    });

    socket.on('add-repulsor-cocoon', function (data) {
      self.io.sockets.emit('add-repulsor-cocoon',data);
    });

    /*
    socket.on('updateButterflyWaitingforHand', function (data) {
      console.log("newButterflyWaitingforHand");
      console.log(data);
      sendOSCMessageUpdateButterfly(data.wishID,data.x,data.y,data.z,data.microphoneID);
    });
    */

    // one butterfly available
    socket.on('newButterflyFinishWaitingforHand', function (data) {
      console.log("newButterflyFinishWaitingforHand"+data);
      sendOSCMessageButterflyFinishWaitingHand(data.wishID,data.microphoneID);
      cocoonLookingForHand['microphoneID'+data.microphoneID] = true;
    });
  });
}

var myWishManager = new wishManager();