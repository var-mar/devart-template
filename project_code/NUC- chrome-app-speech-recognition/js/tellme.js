  // steady stream of sentences:
  // - show sentence
  // - wait for pronounciation
  // - check for errors
  // - if ok, continue
  // - if errors, mark wrong words and accept clicks on wrong parts
  // - when click in wrong words, TTS them

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
    $scope.recognition.interimResults = false;
    $scope.recognition.onerror = $scope.onerror;
    $scope.recognition.onend = $scope.onend;
    $scope.recognition.onresult = $scope.onresult;
  }

  $scope.onerror = function(event) {
    $scope.$apply(function(scope) {
      console.log("on error", event);
      scope.state = 'error';
      scope.error = event.error;
    });
  };

  $scope.onend = function(event) {
    $scope.$apply(function(scope) {
      console.log("on end", event);
      scope.recognizing = false;
      scope.state = 'idle';
      scope.talkOrRetry = 'retry';
    });
    console.log("end");
  };

  $scope.onresult = function(event) {
    var transcript = '';
    for (var i = event.resultIndex; i < event.results.length; ++i) {
      transcript += event.results[i][0].transcript;
    }
    $scope.getWordDetected(transcript,$scope.recognizing);
    console.log("got ["+transcript+'] sentence, transcript=['+transcript+']', event);
    console.log("__________________________");
  };

  $scope.reset = function() {
    $scope.recognition.stop();
    $scope.recognizing = false;
    $scope.state = 'idle';
    $scope.wish = "";
  }

  $scope.start = function() {   
    if ($scope.recognizing) {
      $scope.reset();
      $scope.state = 'speaking';
    } else {
      $scope.state = 'speaking';
      $scope.recognition.lang = 'en_US';
      $scope.recognizing = true;
      $scope.recognition.start();
      $scope.wish = "";
      $scope.$apply(function(scope) {
        scope.wishLabel = $scope.wish;
      });
    }
  }

  $scope.end = function() {  
    $scope.recognition.stop();
  }

  $scope.init();
  console.log($scope);

  $scope.getWordDetected = function (words,status) {
    $scope.wish += words; 
    $scope.socket.emit("new-wish",{'lastWords':words,'wish':$scope.wish,'status-when-was-send':status});
    $scope.$apply(function(scope) {
      scope.wishLabel = $scope.wish;
    });
  }

  // socket.io
  $scope.socket = io.connect('http://localhost:7001');
}

