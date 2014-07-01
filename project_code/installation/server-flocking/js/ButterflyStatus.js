/*
	TODO
	----
	1) Make butterfly resting state look good.
	2) Make butterfly not rotate upright when entering resting state

*/

function ButterflyStatus(energy){

	this.id = new Uint8Array(18);

	var self = this;
	// The butterfly has a number of states that define how it's acting.
	// In addition to the state, the butterfly has its own characteristic way of flying 
	// (how fast wings beat, what's the range of the wing movement, how fast the butterfly moves)
	//
	// The different states are:
	// - flying - The butterfly flies around on the screen, avoiding back wall and side walls
	// - resting - The butterfly rests on the back wall, wings open, slowly moving
	// - sleeping - The butterfly has its wings folded up and rests on the back wall
	// - alarmed - The butterfly flies rapidly towards a side wall
	// - walking - The butterfly walks on the wall
	// - gliding - The butterfly glides on air
	this.state = 'alarmed';

	this.phaseRange = 0.4;
	this.phaseVelocity = 0.1;
	this.phaseOffset = 0.1;

	this.phaseRangeTarget = 0.4;
	this.phaseVelocityTarget = 0.1;
	this.phaseOffsetTarget = 0.1;
	
	this.maximumVelocity = 0.1;

	this.walkingSpeed = 0.2;
	this.flyingSpeed = 0.7;
	this.fastFlyingSpeed = 1.5;

	this.energy = 0.5 + (energy || 0.5);
	this.stateSwitchCounter = 500;

	this.alpha = 0;
	this.opacity = 0;
	this.age = 0;

	this.status = {
		position: new THREE.Vector3(),
		up: new THREE.Vector3(),
		lookAt: new THREE.Vector3(),
		phase: 0,
		opacity: 0
	};

	this.lookAtVector = new THREE.Vector3(Math.random()-0.5, Math.random()-0.5, Math.random()-0.5);
	this.lookAtVector.normalize();

	this.onIdChange = function(newId) {};

	var _tmpV = new THREE.Vector3();
	var zVec = new THREE.Vector3(0,0,1);

	this.updateButterfly = function(){
		var up = new THREE.Vector3(0,1,1).normalize();

		var bd = Math.abs(this.boid.position.z - (-150));
		if (this.state === 'resting') {
			if (bd < 1) {
				this.boid.position.z = -150;
				this.boid.velocity.z = 0;
			} else {
				var g = new THREE.Vector3().copy(this.boid.velocity);
				g.multiplyScalar(1+bd/50);
				g.add(this.boid.position);
				g.z = -150;
				g.y = (this.boid.position.y + 1);
				this.boid.setGoal(g);
				this.boid.position.z += (-150 - this.boid.position.z) * 0.05;
			}
			if (this.boid.velocity.y < 0.3) {
				this.boid.velocity.y += 0.3*Math.random();
			}
			up.set(0, (bd/150), 1-(bd/150));
			up.normalize();
		} else {
			this.boid.setGoal(null);
		}


		if ((this.state === 'resting' && bd > 5) || this.state === 'flying' || this.state === 'alarmed' || this.state === 'walking' || this.state === 'gliding') {
			if (bd < 0) {
				this.boid.position.z = -150;
				this.boid.velocity.z = 0.3;
			}

			var v = _tmpV;
			v.copy(this.boid.velocity);
			v.normalize();
			/*
			// Avoid coming directly to / away from camera
			if (Math.abs(v.dot(zVec)) < 0.1) {
				this.boid.velocity.x += 0.2*Math.random();
			}
			*/
			if (v.y < -0.2) {
				v.y += (-0.2-v.y) * 1.5;
			} else if (v.y > 0.4) {
				v.y += (0.4-v.y) * 1.5;
			}
			v.normalize();
			v.sub(this.lookAtVector);
			v.multiplyScalar(0.05);
			
			this.lookAtVector.add(v);
			this.lookAtVector.normalize();

			v.addVectors(this.boid.position, this.lookAtVector);

			this.status.lookAt = v;
		}

		if ((this.state === 'resting' && bd < 5) || this.state === 'walking' || this.state === 'sleeping') {
			this.boid.position.z += (-150 - this.boid.position.z) * 0.01;
			this.boid.velocity.z *= 0.05;
			if (this.state !== 'walking') {
				//this.boid.velocity.x = 0;
				//this.boid.velocity.y = 1;
				this.boid.velocity.z = 0;
				var d = 0.3 - this.boid.velocity.length();
				this.boid.velocity.multiplyScalar( d < 0 ? 0.99 : 1.01 );
			} else {
				if (!this.walkingCounter) {
					this.walkingCounter = 70;
				}
				if (this.walkingCounter < 40) {
					var d = 0.01 - this.boid.velocity.length();
					this.boid.velocity.multiplyScalar( d < 0 ? 0.8 : 1.2 );
				} else {
					var d = this.walkingSpeed - this.boid.velocity.length();
					this.boid.velocity.multiplyScalar( d < 0 ? 0.8 : 1.2 );
				}
				this.walkingCounter--;
			}

			var v = _tmpV;
			v.copy(this.boid.velocity);
			v.normalize();
			v.sub(this.lookAtVector);
			v.multiplyScalar(0.05);

			this.lookAtVector.add(v);
			this.lookAtVector.normalize();

			v.addVectors(this.boid.position, this.lookAtVector);

			this.status.up = new THREE.Vector3(0,0,1);
			this.status.lookAt = v;

		} else {
			this.status.up = up;
		}
		
	};

	this.updateWings = function(){
		switch (this.state) {
			case 'alarmed':
				this.phaseRangeTarget = 1.3;
				this.phaseOffsetTarget = 0.1;
				this.phaseVelocityTarget = 0.2;
				break;
			case 'flying':
				this.phaseRangeTarget = 0.8;
				this.phaseOffsetTarget = 0.1;
				this.phaseVelocityTarget = 0.1;
				break;
			case 'gliding':
				this.phaseRangeTarget = 0.2;
				this.phaseOffsetTarget = 0.2 + Math.random()*0.2;
				this.phaseVelocityTarget = 0.05;
				break;
			case 'resting':
				var bd = Math.abs(this.boid.position.z - (-150));
				if (bd > 5) { // flap wings rapidly before landing
					this.phaseRangeTarget = 1.3;
					this.phaseOffsetTarget = 0.1;
					this.phaseVelocityTarget = 0.2;
				} else {
					this.phaseRangeTarget = 0.3;
					this.phaseOffsetTarget = 0.15;
					this.phaseVelocityTarget = 0.1;
				}
				break;
			case 'sleeping':
				this.phaseRangeTarget = 0.05;
				this.phaseOffsetTarget = Math.PI/2-0.1;
				this.phaseVelocityTarget = 0.03;
				break;
			case 'walking':
				this.phaseRangeTarget = 0.3;
				this.phaseOffsetTarget = 0.15;
				this.phaseVelocityTarget = 0.1;
				break;
		}
		this.phaseRange += (this.phaseRangeTarget-this.phaseRange) * 0.1;
		this.phaseOffset += (this.phaseOffsetTarget-this.phaseOffset) * 0.1;
		this.phaseVelocity += ((this.phaseVelocityTarget*2)*this.energy-this.phaseVelocity) * 0.1;
		this.boid.maxSpeed += ((this.maximumVelocity*2)*this.energy-this.boid.maxSpeed) * 0.1;

		this.alpha += this.phaseVelocity;
		this.status.phase = this.phaseOffset + this.phaseRange * Math.sin(this.alpha);

	};

	this.create = function(){
		this.boid = new Boid();
		this.boid.butterfly = this;
		this.boid.setAvoidWalls( true );
		this.boid.setWorldSize( worldSize.x, worldSize.y, worldSize.z );
		this.boid.setWorldPosition(worldPosition.x, worldPosition.y, worldPosition.z);
		boids[boids.length] = this.boid;

		// butterfly parts
		this.updateButterfly(); // all parts
	};

	this.startFadeOut = function() {
		this.opacity = Math.max(0, this.opacity - 1/255);
	};

	this.update = function(){
		this.stateSwitchCounter--;
		var originalState = this.state;
		var d = 10000;
		for (var i=0; i<linesBlendingYAr.length; i++) {
			var line = linesBlendingYAr[i];
			d = Math.min(d, Math.abs(line - this.boid.position.y));
		}
		var canRest = d > 15 && this.boid.position.y > 400;
		switch (this.state) {
			case 'flying':
				if (this.stateSwitchCounter <= 0) {

					if (Math.random() < (1/10)/60 && canRest) { // once every 10 seconds at 60 fps
						this.state = 'resting';
						this.stateSwitchCounter = 150;
					} else if (Math.random() < (1/4)/60) { // once every 4 seconds at 60 fps
						this.state = 'gliding';
					}
				}
				for( i in repulsorCocoons){ // add repulsors to cocoons
					var p = repulsorCocoons[i].position;
					this.boid.repulse(p);
				}
				this.boid.run( boids );
				if (this.stateSwitchCounter <= 0) {				
					this.boid.neighbors.forEach(function(n) {
						if (n.butterfly.stateSwitchCounter <= 0 && (n.butterfly.state == 'sleeping' || n.butterfly.state == 'resting') && Math.random() < 0.003) {
							n.butterfly.state = 'alarmed';
						}
					});
				}
				this.maximumVelocity = this.flyingSpeed;
				break;
			case 'gliding':
				if (this.stateSwitchCounter <= 0) {				
					if (Math.random() < (1/0.5)/60) { // once every 0.5 seconds at 60 fps
						this.state = 'alarmed';
					}
				}
				this.boid.velocity.y -= 0.003;
				this.boid.velocity.x *= 1.01;
				this.boid.velocity.z *= 1.01;
				this.boid.run( boids );
				this.maximumVelocity = this.flyingSpeed;
				break;
			case 'resting':
				if (this.stateSwitchCounter <= 0) {
					if (Math.random() < (1/10)/60) { // once every 10 seconds at 60 fps
						if (Math.random() < 1-0.7) {
						//	this.state = 'walking';
						//} else {
							this.state = 'alarmed';
						}
					}
				}
				break;
			case 'walking':
				if (this.stateSwitchCounter <= 0) {				
					if (Math.random() < (1/2)/60) { // once every 2 seconds at 60 fps
						if (Math.random() < 0.7 && canRest) {
							this.state = 'resting';
						} else {
							this.state = 'alarmed';
						}
					}
				}
				this.maximumVelocity = this.walkingSpeed;
				this.boid.run( boids );
				break;
			case 'sleeping':
				if (this.stateSwitchCounter <= 0) {
					if (Math.random() < (1/3)/60) { // once every 3 seconds at 60 fps
						if (Math.random() < 0.1 && canRest) {
							this.state = 'resting';
						} else if (Math.random() < 0.5) {
							this.state = 'alarmed';
						} else {
							this.state = 'flying';
						}
					}
				}
				break;
			case 'alarmed':
				if (this.stateSwitchCounter <= 0) {
					if (Math.random() < (1/3)/60) { // once every 3 seconds at 60 fps
						this.state = 'flying';
					}
				}
				this.maximumVelocity = this.fastFlyingSpeed;
				this.boid.run( boids );
				if (this.stateSwitchCounter <= 0) {
					this.boid.neighbors.forEach(function(n) {
						if (n.butterfly.stateSwitchCounter <= 0 && (n.butterfly.state == 'sleeping' || n.butterfly.state == 'resting') && Math.random() < 0.1) {
							n.butterfly.state = 'alarmed';
						}
					});
				}
				break;
		}
		if (this.state !== originalState && this.stateSwitchCounter <= 0) {
			this.stateSwitchCounter = 50;
		}

		this.updateButterfly();
		this.updateWings();

		if (this.opacity < 1) {
			this.opacity = Math.max(0, this.opacity - 1/255);
		}
		this.status.opacity = this.opacity;

		this.status.position.copy(this.boid.position);

	};

	this.serializeStatus = function(status, f32array, zOff) {
		f32array[0] = status.position.x;
		f32array[1] = status.position.y;
		f32array[2] = status.position.z + zOff;
		f32array[3] = status.up.x;
		f32array[4] = status.up.y;
		f32array[5] = status.up.z;
		f32array[6] = status.lookAt.x;
		f32array[7] = status.lookAt.y;
		f32array[8] = status.lookAt.z + zOff;
		f32array[9] = status.phase;
		f32array[10] = status.opacity;
	};

	this.deserializeStatus = function(status, f32array) {
		var i = 0;
		status.position.x = f32array[i++];
		status.position.y = f32array[i++];
		status.position.z = f32array[i++];
		status.up.x = f32array[i++];
		status.up.y = f32array[i++];
		status.up.z = f32array[i++];
		status.lookAt.x = f32array[i++];
		status.lookAt.y = f32array[i++];
		status.lookAt.z = f32array[i++];
		status.phase = f32array[i++];
		status.opacity = f32array[i++];
	};

	this.reset = function() {
		this.boid.position.x = Math.random()*400 - 200;
		this.boid.position.y = 0;
		this.boid.position.z = -150;
		this.boid.velocity.x = 0;
		this.boid.velocity.y = 0.3;
		this.boid.velocity.z = 0;
		this.boid.setGoal(null);
		this.lookAtVector = new THREE.Vector3(0, 1, 0);
		this.status.lookAt.set(0, 1000, -150);
		this.status.up.set(0, 0, 1);
		this.stateSwitchCounter = 500;
		this.state = 'alarmed';
		this.alpha = 0;
		this.opacity = 1;
		this.age = new Date().getTime();
	};

	this.cmpId = function(b) {
		var a = this.id;
		for (var i=0; i<a.length; i++) {
			if (a[i] !== b[i]) {
				return false;
			}
		}
		return true;
	};

	this.copyId = function(a,b) {
		var rv = true;
		for (var i=0; i<a.length; i++) {
			if (a[i] !== b[i]) {
				a[i] = b[i];
				rv = false;
			}
		}
		return rv;
	};

	this.setId = function(id) {
		if (!this.copyId(this.id, id) && this.onIdChange) {
			this.onIdChange();
		}
	};

	this.create();
}
//---------------------------------------------------------

