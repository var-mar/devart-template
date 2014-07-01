var myScope;

function TellMe($scope) {
  myScope = $scope;
  $scope.init = function() {
    if (window.NativeSpeechRecognition) {
      $scope.recognition = NativeSpeechRecognition;
      $scope.recognition.init();
    } else {
      $scope.recognition = new webkitSpeechRecognition();
    }
    $scope.recognition.continuous = true;
    $scope.recognition.interimResults = true;
    $scope.recognition.onerror = $scope.onerror;
    $scope.recognition.onend = $scope.onend;
    $scope.recognition.onresult = $scope.onresult;
    $scope.audioMessageActive = true;
  };

  $scope.onerror = function(event) {
    $scope.$apply(function(scope) {
      console.log("on error", event);
      scope.state = 'error';
      scope.error = event.error;
    });
    // leave microphone active again
    console.log("serial send 1");
    connection.send('1');
  };

  $scope.onend = function(event) {
    $scope.$apply(function(scope) {
      console.log("on end", event);
      scope.recognizing = false;
      scope.state = 'idle';
      scope.talkOrRetry = 'retry';
    });
    console.log("on end");
    if($scope.wish!=''){
      console.log("serial send 2");
      connection.send('2');
      $scope.closeMicrophoneTimeout = setTimeout(function(){
        console.log("serial send 1");
        connection.send('1'); 
      },60*1000);
    }else{
      console.log("serial send 1");
      connection.send('1');
    }
    $scope.socket.emit("closeMicrophone",{'microphoneID':microphoneID, 'wishID':$scope.wishID,'text':$scope.wish});
  };

  $scope.onresult = function(event) {
    var transcript = '';
    for (var i = event.resultIndex; i < event.results.length; ++i) {
      transcript += event.results[i][0].transcript;
    }
    $scope.getWordDetected(transcript,$scope.recognizing);
    console.log("got ["+transcript+'] sentence, transcript=['+transcript+']', event);
    console.log("__________________________");
    // after first stop
    if(event.resultIndex>0 ){
      $scope.end();
      console.log("serial send 2");
      connection.send('2');
    }
  };

  $scope.reset = function() {
    $scope.recognition.stop();
    $scope.recognizing = false;
    $scope.state = 'idle';
    $scope.wish = "";
  };

  $scope.start = function() {
    console.log("serial send 1");
    connection.send('1');
    if ($scope.recognizing) {
      $scope.reset();
      $scope.state = 'speaking';
    } else {
      $scope.socket.emit("openMicrophone",{'microphoneID':microphoneID});
      $scope.state = 'speaking';
      $scope.recognition.lang = 'en_US';
      $scope.recognizing = true;
      $scope.recognition.start();
      $scope.wish = "";
      try{
        $scope.$apply(function(scope) {
          scope.wishLabel = $scope.wish;
        });
      }catch(err){}
    }
  };

  $scope.end = function() {  
    $scope.recognition.stop();
  };
  
  $scope.init();

  $scope.getWordDetected = function (words,status) {
    $scope.wish = words; 
    $scope.socket.emit("new-wish-words",{'lastWords':words,'microphoneID':microphoneID,'wishID':$scope.wishID,'text':$scope.wish});
    $scope.$apply(function(scope) {
      scope.wishLabel = $scope.wish;
    });
  };

  // new reconnect socket
  // Socket.io - send all events to server
  $scope.socketConnected = false;
  $scope.socket = io.connect('http://'+hostWebSockets+':7001');

  var reconnect = function() {
    $scope.initialConnectInterval = setInterval(function () {
      $scope.socket.socket.reconnect();
      if($scope.socket.socket.connected) {clearInterval($scope.initialConnectInterval);}
    }, 3000);
  };

  // try to connect many times until enter
  $scope.initialConnectInterval = setInterval(reconnect, 3000);

  // stop trying to reconnect when connect
  $scope.socket.on('connect', function (data) {
    console.log("web socket-connected");
    clearInterval($scope.initialConnectInterval);
  });

  $scope.socket.on('disconnect', function() {
      $scope.socketConnectTimeInterval = setInterval(function () {
        $scope.socket.socket.reconnect();
        if($scope.socket.socket.connected) {clearInterval($scope.socketConnectTimeInterval);}
        console.log("try to reconnect socket.");
      }, 3000);
  });

  $scope.socket.on('newWishID',function(data){
    if(data.microphoneID==microphoneID){
      $scope.wishID = data.wishID;
      console.log("data.wishID"+data.wishID);
    }
  });

  $scope.socket.on('butterfly-to-flock',function(data){
    console.log('butterfly-to-flock');
    if(data.microphoneID==microphoneID){
      console.log("serial send 1");
      connection.send('1');
      clearInterval($scope.closeMicrophoneTimeout);
    }
  });
  
}
