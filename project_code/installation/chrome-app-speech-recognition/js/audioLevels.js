function AudioLevels(_callback_newLevels){
    var self = this;
    this.context = new webkitAudioContext();
    this.levels = this.context.createJavaScriptNode(2048, 1, 1);
    this.analyser = this.context.createAnalyser();
    this.analyser.smoothingTimeConstant = 0.3;
    this.analyser.fftSize = 1024;
    this.callback_newLevels = _callback_newLevels;
    this.debug = false;

    this.levels.onaudioprocess = function (e) {
        var array = new Uint8Array(self.analyser.frequencyBinCount);
        self.analyser.getByteFrequencyData(array);
        var average = self.getAverageVolume(array);
        try{
            if(self.debug){ 
                console.log("average:"+average);
            }
            self.callback_newLevels(average);
        }catch(err){}
    };

    this.getAverageVolume = function (array) {
        var values = 0;
        var average;
        var length = array.length;
        for (var i = 0; i < length; i++) {
            values += array[i];
        }
        average = values/length;
        return average;
    };

    navigator.webkitGetUserMedia({
        audio: true
    }, function (stream) {
        self.source = self.context.createMediaStreamSource(stream);
        self.levels.connect(self.context.destination);
        self.source.connect(self.analyser);
        self.analyser.connect(self.levels);
    },// errorCallback
   function(err) {
        console.log("Error: " + err);
   });
}

// Display level in HTML and send through websocket
var lastUpdateMicrophone = Date.now();
// using object audio levels
var displayAudioLevels = function (average){
    document.getElementById('levels').innerHTML = 'Levels for input: '+average;
    if( Date.now()-lastUpdateMicrophone>100){
        if(myScope.state == 'speaking'){
            myScope.socket.emit("levelMicrophone",{'microphoneID':microphoneID, 'level':average});
        }
        lastUpdateMicrophone = Date.now();
        //console.log("send Message level microphone");
    }
};

var myAudioLevels = new AudioLevels(displayAudioLevels);