var express = require('express');
var app = express();
app.use(
  "/", //the URL throught which you want to access to you static content
  express.static(__dirname+"/public") //where your static content is located in your filesystem
);
app.listen(3000);

//http://support.ludei.com/hc/communities/public/questions/200727423-Binary-Websocket-Support-still-not-supported-
var WebSocketServer = require('ws').Server;

var wss = new WebSocketServer({
	port: 8083,
	host: '192.168.0.5'
});

wss.broadcast = function(data) {
    for(var i in this.clients){
    	console.log("send to client");
        this.clients[i].send(data, {binary: true, mask: false});
    }
};

// some array for connected sockets
wss.on("connection", function(socket) {
	console.log("SERVER: Connection established!");

	socket.onmessage = function(event) {
		// broadcast
		for(i=0;i<wss.clients.length;i++){
			try{
				wss.clients[i].send(event.data, {binary: true, mask: false});
			}catch (e) {
    			// handle error
			}
		}
	}
});

wss.on('close', function() {
    console.log('disconnected');
});
