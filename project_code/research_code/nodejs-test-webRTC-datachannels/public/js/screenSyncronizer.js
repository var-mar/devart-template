function screenSyncronizer(screenId,totalScreens,serverPath,callbackRender){
  //
  this.peerId; // string id
  this.peer;// object 
  this.screenId = screenId; // string id
  this.screensAr = new Array();
  for(var i=1;i<=totalScreens;i++){
    this.screensAr.push({'conn':null,'peerId':null,'screenId':i.toString()});
  }
  this.debug = false;
  this.serverPath = serverPath; 
  this.callBackRender = callbackRender;
  this.sendCounter = 0;
  this.counterReconects = 0;
  var self = this;

  //---------------------------------------------------------------------------
  // socket.io
  this.socket = io.connect('http://'+self.serverPath+':9001');
  this.socket.on('new-connection', function (data) {
    if(self.debug)console.log('new-connection');
    self.socket.emit('ids', { "id": self.peerId,"screenId":self.screenId });
  });

  this.socket.on('ids', function (data) {
    var peerId = data.id.id;
    var _screenId = data.id.screenId;
    //if(self.debug) console.log("ids = peerId:"+peerId+" screenId"+_screenId); 
    self.saveByScreenId({'peerId':peerId,'screenId':_screenId});
    //if(self.checkAllScreens()){
      //self.sendMessageToAllPeers('ready-'+self.screenId.toString());
    //}
  });

  this.socket.on('show-stats', function (data) {
    $("#stats").show();
  });
  this.socket.on('hide-stats', function (data) {
    $("#stats").hide();
  });

  this.emitPeerId = function(){
    self.socket.emit('ids', { "id": self.peerId,"screenId":self.screenId });
  }
  //setInterval(function(){self.emitPeerId();},5000);

  //---------------------------------------------------------------------------
  // webRTC
  
  //this.peer = new Peer( {host: '192.168.0.5', port: 9000, path: '/'});

  this.peer = new Peer( {
    // Set API key for cloud server (you don't need this if you're running your
    key: '11kuce8324ndn29',

    // Set highest debug level (log everything!).
    debug: 3,

    /*type:'data',*/

    // Set a logging function:
    logFunction: function() {
      var copy = Array.prototype.slice.call(arguments).join(' ');
      $('.log').append(copy + '<br>');
    }
  });

  
  // get id from webRTC
  this.peer.on('open', function(id){
    self.peerId = id;
    if(self.debug) console.log('My peer ID is:' + self.peerId);
    //peer.connect(peerId); 
    self.socket.emit('ids', { 'id': self.peerId });
    $("#myPeerId_label").html(self.peerId);
  });  

  // receive alldata
  this.peer.on('connection', function(conn) {
      conn.on('data', function(data){
        //console.log("something arrived");
        if(typeof(data.message)=="string" ){
          if(self.debug) console.log("==> receive-data! str:"+data.message);
          self.counterDataReceivedString += 1;
        }else{
          self.counterDataReceivedArray += 1;
          //var pixels = new Uint8Array(data.buffer);
          if(self.debug) console.log("===> receive-data!"+typeof(data)+" "+data+" "+data.message);
          //console.log(data);
          
          var posVelAr = new Uint8Array(data.message);
          console.log(posVelAr.length);
          if(posVelAr[0]==234 && posVelAr[1]==31 ){
            //console.log("arrive data ok");
          }
          var posVelAr = null;
          //if(.length==16384 && self.callBackRender!=null){
          //  self.callBackRender();
          //}
          //BinaryPack.free(data);
          //eraseBuffer(data);
          //data = null;
        }
      });
      
      conn.on('close', function(){
        if(self.debug)console.log("close peerId");
        if(self.debug)console.log(this.peer);
        self.saveByConnPeer(this);
      });

      conn.on('error', function(err){
        if(self.debug)console.log("Error peerId");
        if(self.debug)console.log(err);
      });
  });
  // delete peer
  window.onunload = window.onbeforeunload = function(e) {
  if (!!this.peer && !this.peer.destroyed) {
    this.peer.destroy();
  }
  };
  //---------------------------------------------------------------------------
  
  this.notifyFrameReady = function(){
    self.screensAr[4].conn.send("render-ready");
  }
  //---------------------------------------------------------------------------
  // metrics performance
  this.frameCalculator = function(){
    $("#fpsReceiveWebRTCString_label").html(self.counterDataReceivedString);
    $("#fpsReceiveWebRTCArray_label").html(self.counterDataReceivedArray);
    self.counterDataReceivedString = 0;
    self.counterDataReceivedArray = 0;
  }
  this.counterDataReceivedString = 0;
  this.counterDataReceivedArray = 0;
  setInterval(function(){self.frameCalculator();},1000);
  
  //---------------------------------------------------------------------------
  // debug display
  this.display = function (){
    if($("#myPanel").length == 0) {
      if(self.debug) console.log("add");
      $("body").append('<div id="myPanel"></div>');
      $("#myPanel").append('<div id="totalScreens">TotalScreens: <span id="totalScreens_label">'+totalScreens.toString()+'</span></div>');
      $("#myPanel").append('<div id="myPeerId">My PeerId: <span id="myPeerId_label"></span></div>');
      $("#myPanel").append('<div id="peerList"></div>');
      $("#myPanel").append('<div id="logWebRTC"></div>');
      $("#myPanel").append('<div id="fpsWebRTC">FPS-IN-A: <span id="fpsReceiveWebRTCArray_label"></span><br>FPS-IN-S: <span id="fpsReceiveWebRTCString_label"></span><br> FPS-OUT: <span id="fpsSendWebRTC_label"></span></div>');
      $("#myPanel").append('<div id="reconnectToPeer">Counter reconnect to peer: <span id="reconnectToPeer_label"></span></div>');
      if(self.debug) $("#myPanel").show();
    }
  }
  this.display();
  //---------------------------------------------------------------------------
  // look if id is in the array
  this.saveByScreenId = function (object){
    $("#peerList").html("");
    for(var i=0;i<self.screensAr.length;i++){
      if(self.screensAr[i].screenId == object.screenId){
        // open conection if is close
        if(self.screensAr[i].conn ==null || self.screensAr[i].conn.open == false || self.screensAr[i].peerId != object.peerId  ){ 
          self.counterReconects +=1;
          if(self.screensAr[i].conn !=null) self.screensAr[i].conn.close();
          $("#reconnectToPeer_label").html(self.counterReconects);
          // make connection to store it
          if(self.debug) console.log("reconnect");
          var conn = self.peer.connect(object.peerId,{
                    serialization: 'binary',
                    reliable: false,
                    ordered: false, 
                    maxRetransmits: 0
                }); 
          conn.on('open', function(){
            if(self.debug) console.log("open");
            //this.send("hi-from-connect");
            self.saveByConnPeer(this);
          });
          self.screensAr[i].conn = conn;
        }
        self.screensAr[i].peerId = object.peerId;
        //if(self.debug) console.log("Update peerId:"+object.peerId+" screen:"+object.screenId);
      }
      $("#peerList").append('screen'+(i+1).toString()+': '+self.screensAr[i].peerId+'<br>');
    }
  }

  this.saveByConnPeer = function (conn){
    for(var i=0;i<self.screensAr.length;i++){
      if(self.screensAr[i].peerId == conn.peer){
        if(!conn.open ){
          self.screensAr[i].conn = null;
        }else{
          self.screensAr[i].conn = conn;
          self.screensAr[i].conn.send("hi-from-save");
        }
        break;
      }
    }
  }

  this.checkAllScreens = function (object){
    count = 0;
    for(var i=0;i<self.screensAr.length;i++){
      if(self.screensAr[i].peerId != null){
        count +=1;
      }
    }
    if(count==(totalScreens-1)){
      return true;
    }
    return false;
  }

  // send to all screens
  this.sendMessageToAllPeers = function (_message){
    for(var i=0;i<self.screensAr.length;i++){
      if(i!=(self.screenId-1) && self.screensAr[i].conn!= null){
        if (self.screensAr[i].conn.open) {
          self.screensAr[i].conn.send({
                                //id: self.sendCounter,
                                //time: new Date().getTime(),
                                message: _message
                            });

          self.sendCounter +=1;
          //console.log("send message:"+message);  
        }else{
          if(self.debug) console.warn('Connection to '+self.screensAr[i].conn.peer+' is closed, cannot send message ');
        }
      }
    }
  }

}  