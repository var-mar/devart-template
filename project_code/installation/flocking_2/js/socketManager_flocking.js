function setupSocket(){
  var websocket = io.connect('http://'+ipServer+':7001');

  var reconnect = function() {
    socketConnectTimeInterval = setInterval(function () {
      websocket.socket.reconnect();
      if(websocket.socket.connected) {clearInterval(socketConnectTimeInterval);}
    }, 3000);
  };

  // try to connect many times until enter
  var socketConnectTimeInterval = setInterval(reconnect, 3000);

  //socket.set("reconnection limit", 5000);
  websocket.on('connect', function() {
    console.log("connected");
    websocket.emit('last-flock', {});
    clearInterval(socketConnectTimeInterval);
  });

  websocket.on('load-new-butterfly',function(data){
    console.log("createButterfly"+data.wishID);
    butterflyImageLoader.load('http://' + ipServer + '/butterflyTextures/'+ data.wishID+ '.png', function(image){ /* do nothing */ });
  });

  websocket.on('disconnect', reconnect);
}