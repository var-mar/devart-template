var fs = require('fs'),
url = require('url'),
app = require('http').createServer(function(req, res) {
	res.setHeader('Content-Type', 'text/html');
	res.writeHead(200);
	res.end(
		"<!DOCTYPE html>"+
		"<html lang='en'>"+
		"<meta charset='utf-8'>"+
		"<head>"+
		"<style>"+
		"#panel {"+
		"	border: solid 1px #336699;"+
		"	line-height: 20px;"+
		"	vertical-align: middle;"+
		"	padding: 5px;"+
		"	border-radius: 5px;"+
		"}"+
		"</style>"+
		"<script src='/ws.io/ws.io.js'></script>"+
		"</head>"+
		"<body>"+
		"<input type='file' id='files'><br>"+
		"<div id='panel'><ul id='list'></ul></div>"+
		"</body>"+
		"</html>"+
		"<script>"+
		"var files = document.getElementById('files');"+
		"var socket = io.connect('ws://localhost:8443');"+
		"function getUrl() {"+
		"	if(!!window.URL) {"+
		"		return window.URL;"+
		"	}"+
		"	if(!!window.webkitURL) {"+
		"		return window.webkitURL;"+
		"	}"+
		"}"+
		""+
		"files.addEventListener('change', function(e) {"+
		"	var URL = getUrl();"+
		"	if(files.files.length>0) {"+
		"		var file = files.files[0];"+
		"		if(file.type==='') {"+
		"			alert('File type unknown. Process stopped.');"+
		"			return false;"+
		"		}"+
		"		var src = URL.createObjectURL(file);"+
		"		var a = document.createElement('a');"+
		"		a.href = src;"+
		"		a.innerHTML = file.name;"+
		"		a.target = '_blank';"+
		"		var li = document.createElement('li');"+
		"		li.appendChild(a);"+
		"		document.getElementById('list').appendChild(li);"+
		"		socket.emit('share', {filename: file.name, type: file.type, file:file});"+
		"	}"+
		"});"+
		"var fileinfo;"+
		"socket.on('share', function(data) {"+
		"	var URL = getUrl();"+
		"	var a = document.createElement('a');"+
		"	var file = new Blob([data.file], {type:data.type});"+
		"	a.href = URL.createObjectURL(file);"+
		"	a.innerHTML = data.filename;"+
		"	a.target = '_blank';"+
		"	var li = document.createElement('li');"+
		"	li.appendChild(a);"+
		"	document.getElementById('list').appendChild(li);"+
		"});"+
		"</script>"
	);
}),
io = require('ws.io').listen(app);

io.sockets.on('connection', function(socket) {
	socket.on('share', function(data) {
		socket.broadcast.emit('share', data);
	});
});

app.listen(8443);