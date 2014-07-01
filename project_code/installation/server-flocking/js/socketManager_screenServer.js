function setupSocket(server){

    console.log("trying to connected");
    websocket = io.connect('http://'+ipServer+':7001');

    //socket.set("reconnection limit", 5000);
    websocket.on('connect', function() {
      console.log("connected");
      websocket.emit('last-flock', {});
      clearInterval(socketConnectTimeInterval);
    });

    websocket.on('last-flock', function(data) {
      if (data.bytes && data.bytes.packageButterfly && data.bytes.packageButterfly.length === 6400) {
        var u8buf = new Uint8Array(f32buf);
        u8buf.set(data.bytes.packageButterfly);
        server.updateButterflies(f32buf);
      }
    });

    websocket.on('load-new-butterfly',function(data){
      console.log('load-new-butterfly', data);
      server.preloadNewButterfly(data.wishID);
    });

    websocket.on('butterfly-to-flock',function(data){
      console.log("butterfly-to-flock", data);
      try {
        server.addButterfly(data.wishID, data.status, data.energy);
      } catch(e) {
        console.log("Error adding butterfly", e);
      }
      console.log('emit butterfly-added',  {microphoneID: data.microphoneID});
      websocket.emit("butterfly-added", {microphoneID: data.microphoneID});
    });

    websocket.on('add-repulsor-cocoon',function(data){
      console.log('add-repulsor-cocoon');
      repulsorCocoons[data.microphoneID] = {'position': new THREE.Vector3(data.position.x,data.position.y,data.position.z)};
    });

    websocket.on('remove-repulsor-cocoon',function(data){
      console.log('remove-repulsor-cocoon');
      delete repulsorCocoons[data.microphoneID];
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