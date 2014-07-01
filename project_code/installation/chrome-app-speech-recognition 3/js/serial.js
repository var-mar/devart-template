
const serial = chrome.serial;

// Interprets an ArrayBuffer as UTF-8 encoded string data. 
var ab2str = function(buf) {
  var bufView = new Uint8Array(buf);
  var encodedString = String.fromCharCode.apply(null, bufView);
  return decodeURIComponent(escape(encodedString));
};

// Converts a string to UTF-8 encoding in a Uint8Array; returns the array buffer. 
var str2ab = function(str) {
  var encodedString = unescape(encodeURIComponent(str));
  var bytes = new Uint8Array(encodedString.length);
  for (var i = 0; i < encodedString.length; ++i) {
    bytes[i] = encodedString.charCodeAt(i);
  }
  return bytes.buffer;
};

////////////////////////////////////////////////////////
////////////////////////////////////////////////////////

var SerialConnection = function() {
  this.connectionId = -1;
  this.lineBuffer = "";
  this.boundOnReceive = this.onReceive.bind(this);
  this.boundOnReceiveError = this.onReceiveError.bind(this);
  this.onConnect = new chrome.Event();
  this.onReadLine = new chrome.Event();
  this.onError = new chrome.Event();
};

SerialConnection.prototype.onConnectComplete = function(connectionInfo) {
  if (!connectionInfo) {
    log("Connection failed.");
    return;
  }
  this.connectionId = connectionInfo.connectionId;
  chrome.serial.onReceive.addListener(this.boundOnReceive);
  chrome.serial.onReceiveError.addListener(this.boundOnReceiveError);
  this.onConnect.dispatch();
  console.log("connected device");
};

SerialConnection.prototype.onReceive = function(receiveInfo) {
  if (receiveInfo.connectionId !== this.connectionId) {
    return;
  }

  this.lineBuffer += ab2str(receiveInfo.data);

  var index;
  while ((index = this.lineBuffer.indexOf('\n')) >= 0) {
    var line = this.lineBuffer.substr(0, index+ 1);
    this.onReadLine.dispatch(line);
    this.lineBuffer = this.lineBuffer.substr(index + 1);
  }
};

SerialConnection.prototype.onReceiveError = function(errorInfo) {
  if (errorInfo.connectionId === this.connectionId) {
    this.onError.dispatch(errorInfo.error);
  }
};

SerialConnection.prototype.connect = function(path) {
  serial.connect(path, this.onConnectComplete.bind(this))
};

SerialConnection.prototype.send = function(msg) {
  if (this.connectionId < 0) {
    throw 'Invalid connection';
  }
  serial.send(this.connectionId, str2ab(msg), function() {});
};

SerialConnection.prototype.disconnect = function() {
  if (this.connectionId < 0) {
    throw 'Invalid connection';
  }
  serial.disconnect(this.connectionId, function() {});
};

////////////////////////////////////////////////////////
////////////////////////////////////////////////////////

var connection = new SerialConnection();
var devicePath = "";

connection.onConnect.addListener(function() {
  console.log('connected to: ' + devicePath);
  connection.send('1');
});

connection.onReadLine.addListener(function(line) {
  line = line.substr(0,1);
  if(line==='1'){
    console.log("start");
    myScope.start();
  }
  if(line==='0'){
    console.log("end");
    myScope.end();
  }
});

connection.onError.addListener(function() {
  console.log('Error: Serial');
});

function connect(devicePath){
  connection.connect(devicePath);
  console.log("Serial path:"+devicePath);
}

chrome.serial.getDevices(function(devices){
  // filter to take out of list bluetooth and find arduino that start by '/dev/tty ...'
  var eligibleDevices = devices.filter(function(devices) {
    return !devices.path.match(/[Bb]luetooth/) && devices.path.match(/\/dev\/tty/);
  });

  if(eligibleDevices.length>0){
    var devicePath = "";
    devicePath = eligibleDevices[0].path;
    connect(devicePath);
  }
});
/*
function log(msg) {
  var buffer = document.querySelector('#buffer');
  buffer.innerHTML += msg + '<br/>';
}

var is_on = false;
*/
