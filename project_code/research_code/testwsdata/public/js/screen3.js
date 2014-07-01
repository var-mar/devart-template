$( document ).ready(function() {
    var screenId = 3;
    var renderFrame = function(){
    	mySyncro.notifyFrameReady();
  	}
 	var mySyncro = new screenSyncronizer(screenId,totalScreens,ipServer,renderFrame);
 	var myWindowTimeCounter = new counterTimeSinceStartWindow();
 	var myFpsGraph = new fpsGraph();
});
