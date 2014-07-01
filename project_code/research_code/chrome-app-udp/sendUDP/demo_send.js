var countSend = 0;
var countReceive = 0;

receiveMessages = function (msg){
	var ar = new Uint8Array(msg);
	console.log(ar.length);
	// divide in two arrays 3200
	countReceive += 1;
}

sendMessages = function (msg){
	// test sending
	var arr = new Uint8Array(6400);
	arr[0] = 123;
	arr[3200] = 129;
	var ab = arr.buffer;
	m.send(ab);
	countSend += 1;
}

function counterMessages(){
	// display
	document.getElementById("countSend").innerHTML = countSend.toString();
	document.getElementById("countReceive").innerHTML = countReceive.toString();
	//reset counters 
	countSend = 0;
	countReceive = 0;
}

var m = new UDPManager(receiveMessages,"",["192.168.0.15","192.168.0.14","192.168.0.10","192.168.0.5"]);
//var m = new UDPManager(receiveMessages,"broadcast");

setInterval(function(){sendMessages();},15);
setInterval(function(){counterMessages();},1000);

