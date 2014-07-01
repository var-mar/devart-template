var countSend = 0;
var countReceive = 0;

receiveMessages = function (msg){
	var ar = new Uint8Array(msg);
	//console.log(ar.length);
	var arPosition = ar.subarray(0,-3200);
	var arVelocity = ar.subarray(3200,6400);
	console.log("position:"+arPosition.length+" - "+arPosition[0]);
	console.log("velocity:"+arVelocity.length+" - "+arVelocity[0]);
	// divide in two arrays 3200
	countReceive += 1;
}

function counterMessages(){
	// display
	document.getElementById("countSend").innerHTML = countSend.toString();
	document.getElementById("countReceive").innerHTML = countReceive.toString();
	//reset counters 
	countSend = 0;
	countReceive = 0;
}

var m = new UDPManager(receiveMessages,"broadcast");
setInterval(function(){counterMessages();},1000);

