$( document ).ready(function() {
    var screenId = 4;
    var renderFrame = function(){
    	mySyncro.notifyFrameReady();
  	}
 	var mySyncro = new screenSyncronizer(screenId,totalScreens,ipServer,renderFrame);
 	var myWindowTimeCounter = new counterTimeSinceStartWindow();
 	var myFpsGraph = new fpsGraph();
});
