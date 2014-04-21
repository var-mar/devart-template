$( document ).ready(function() {
	 var screenId = 5;
	 var mySyncro = new screenSyncronizer(screenId,5,'192.168.0.5');
	 var WIDTH = 32;
	 var pixelsUint8Temp128Position = new Uint8Array(WIDTH * WIDTH * 4 *4); //
	 console.log("Size package:"+((pixelsUint8Temp128Position.length*8)/1000).toString()+"kb");
	 var counterDataReceived = 0;
	 var counterPackages = 0;
	 function sendArray(){
	 	mySyncro.sendMessageToAllPeers(pixelsUint8Temp128Position);
	 	counterPackages += 1;
	 	mySyncro.sendMessageToAllPeers("n-"+counterPackages.toString());
	 	counterDataReceived += 1;
	 }
	 setInterval(function(){sendArray();},40);

	frameCalculator = function(){
    	$("#fpsSendWebRTC_label").html(counterDataReceived);
    	counterDataReceived = 0;
  	}
  	setInterval(function(){frameCalculator();},1000);
});
