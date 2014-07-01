var audioSource = new Array();
var source;
function gotSources(sourceInfos) {
    for (var i = 0; i != sourceInfos.length; ++i) {
        var sourceInfo = sourceInfos[i];
        if (sourceInfo.kind === 'audio') {
            audioSource .push(sourceInfo.id);
        }else {
            console.log('Some other kind of source: ', sourceInfo);
        }
    }
}

function setupWebSpeechApi(){
  this.lastIndex = 0;
  this.microphoneID = 0;
  this.isStarted = false;
  this.isFreeToListenNewWish = true;

  var self = this;
 	// Code from your microphone choose
 	if (typeof MediaStreamTrack === 'undefined'){
  		alert('This browser does not support MediaStreamTrack.\n\nTry Chrome Canary.');
 	} else {
  		MediaStreamTrack.getSources(gotSources);
 	}
	
  var constraints = {
    audio: {
      optional: [{sourceId: audioSource[0]}]
    }
  };
 	
 	navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
 	//navigator.getUserMedia(constraints, successCallback, errorCallback);
 	// Start Web Speech Api
	this.speech = new webkitSpeechRecognition();
  this.speech.continuous = true;
  this.speech.interimResults = true;
     this.speech.lang = "en-US";

  this.speech.onresult = function (event)
  {
    var transcript = '';
    for (var i = event.resultIndex; i < event.results.length; ++i) {
      transcript += event.results[i][0].transcript;
    }
    // after first stop
    if(event.resultIndex>0){
      self.speech.stop();
      this.isStarted = false;
      this.isFreeToListenNewWish = false;
    }else{
      console.log("transcript:"+transcript)
      cocoons[self.microphoneID].updateText(transcript);
      document.getElementById('transcriptions').innerHTML += transcript+"<br>"; 
    }
  };
  
  this.speech.onend = function ()
  {
    console.log("Fin speech");
    this.isStarted = false;
    cocoons[self.microphoneID].finishSpeech();
  };

  this.start = function(){
    if(!this.isStarted && this.isFreeToListenNewWish){
      this.speech.start();
    }
    this.isStarted = true;
    document.getElementById('transcriptions').innerHTML ="";
  };
  
  this.end = function(){
    this.speech.stop ();
    this.isStarted = false;
  };

  this.readyToGetWish = function(microphoneID){
    this.isFreeToListenNewWish = true;
  }
    
}

function chooseMicrophone(e){
   var key = e.keyCode ? e.keyCode : e.which;
   console.log("press key: "+e.keyCode);
   if (key == 49) {
       mySpeech.microphoneID = 0;
       mySpeech.start();
   }
   if (key == 50) {
       mySpeech.microphoneID = 1;
       mySpeech.start();
   }
   if (key == 51) {
       mySpeech.microphoneID = 2;
       mySpeech.start();
   }
   if (key == 13) {
      mySpeech.end();
   }
}

document.addEventListener("keyup", chooseMicrophone, false);
mySpeech = new setupWebSpeechApi();