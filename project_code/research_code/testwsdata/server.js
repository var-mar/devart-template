var express = require('express');
var app = express();
app.use(
  "/", //the URL throught which you want to access to you static content
  express.static(__dirname+"/public") //where your static content is located in your filesystem
);
app.listen(3000);

// Socket for spread peer id to others peers conected
var io = require('socket.io').listen(3002);
io.set('log level', 1);
io.sockets.on('connection', function (socket) {
  console.log("connected to socket:");
   
  // show/hide all stats to all screens
  socket.on('share', function (data) {
    //io.sockets.emit('data-share',{d:data} );    
    io.sockets.emit('no',{id:data} ); 
  });
});