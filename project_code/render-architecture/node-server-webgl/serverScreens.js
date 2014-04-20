
// webserver to serves htmls with three.js codes
var express = require('express');
var app = express();
app.use(
  "/", //the URL throught which you want to access to you static content
  express.static(__dirname+"/public") //where your static content is located in your filesystem
);

app.listen(8000);

// WebRTC
var PeerServer = require('peer').PeerServer;
var server = new PeerServer({port: 9000, path: '/'});
server.on('connection', function(id) {
 console.log("connected to peer:"+id);
 server.emit("frame-render",1);
});

// Socket for spread peer id to others peers conected
var io = require('socket.io').listen(9001);
io.set('log level', 1);
io.sockets.on('connection', function (socket) {
  console.log("connected to socket:");
  socket.broadcast.emit('new-connection', { hello: 'world' });
  socket.on('ids', function (data) {
    console.log("emit event ids:"+data);
    socket.broadcast.emit('ids', { 'id': data });    
  });
});
