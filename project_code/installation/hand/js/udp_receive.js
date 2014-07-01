 function UdpListener(){
	var socketId;
	var self = this;

	this.onReceive = function(info) {
	    if (info.socketId !== socketId)
			return;
		butterflyData = info.data;
		//updateButterflies(butterflyData);
		var strData = String.fromCharCode.apply(null, new Uint8Array(butterflyData));
		// console.log( strData );
		var data = JSON.parse(strData);

		hands[data.microphoneID-1].obj.update(data);
	};

	this.create = function() {
		var socketCloser = function(sockets) {
			// recursive close all ports before open 
			if (sockets.length > 0) {
				var s = sockets.pop();
				console.log(s);
				chrome.sockets.udp.close(s.socketId, function() { socketCloser(sockets); } );
				return;
			}
			console.log('all sockets closed');
			chrome.sockets.udp.create({bufferSize:6400}, function (socketInfo) {
				// The socket is created, now we can send some data
				socketId = socketInfo.socketId;
				var tryBind = function() {
					chrome.sockets.udp.bind(socketId, "0.0.0.0", portUdpListener, function(result) {
					    if (result < 0) {
							console.log("Error binding socket.");
							setTimeout(tryBind, 3000);
							return;
					    }
					    console.log('socket bound');
					    
						chrome.sockets.udp.onReceive.addListener(self.onReceive);
					    
					});
				};
				tryBind();
			});
		};
		chrome.sockets.udp.getSockets(socketCloser);
	}

	this.close = function(){
		chrome.sockets.udp.close(socketId, function(){});
	};

	this.create();
}