// send to server

function UDPManager(callback_receive, type, arrayIPs){
  this.socketId;
  this.socket = chrome.socket;// || chrome.experimental.socket;
  this.debug = false;
  this.port = 3007;
  this.ip = "237.132.123.123";
  this.callback_receive = callback_receive;
  this.arrayIPs = arrayIPs;
  this.type = type;
  var self = this;
  
  this.connect = function (){
    self.socket.create('udp', function(socketInfo) {
      self.socketId = socketInfo.socketId;
      self.socket.bind(self.socketId, "0.0.0.0", self.port, function(result) {
        if (result != 0) {
          self.socket.destroy(self.socketId);
          if(self.debug)console.log("Error on bind()");
        }
      });
    });
  }
  
  this.connectBroadcaster = function (buf){
    self.socket.create('udp', function(socketInfo) {
      self.socketId = socketInfo.socketId;
      self.socket.setMulticastTimeToLive(self.socketId, 12, function (result) {
          if (result != 0) {
            if(self.debug)console.log("Set TTL Error: ", "Unkown error");
          }else{
            if(self.debug)console.log("created broadcast");
          }
          self.socket.bind(self.socketId, "0.0.0.0", self.port, function (result) {
            self.socket.joinGroup(self.socketId, self.ip, function (result) {
            });
          });
      });
    });
  }
  
  this.send = function (buf){
    if(self.socketId!=undefined){
      if(self.type=='broadcast'){
        self.socket.sendTo(self.socketId, buf, self.ip, self.port, function(sendResult) {
          if(self.debug)console.log("sendTo", sendResult);
        });
      }else{
        for(var i=0;i<arrayIPs.length;i++){
          self.socket.sendTo(self.socketId, buf, arrayIPs[i], self.port, function(sendResult) {
            if(self.debug)console.log("sendTo", sendResult);
          });
        }
      }
    }
  }

  this.received = function (){
    if(self.socketId!=undefined){
      self.socket.recvFrom(self.socketId, 6400, function(recvFromInfo){ 
        if(recvFromInfo.resultCode >= 0)
        {
          self.callback_receive(recvFromInfo.data)
          if(self.debug)console.log("received");
        }else{
          if(self.debug)console.log("nothing to receive");
        }
      });
    }
  }

  this.close = function (){
    if(self.type=='broadcast'){
      chrome.socket.leaveGroup(self.socketId, self.ipBroadcast, function (){});
    }
    self.socket.destroy(self.socketId);
  }

  if(this.type=='broadcast'){
    this.connectBroadcaster();
  }else{
    this.connect();
  }
  setInterval(function(){self.received();},2);
  chrome.app.window.current().onClosed.addListener(self.close);
}

