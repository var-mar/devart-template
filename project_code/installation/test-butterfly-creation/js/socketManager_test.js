function setupSocket(){

    console.log("trying to connect");
    var websocket = io.connect('http://'+ipServer+':7001');

    var wishIDs = {};
    var words = "test";
    var wish = "hello";

    var createButterfly = function(id) {
      console.log('emit openMicrophone', {'microphoneID':id});
      websocket.emit("openMicrophone", {'microphoneID':id});
    };

    //socket.set("reconnection limit", 5000);
    websocket.on('connect', function() {
      console.log("connected");
      clearInterval(socketConnectTimeInterval);
      createButterfly(1);
      createButterfly(2);
      createButterfly(3);
    });

    websocket.on('load-new-butterfly',function(data){
      console.log('on load-new-butterfly', data);
      var wishID = wishIDs[data.microphoneID];
      var sendData = { 
        microphoneID: data.microphoneID,
        wishID: wishID,
        status: [0,0,0, 0,0,0, 0,0,0, 0,0],
        energy: 1
      };
      console.log('emit butterfly-to-flock', sendData);
      websocket.emit("butterfly-to-flock", sendData);
    });

    websocket.on('butterfly-added',function(data){
      console.log("on butterfly-added", data);
      createButterfly(data.microphoneID);
    });

    websocket.on('newWishID',function(data){
      console.log("on newWishID", data);
      wishIDs[data.microphoneID] = data.wishID;
      var wishID = wishIDs[data.microphoneID];
      var microphoneID = data.microphoneID;
      console.log('emit new-wish-words',{'lastWords':words,'microphoneID':microphoneID,'wishID':wishID,'text':wish});
      websocket.emit("new-wish-words",{'lastWords':words,'microphoneID':microphoneID,'wishID':wishID,'text':wish});
      console.log('emit closeMicrophone',{'microphoneID':microphoneID, 'wishID':wishID, 'text':wish});
      websocket.emit("closeMicrophone",{'microphoneID':microphoneID, 'wishID':wishID, 'text':wish});
    });

    websocket.on('disconnect', reconnect);

    var reconnect = function() {
      socketConnectTimeInterval = setInterval(function () {
        websocket.socket.reconnect();
        if(websocket.socket.connected) {clearInterval(socketConnectTimeInterval);}
      }, 3000);
    };

    // try to connect many times until enter
    var socketConnectTimeInterval = setInterval(reconnect, 3000);

};
setupSocket();