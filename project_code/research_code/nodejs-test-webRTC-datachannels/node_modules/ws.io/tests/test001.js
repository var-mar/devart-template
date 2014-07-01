var fs = require('fs');
var app = require('http').createServer(function(req, res) {
	console.log('http server ok.');
	fs.readFile('./test001.html', function(err, data) {
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
	socket.on('echo', function(data) {
		socket.emit('echo', data);
	});  
});

app.listen(8443);