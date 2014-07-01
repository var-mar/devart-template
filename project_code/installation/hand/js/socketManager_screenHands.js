var socket;

/*

  Hands - How this works

  <cocoon> butterfly-available X
  <hand screen> take-butterfly X
  
  hand screen: show butterfly X

  <hand screen> hand-lost X
  <cocoon> butterfly-to-flock X

*/

var takeButterfly = function(id) {
  console.log('emit take-butterfly', {microphoneID: id});
  socket.emit('take-butterfly', {microphoneID: id});
}

var handLost = function(id, position) {
  console.log('emit hand-lost', {microphoneID: id, position: position});
  socket.emit('hand-lost', {microphoneID: id, position: position});
}

function setupSocket(){

  socket = io.connect('http://'+ipServer+':7001');

  var reconnect = function() {
    socketConnectTimeInterval = setInterval(function () {
      socket.socket.reconnect();
      if(socket.socket.connected) {clearInterval(socketConnectTimeInterval);}
    }, 3000);
  };

  // try to connect many times until enter
  var socketConnectTimeInterval = setInterval(reconnect, 3000);
  var counterReceived = 0;

  //socket.set("reconnection limit", 5000);
  socket.on('connect', function() {
    console.log("connected");
    clearInterval(socketConnectTimeInterval);
  });

  socket.on('butterfly-available',function(data){
    console.log("butterfly-available", data);
    var id = atob(data.wishID);
    var idU8Arr = [];
    for (var i=0; i<id.length; i++) {
      idU8Arr[i] = id.charCodeAt(i);
    }
    butterflies[data.microphoneID-1].butterflyStatus.setId(idU8Arr);
    availableMics[data.microphoneID] = true;
  });

  socket.on('butterfly-not-available',function(data){
    console.log("butterfly-not-available", data);
    hideBfly(data.microphoneID-1);
    delete availableMics[data.microphoneID];
  });
    
  socket.on('load-new-butterfly',function(data){
    console.log("load-new-butterfly", data);
    butterflyImageLoader.load('http://' + ipServer + ':6001/butterflyTextures/'+ data.wishID+ '.png', function(image){ /* do nothing */ });
    var id = atob(data.wishID);
    var idU8Arr = [];
    for (var i=0; i<id.length; i++) {
      idU8Arr[i] = id.charCodeAt(i);
    }
    butterflies[data.microphoneID-1].butterflyStatus.setId(idU8Arr);
  });

  socket.on('disconnect', function() {
    socketConnectTimeInterval = setInterval(function () {
      socket.socket.reconnect();
      if(socket.socket.connected) {clearInterval(socketConnectTimeInterval);}
    }, 3000);
  });

}