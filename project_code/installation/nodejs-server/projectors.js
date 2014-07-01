
// Start and close projectors NEC PA500U with serial
/*
PJLink
// http://pjlink.jbmia.or.jp/english/data/5-1_PJLink_eng_20131210.pdf

https://github.com/sy1vain/node-pjlink/
*/

var net = require('net');

function projector(ip){

	this.switchOn = function () {
		var command = "%1POWR 1\r";
	    this.sendPJLinkCommand(command);
	    projStatus = true; //projector on 
	}

	this.switchOff = function () {
		var command = "%1POWR 0\r";
		this.sendPJLinkCommand(command);
		projStatus = false; //projector off
	}
	
	this.sendPJLinkCommand = function (command) {
		this.client.write(command);
	}

	this.client = new net.Socket();
	this.client.connect(4352, ip, function() {
		console.log('Connected');
		
	});
	 
	this.client.on('data', function(data) {
		console.log('Received: ' + data);
		
	});
	 
	this.client.on('close', function() {
		console.log('Connection closed');
	});

	//this.client.destroy(); // kill client after server's response
}

myProjector = new projector('192.168.0.20');
myProjector.switchOff();