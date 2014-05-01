var app = require('http').createServer(handler),
	io = require('./ws.io').listen(app);
app.listen(8443);

function handler (req, res) {
	res.setHeader('Content-Type', 'text/html');
	res.writeHead(200);
	res.end("<!DOCTYPE html>"+
		"<html>"+
		"<head>"+
		"<script src='/ws.io/ws.io.js'></script>"+
		"<script>"+
		"var socket = io.connect('ws://localhost:8443');"+
		"socket.on('echo', function(data) {"+
		"	alert(data);"+
		"});"+
		"</script>"+
		"<body>"+
		"<button id='echo'>echo</button>"+
		"</body>"+
		"</html>"+
		"<script>"+
		"var button = document.getElementById('echo');"+
		"button.onclick = function() {"+
		"	socket.emit('echo', 'hello echo server.');"+
		"}"+
		"</script>");
}

io.sockets.on('connection', function (socket) {
	socket.on('echo', function(data) {
		socket.emit('echo', data);
	});
});
