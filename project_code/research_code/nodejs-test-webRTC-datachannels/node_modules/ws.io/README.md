ws.io
=====

A simple wrap to node.js ws module and then we can use it in a manner like socket.io. It's really easy to use socket.io but it doesn't support Blob yet. So I write a simple wrap to ws module for this purpose. This is also a part of works from a contest by ithelp.ithome.com.tw.

Features:
---------
1. trnasfer Blob/ArrayBuffer by put it in an object and emit it just as socket.io
2. broadcast to all but not me
3. emit to specified peer by socket.to(socket.id).emit('event', data)
4. join/leave/in room
5. in-memory store

Limits:
-------
1. can only send one Blob/ArrayBuffer within one emit
2. the Blob/ArrayBuffer object must be a property of the emitting object in the first level, no deeper
3. no configuration support
4. no 3rd party data store support
5. cannot scale (due to current sockets management and store design)
6. client support is now through a static url: /ws.io/ws.io.js

install
=======

<pre>
npm install ws.io
</pre>

usage
=====
a simple echo server. (echo.js)
<pre>
var app = require('http').createServer(handler),
io = require('./ws.io').listen(app);
app.listen(8443);

function handler (req, res) {
	res.setHeader('Content-Type', 'text/html');
	res.writeHead(200);
	res.end(
		"&lt;!DOCTYPE html>"+
		"&lt;html>"+
		"&lt;head>"+
		"&lt;script src='/ws.io/ws.io.js'>&lt;/script>"+
		"&lt;script>"+
		"var socket = io.connect('ws://localhost:8443');"+
		"socket.on('echo', function(data) {"+
		"	alert(data);"+
		"});"+
		"&lt;/script>"+
		"&lt;body>"+
		"&lt;button id='echo'>echo&lt;/button>"+
		"&lt;/body>"+
		"&lt;/html>"+
		"&lt;script>"+
		"var button = document.getElementById('echo');"+
		"button.onclick = function() {"+
		"	socket.emit('echo', 'hello echo server.');"+
		"}"+
		"&lt;/script>"
	);
}

io.sockets.on('connection', function (socket) {
	socket.on('echo', function(data) {
		socket.emit('echo', data);
	});
});
</pre>


a simple blob sharing through file api. (blob.js)
<pre>
var fs = require('fs'),
url = require('url'),
app = require('http').createServer(function(req, res) {
	res.setHeader('Content-Type', 'text/html');
	res.writeHead(200);
	res.end(
		"&lt;!DOCTYPE html>"+
		"&lt;html lang='en'>"+
		"&lt;meta charset='utf-8'>"+
		"&lt;head>"+
		"&lt;style>"+
		"#panel {"+
		"	border: solid 1px #336699;"+
		"	line-height: 20px;"+
		"	vertical-align: middle;"+
		"	padding: 5px;"+
		"	border-radius: 5px;"+
		"}"+
		"&lt;/style>"+
		"&lt;script src='/ws.io/ws.io.js'>&lt;/script>"+
		"&lt;/head>"+
		"&lt;body>"+
		"&lt;input type='file' id='files'>&lt;br>"+
		"&lt;div id='panel'>&lt;ul id='list'>&lt;/ul>&lt;/div>"+
		"&lt;/body>"+
		"&lt;/html>"+
		"&lt;script>"+
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
		"&lt;/script>"
	);
}),
io = require('ws.io').listen(app);

io.sockets.on('connection', function(socket) {
	socket.on('share', function(data) {
		socket.broadcast.emit('share', data);
	});
});

app.listen(8443);
</pre>