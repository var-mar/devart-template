$( document ).ready(function() {
	 var screenId = 5;
	 var mySyncro = new screenSyncronizer(screenId,5);
	 var WIDTH = 32;
	 var pixelsUint8Temp128Position = new Uint8Array(WIDTH * WIDTH ); //* 4 *4

	 setInterval(function(){sendArray();},10);
	 function sendArray(){
	 	mySyncro.sendMessageToAllPeers(pixelsUint8Temp128Position);
	 }
});
