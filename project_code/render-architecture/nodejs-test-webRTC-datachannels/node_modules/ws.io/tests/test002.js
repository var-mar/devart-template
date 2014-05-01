var fs = require('fs');
var url = require('url');
var app = require('http').createServer(function(req, res) {
	console.log('http server ok.');
    var resource = url.parse(req.url).pathname;
	fs.readFile(resource, function(err, data) {
		if(!err) {
			res.setHeader('Content-Type', 'text/html');
			res.writeHead(200);
			res.end(data);
		} else {
			res.writeHead(500);
			res.end();
		};
	})
});

var io = require('../').listen(app);

io.sockets.on('connection', function(socket) {
	console.log('client received socket: '+socket.sid);
	socket.on('echo', function(data) {
		console.log(socket.sid + ' onecho: ' + data);
		socket.broadcast.emit('echo', data);
	});  
});

app.listen(8443);
