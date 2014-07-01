var availableMics = {};
var hands = {
	0: {position:{x: 0, y: 0, z: 0, xPx: 0, yPx: 0}, obj:new handButterflies(1)},
	1: {position:{x: 0, y: 0, z: 0, xPx: 0, yPx: 0}, obj:new handButterflies(2)},
	2: {position:{x: 0, y: 0, z: 0, xPx: 0, yPx: 0}, obj:new handButterflies(3)}
};

function hideBfly(id) {
	var b = butterflies[id];
	b.opacityTarget = 0;
	b.scaleTarget = 0.1;//0.01
}

function showBfly(id) {
	var b = butterflies[id];
	b.opacityTarget = 1;
	b.scaleTarget = 3;
}

function moveBfly(id, x, y, z) {
	var h = hands[id].position;
	h.x = x; h.y = y; h.z = z;
	var pp = detectedPointToPhysical(id, x, y, z);
	var p = physicalPointToHandProjector(pp);
	h.xPx = p.x;
	h.yPx = p.y;
	butterflies[id].position.set(p.x, p.y, 1);
}

function handButterflies(handId) {
	var tmpV = new THREE.Vector3();
	var lastPos = new THREE.Vector3();
	var lastReceive = Date.now();
	var lastData = null;
	var lastPc = null;
	var receiveTimeout = null;
	var maxTimeoutInHand = null;
	var self = this;
	this.handId = handId;
	this.butterflyId = handId-1;
	// -------------------------------------------
	this.sendBackToScreen = function(){
		this.butterflyGoBackScreen(lastData,lastPc,lastPos);
		delete availableMics[this.handId];
	};
	// -------------------------------------------
	this.update = function (data){
		if (this.handId !== data.microphoneID) {
			console.log('update: wrong microphoneID for this handButterflies');
			return;
		}
		// var handInfo = document.getElementById('hand-'+(data.microphoneID-1));
	    var pos = data.position;
	    butterflies[this.butterflyId].receivedHandMovement = true;
	    var pc = detectedPointToPhysical(this.butterflyId, pos.x, pos.y, pos.z);
	    
	    // check if can take butterfly to hand
	    if (Date.now() - lastReceive > 1000) {
	    	if (data.isTouchingWall == 1) {
	    		return;
	    	}
		    if (pos.z < 50) {
		    	return;
		    }
	    	lastPos.copy(pos);
	    	if (availableMics[this.handId]) {
	    		takeButterfly(this.handId);
	    	}
	    }
	    lastData = data;
	    lastPc = pc;
    	if (availableMics[this.handId]) {
	    	showBfly(this.butterflyId);
	    	if (maxTimeoutInHand == null) {
		    	maxTimeoutInHand = setTimeout(function() {

		    		self.sendBackToScreen();
			    	maxTimeoutInHand = null;
		    		clearTimeout(receiveTimeout);
			    	receiveTimeout = null;
		    	}, 5000);
	    	}
    	} else {
    		hideBfly(this.butterflyId);
    		if (receiveTimeout || maxTimeoutInHand) {
    			this.sendBackToScreen();
    		}
    		clearTimeout(receiveTimeout);
	    	receiveTimeout = null;
	    	clearTimeout(maxTimeoutInHand);
	    	maxTimeoutInHand = null;
	    	return;
    	}

	    tmpV.copy(pos);
	    if (pos.z < 50) {
	    	tmpV.z = lastPos.z;
	    }
	    tmpV.sub(lastPos);

	    if (tmpV.length() > 50) {
	    	console.log('bad position detected');
	    } else {
		    if (receiveTimeout) {
			    clearTimeout(receiveTimeout);
		    }
		    receiveTimeout = setTimeout(function() {
		    	self.sendBackToScreen();
		    	receiveTimeout = null;
		    	clearTimeout(maxTimeoutInHand);
		    	maxTimeoutInHand = null;
		    }, 1000);
	    	showBfly(this.butterflyId);
		    tmpV.multiplyScalar(0.2);
		    lastPos.add(tmpV);
	    	moveBfly(this.butterflyId, lastPos.x, lastPos.y, lastPos.z);
	    }
		lastReceive = Date.now();
	};
	// -------------------------------------------
	this.butterflyGoBackScreen = function(data,pc,lastPos){
		if (this.handId !== data.microphoneID) {
			console.log('butterflyGoBackScreen: wrong microphoneID for this handButterflies');
			return;
		}
		var lostData = {
			microphoneID: this.handId,
			position: {x:pc.x, y:pc.y, z:pc.z}
		};
		console.log('emit hand-lost', lostData);
		socket.emit('hand-lost', lostData);
		moveBfly(this.butterflyId, 160, 120, 1);
		lastPos.set(160,120,1);
		hideBfly(this.butterflyId);
	};
}