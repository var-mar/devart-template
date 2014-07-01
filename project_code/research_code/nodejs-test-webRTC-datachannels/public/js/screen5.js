$( document ).ready(function() {
	var screenId = 5;
	var WIDTH = 32;
	
	var mySyncro = new screenSyncronizer(screenId,totalScreens,ipServer,null);

	var pixelsUint8Temp128Position = new Uint8Array(6400); //WIDTH * WIDTH * 4 * 4 
	//console.log("Size package:"+((pixelsUint8Temp128Position.length*8)/1000).toString()+"kb");
	pixelsUint8Temp128Position[0] = 234;
	pixelsUint8Temp128Position[1] = 31;
	
	var counterDataSend = 0;
	sendArray = function(){
		
		//mySyncro.sendMessageToAllPeers(pixelsUint8Temp128Position);
		mySyncro.sendMessageToAllPeers("test-adasdasdasdasdasdasdasdasdasdasdkdjsafhjsadhfkjahsdkjfhaksdjhfljkasdhfkjhasdjkhfjashdjkfhasjkdhfjkahsjtest-adasdasdasdasdasdasdasdasdasdasdkdjsafhjsadhfkjahsdkjfhaksdjhfljkasdhfkjhasdjkhfjashdjkfhasjkdhfjkahsjdfhjdfhjkashdfkhaksjdhfkjashdfhsadkjhfjshdfkjhsdkjfhjskdhfjkshjdkfhsjkdhfjksdhfjsdhfjkshdfjshdjfhsdjfhsjkdhfsjkdhfjksdhfjkshdkfsdjhfjsdhfs");
		counterDataSend += 1;
		
	}
	setInterval(function(){sendArray();},10);

	frameCalculator = function(){
    	$("#fpsSendWebRTC_label").html(counterDataSend);
    	counterDataSend = 0;
  	}
  	setInterval(function(){frameCalculator();},1000);

  	showhideFPSstats = function(){

  	}

  	var myWindowTimeCounter = new counterTimeSinceStartWindow();

});
