function clientUDP(){
	var self =  this;
	var socketId;
	this.scoketBind = false;
	var countSend = 0;

	this.create = function(){
		var socketCloser = function(sockets) {
			if (sockets.length > 0) {
				var s = sockets.pop();
				console.log(s);
				chrome.sockets.udp.close(s.socketId, function() { socketCloser(sockets); } );
				return;
			}
			console.log('all sockets closed');
			chrome.sockets.udp.create({bufferSize:2}, function (socketInfo) {
				// The socket is created, now we can send some data
				socketId = socketInfo.socketId;
				chrome.sockets.udp.bind(socketId, "0.0.0.0", 3010, function(result) {
					if (result < 0) {
						console.log("Error binding socket.");
						return;
					}
					console.log('socket bound');
					self.scoketBind = true;
				});
			});
		};
		chrome.sockets.udp.getSockets(socketCloser);
	};

	this.sendHandler = function(sendInfo) {
		// console.log("sent " + sendInfo.bytesSent);
		if (sendInfo.resultCode < 0) {
			console.log("Error listening: " + chrome.runtime.lastError.message);
		}
	};

	this.send = function(buf){
		if(self.scoketBind){
			for(var i=0; i<ipForUDPListen.length; i++) {
				chrome.sockets.udp.send(socketId, buf, ipForUDPListen[i].ip, ipForUDPListen[i].port, this.sendHandler);
			}
		}
		countSend += 1;
	};

	this.counterMessages = function(){
		// display
		document.getElementById("countSend").innerHTML = countSend.toString();
		// reset counters 
		countSend = 0;
	}
	
	this.close = function(){
		chrome.sockets.udp.close(socketId, function(){});
	};

	// Open socket
	this.create();
	setInterval(function(){self.counterMessages();}, 1000);
}
