var worldSize,worldPosition;
worldSize = new THREE.Vector3( 555, 600, 400 );
worldPosition = new THREE.Vector3( 0, 450, 0 );
var boids = [];
var repulsorCocoons = {};

function butterflyManager(){
	var self = this;
	this.myUdpClient = new clientUDP();
	var totalButterflies = 100;
	var howManyOldButterfliesToDisappear = 20;
	var idArr = new Uint8Array(18);
	var f32array = new Float32Array(totalButterflies * 16);
	f32buf = f32array.buffer;
	var fps = 60.0;
	var butterflyArray = [];
	var butterflyIndex = 0;
	var maxAge = 10000; //1000 * 60 * 60;

	this.updateButterflies = function(data) {
		// console.log('got data for butterflies', data.byteLength);
		for (var i=0; i<totalButterflies; i++) {
			var f32a = new Float32Array(data, i*(4*11+20), 11);
			var u8a = new Uint8Array(data, i*(4*11+20)+(11*4), 18);
	    	var flags = new Uint8Array(data, i*(4*11+20)+(11*4)+18, 2);
			var bfly = butterflyArray[i];
			bfly.reset();
			bfly.setId(u8a);
			bfly.deserializeStatus(bfly.status, f32a);
			bfly.flags[0] = flags[0];
			bfly.flags[1] = flags[1];
			bfly.energy = 0.5 + flags[0]/255;
			bfly.boid.position.copy(bfly.status.position);
			bfly.lookAtVector = bfly.status.lookAt.clone();
		}
		// console.log('updated butterflies');
	};

	this.create = function(){
		for(var i=0;i<totalButterflies;i++){
			var butterfly = new ButterflyStatus();
			butterflyArray[i] = butterfly;
	    	var f32a = new Float32Array(f32buf, i*(4*11+20), 11);
	    	var u8a = new Uint8Array(f32buf, i*(4*11+20)+(11*4), 18);
	    	var flags = new Uint8Array(f32buf, i*(4*11+20)+(11*4)+18, 2);
	    	butterfly.f32a = f32a;
	    	butterfly.u8a = u8a;
	    	butterfly.flags = flags;
	    	butterfly.reset();
	    	butterfly.opacity = 1; 
	    	butterfly.setId(bIds[i % bIds.length]);
	    	butterfly.energy = 0.5 + Math.random();
		}
		setupSocket(this);
		var myVar = setInterval(function(){
			self.loop();
		}, (1000.0/fps));
	};

	this.deleteButterfly = function (i){
		var bfly = butterflyArray[i];
		bfly.opacity = 0;
	};

	this.addButterfly = function (id, statusArr, energy) {
		var butterfly = butterflyArray[butterflyIndex];
		butterflyIndex = (butterflyIndex + 1) % butterflyArray.length;
		butterflyArray[butterflyIndex].startFadeOut();
		var ids = atob(id);
		for (var i=0; i<18; i++) {
			idArr[i] = ids.charCodeAt(i);
		}
		butterfly.setId(idArr);
		butterfly.reset();
		if (statusArr) {
			butterfly.deserializeStatus(butterfly.status, statusArr);
		}
		butterfly.opacity = 1;
		butterfly.energy = energy || 1;
		butterfly.boid.position.copy(butterfly.status.position);
		butterfly.boid.velocity.set(0,1,0);
		butterfly.lookAtVector.set(0,1,0);
	};

	this.preloadNewButterfly = function (id) {
		var butterfly = butterflyArray[butterflyIndex];
		var ids = atob(id);
		for (var i=0; i<18; i++) {
			idArr[i] = ids.charCodeAt(i);
		}
		butterfly.setId(idArr);
		butterfly.opacity = 0;
	};

	this.butterflySleepTimer = 0;
	this.sweepStart = 0;
	this.allButterfliesSleeping = false;

	this.loop = function() {
		this.butterflySleepTimer += 16;
		if (this.sweepStart > 0 && this.butterflySleepTimer > this.sweepStart + 6000) {
			this.butterflySleepTimer = 0;
			this.sweepStart = 0;
		}
		var timeBetweenSleep = 10*60*1000;
		var liveButterflies = 0;
		var oldButterflies = [];
		var t = Date.now();
		var sweep = (this.butterflySleepTimer - this.sweepStart) / 2;
		var allAsleep = true;
		for ( var i = 0; i < butterflyArray.length; i++ ) {
			var bfly = butterflyArray[i];
			if (this.butterflySleepTimer > i*100 + timeBetweenSleep) {
				if (this.butterflySleepTimer > timeBetweenSleep + 100*150) {
					if (this.allButterfliesSleeping && this.sweepStart === 0) {
						this.sweepStart = this.butterflySleepTimer;
						sweep = 0;
					}
					if (this.sweepStart > 0 && bfly.boid.position.y < sweep) {
						bfly.state = 'alarmed';
						bfly.boid.velocity.y = 1;
						bfly.stateSwitchCounter = 300;
					} else {
						bfly.state = 'resting';
						bfly.stateSwitchCounter = 1;
					}
				} else if (bfly.state !== 'resting' && bfly.stateSwitchCounter <= 0) {
					bfly.state = 'resting';
				}
			}
			bfly.update();
			if (bfly.opacity === 1) {
				liveButterflies++;
				if (t - bfly.age > maxAge) {
					oldButterflies.push(bfly);
				}
			}
			if (bfly.state !== 'resting') {
				allAsleep = false;
			}
		}
		this.allButterfliesSleeping = allAsleep;
		for (var i=0; i<liveButterflies-(totalButterflies - howManyOldButterfliesToDisappear) && i<oldButterflies.length; i++) {
			oldButterflies[i].startFadeOut(); // Make this butterfly disappear
		}
		for (var i=0; i<butterflyArray.length; i++) {
			var butterfly = butterflyArray[i];
	    	var f32a = butterfly.f32a;
	    	var u8a = butterfly.u8a;
	    	butterfly.flags[0] = 255 * (butterfly.energy-0.5);
	    	butterfly.flags[1] = 0;
			butterfly.serializeStatus(butterfly.status, f32a, i-50);
	    	u8a.set(butterfly.id);
		}
		this.myUdpClient.send(f32buf);
	};
	this.create();
}

server = new butterflyManager();

var closeWindow = function (){
	// close UDP
	server.myUdpClient.close();
};

chrome.app.window.onClosed.addListener(closeWindow);