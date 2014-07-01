// ------------------------------------

function butterflyAvailableForHand(id, butterfly) {
	console.log("Butterfly available", id);
	var idU8a = butterfly.butterflyStatus.id;
	var str = String.fromCharCode.apply(null, idU8a);
	str = btoa(str);
	socket.emit("butterfly-available", { microphoneID: id, wishID: str });
}

function butterflyNotAvailableForHand(id, butterfly) {
	console.log("Butterfly not available anymore", id);
	var idU8a = butterfly.butterflyStatus.id;
	var str = String.fromCharCode.apply(null, idU8a);
	str = btoa(str);
	socket.emit("butterfly-not-available", { microphoneID: id, wishID: str });
}

var nextPacketCallbacks = [];
var cocoonsWaitingForAdd = {};
var cocoonWaitCounter = 0;
function addButterflyToFlock(id, butterfly) {
	console.log("butterfly-to-flock", id, debugTextCounter);
	var status = butterfly.butterflyStatus.status;
	var arr = [];
	status.position.copy(butterfly.group1.parent.position);
	status.position.add(butterfly.group1.position);
	butterfly.butterflyStatus.serializeStatus(status, arr);
	var sid = String.fromCharCode.apply(null, butterfly.butterflyStatus.id);
	sid = btoa(sid);
	socket.emit("butterfly-to-flock", { microphoneID: id, wishID: sid, status: arr, energy: butterfly.butterflyStatus.energy });
	var sendTime = Date.now();
	var cwc = cocoonWaitCounter++;
	cocoonsWaitingForAdd[id] = cwc;
	var waiter = function(){ 
		if (cocoonsWaitingForAdd[id] === cwc) {
			console.log("butterfly-to-flock", id);
			socket.emit("butterfly-to-flock", { microphoneID: id, wishID: sid, status: arr, energy: butterfly.butterflyStatus.energy });
			setTimeout(waiter, 1000);
		}
	};
	setTimeout(waiter, 1000);
}

function setupSocket(){
	var self = this;
	window.socket = io.connect('http://'+ipServer+':7001');
	console.log("Server is "+ipServer+":7001");

	var reconnect = function() {
		socketConnectTimeInterval = setInterval(function () {
		  socket.socket.reconnect();
		  if(socket.socket.connected) {clearInterval(socketConnectTimeInterval);}
		}, 3000);
	};

	// try to connect many times until enter
	var socketConnectTimeInterval = setInterval(reconnect, 3000);

	// stop trying to reconnect when connect
	socket.on('connect', function (data) {
		console.log("connected websocket");
		clearInterval(socketConnectTimeInterval);
	});

	socket.on('butterfly-added', function(data) {
		console.log('butterfly-added', data);
		var cocoon = cocoons[data.microphoneID-1];
		cocoonsWaitingForAdd[data.microphoneID] = null;
		cocoon.butterflyAddedCallback();
	});

	// when microphone is open, reset the cocoon in question
	socket.on('openMicrophone', function (data) {
		console.log('openMicrophone', data);
		cocoons[parseInt(data.microphoneID)-1].myTextCocoon.setNewWish('');
		cocoons[parseInt(data.microphoneID)-1].myTextCocoon.setNewWish('');
	});

	// Draw new words
	socket.on('render-new-words', function (data) {
		console.log('render-new-words', data);
		cocoons[parseInt(data.microphoneID)-1].myTextCocoon.updateText(data.text);
	});

	// Finish adding words to a cocoon
	socket.on('closeMicrophone', function (data) {
		console.log("closeMicrophone", data);
		var cocoon = cocoons[data.microphoneID-1];
		cocoon.finishSpeech();
	});

	var _u8id = new Uint8Array(18);

	// Set cocoon butterfly to use this texture
	socket.on('load-new-butterfly', function(data){
		console.log("load-new-butterfly", data);
		var cocoon = cocoons[data.microphoneID-1];

		cocoon.finishSpeech();

		var id = atob(data.wishID);
		for (var i=0; i<_u8id.length; i++) {
			_u8id[i] = id.charCodeAt(i);
		}
		cocoon.setId(_u8id);
		cocoon.setEnergy(data.energy);
	});

	// Butterfly has left hand, let it fly
	socket.on('hand-lost',function(data){
		console.log('hand-lost', data);
		var cocoon = cocoons[data.microphoneID-1];
		var p = data.position;
		moveBflyPP(data.microphoneID-1, p);
		cocoon.handPosition = p;
		cocoon.butterflyOutOfHand();
	});

	// Butterfly has left hand, let it fly
	socket.on('take-butterfly',function(data){
		console.log('take-butterfly', data);
		var cocoon = cocoons[data.microphoneID-1];
		cocoon.butterflyInHand();
	});

	socket.on('levelMicrophone',function(data){
		//console.log("levelMicrophone", data);

		//var cocoon = cocoons[data.microphoneID-1];
		/*
		if(data.microphoneID!=undefined){
			cocoonHeart[parseInt(data.microphoneID)-1].scale.x = data.microphoneLevel/100.0;
			cocoonHeart[parseInt(data.microphoneID)-1].scale.y = data.microphoneLevel/100.0;
			cocoonHeart[parseInt(data.microphoneID)-1].scale.z = data.microphoneLevel/100.0;
		}
		*/
	});

	// When disconnected then this tries to reconnect
	socket.on('disconnect', function() {
		console.log("disconnected");
		socketReConnectTimeInterval = setInterval(function () {
			socket.socket.reconnect();
			if (socket.socket.connected) {
				clearInterval(socketReConnectTimeInterval);
				console.log("reconnected");
			}
		}, 3000);
	});

}