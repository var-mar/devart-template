function screenSyncronizer(screenId,totalScreens){
  //
  this.peerId;
  this.peer;
  this.screenId = screenId;
  this.screensAr = new Array();
  for(var i=1;i<=totalScreens;i++){
    this.screensAr.push({'conn':null,'peerId':null,'screenId':i.toString()});
  }
  this.last_time = 0;
  this.debug = true;
  var self = this;
  //---------------------------------------------------------------------------
  // socket.io
  this.socket = io.connect('http://192.168.0.5:9001',{reliable:false});
  this.socket.on('new-connection', function (data) {
    console.log('new-connection');
    self.socket.emit('ids', { "id": self.peerId,"screenId":self.screenId });
  });

  this.socket.on('ids', function (data) {
    var peerId = data.id.id;
    var screenId = data.id.screenId;
    console.log("ids = peerId:"+peerId+" screenId"+screenId); 
    self.saveNew({'peerId':peerId,'screenId':screenId});
    if(self.checkAllScreens()){
      self.sendMessageToAllPeers('ready-'+self.screenId.toString());
    }
  });

  this.emitPeerId = function(){
    self.socket.emit('ids', { "id": self.peerId,"screenId":self.screenId });
  }
  this.emitPeerId = function(){

  }

  setInterval(function(){self.emitPeerId();},5000);
  //---------------------------------------------------------------------------
  // webRTC
  this.peer = new Peer( {host: '192.168.0.5', port: 9000, path: '/'},{reliable:false});
  // get id from webRTC
  this.peer.on('open', function(id){
    self.peerId = id;
    console.log('My peer ID is:' + self.peerId);
    //peer.connect(peerId); 
    self.socket.emit('ids', { 'id': self.peerId });
    $("#myPeerId_label").html(self.peerId);
  });  
  // receive alldata
  this.peer.on('connection', function(conn) {
      conn.on('data', function(data){
        //console.log(typeof(data));
        //console.log("Who is:"+conn.peer+" data:"+data); 
        //
        var time = new Date().getMilliseconds(); //time in milliseconds
        var diff = 1000/(time-self.last_time);
        $("#fpsWebRTC_label").html(diff);
        self.last_time = time;
      });
  });
  //---------------------------------------------------------------------------
  // debug display
  this.display = function (){
    if($("#myPanel").length == 0) {
      console.log("add");
      $("body").append('<div id="myPanel"></div>');
      $("#myPanel").append('<div id="totalScreens">TotalScreens:<span id="totalScreens_label">'+totalScreens.toString()+'</span></div>');
      $("#myPanel").append('<div id="myPeerId">My PeerId:<span id="myPeerId_label"></span></div>');
      $("#myPanel").append('<div id="peerList"></div>');
      $("#myPanel").append('<div id="logWebRTC"></div>');
      $("#myPanel").append('<div id="fpsWebRTC">FPS:<span id="fpsWebRTC_label"></span></div>');
      if(self.debug) $("#myPanel").show();
    }
  }
  this.display();
  //---------------------------------------------------------------------------
  // look if id is in the array
  this.saveNew = function (object){
    $("#peerList").html("");
    for(var i=0;i<self.screensAr.length;i++){
      if(self.screensAr[i].screenId == object.screenId){
        if(self.screensAr[i].conn ==null || self.screensAr[i].peerId != object.peerId ){
          // make connection to store it
          var conn = self.peer.connect(object.peerId); 
            conn.on('open', function(){
            console.log("open");
            conn.send('hi!');
          });
          self.screensAr[i].conn = conn;
        }
        self.screensAr[i].peerId = object.peerId;
        console.log("Update peerId:"+object.peerId+" screen:"+object.screenId);
      }
      $("#peerList").append('screen'+(i+1).toString()+':'+self.screensAr[i].peerId+'<br>');
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
  this.sendMessageToAllPeers = function (message){
    //console.log("");
    for(var i=0;i<self.screensAr.length;i++){
      if(i!=(self.screenId-1) && self.screensAr[i].conn!= null){
        self.screensAr[i].conn.send(message);
      }
    }
  }

}


  