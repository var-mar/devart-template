function TextCocoon(){
	// Get text from hash
	
	this.createText = function(){
		this.myTypography = new typography();
		this.myTypography.setCallback(this.valuesChanger.bind(this));
	}
	
	this.createShaderMaterial = function(){
		this.uniforms = {
			time: { type: "f", value: 1.0 },
			radiusFactor: { type: "f", value: 1.7 },
			initialRadius: { type: "f", value: 130.0 },
			radiusMax: { type: "f", value: 0.48 },
			slopeFactor:{ type: "f", value: 2.0 },
			radiusIncrementalSmoothness: { type: "f", value: 0.0 },
			spiralFactorX: { type: "f", value: 0.2 },
			spiralFactorY: { type: "f", value: 3.3 },
    		textHeight: { type: "f", value: 11.2 },
			posY: { type: "f", value: 680.0 },
			scale1: { type: "f", value: 0.076 },
			scale2: { type: "f", value: 0.47 },
			rotationXFont: { type: "f", value: 2.5 },
			widthText:{ type: "f", value: 5000.0 },
			heightText:{ type: "f", value: 20.0 },
			rotationY:{ type: "f", value: 1.0 },
			black: { type: "f", value: 0.0 },
			cocoonStart: {type: "f", value: 0.0},
			unravelStart: {type: "f", value: 0.0}
		};
		this.attributes = {
		};
		this.shaderMaterial = new THREE.ShaderMaterial({
			uniforms: this.uniforms,
			attributes: this.attributes,
			vertexShader:   document.getElementById( 'vertexshader' ).textContent,
			fragmentShader: document.getElementById( 'fragmentshader' ).textContent,
			side: THREE.DoubleSide,
			wireframe:false
		});

		this.ocluniforms = {
			time: { type: "f", value: 1.0 },
			radiusFactor: { type: "f", value: 1.7 },
			initialRadius: { type: "f", value: 130.0 },
			radiusMax: { type: "f", value: 0.48 },
			slopeFactor:{ type: "f", value: 2.0 },
			radiusIncrementalSmoothness: { type: "f", value: 0.0 },
			spiralFactorX: { type: "f", value: 0.2 },
			spiralFactorY: { type: "f", value: 3.3 },
    		textHeight: { type: "f", value: 11.2 },
			posY: { type: "f", value: 680.0 },
			scale1: { type: "f", value: 0.076 },
			scale2: { type: "f", value: 0.47 },
			rotationXFont: { type: "f", value: 2.5 },
			widthText:{ type: "f", value: 5000.0 },
			heightText:{ type: "f", value: 20.0 },
			rotationY:{ type: "f", value: 1.0 },
			black: { type: "f", value: 0.0 },
			cocoonStart: {type: "f", value: 0.0},
			unravelStart: {type: "f", value: 0.0}
		};
		this.oclattributes = {
		};
		this.oclshaderMaterial = new THREE.ShaderMaterial({
			uniforms: this.ocluniforms,
			attributes: this.oclattributes,
			vertexShader:   document.getElementById( 'vertexshader' ).textContent,
			fragmentShader: document.getElementById( 'fragmentshader' ).textContent,
			side: THREE.DoubleSide,
			wireframe:false
		});
	}

	this.createMesh = function(){
		this.text = new THREE.Mesh( this.myTypography.ngeo, this.shaderMaterial );
		this.ocltext = new THREE.Mesh( this.myTypography.ogeo, this.oclshaderMaterial );
	}

	this.update = function(){
		// rotateY
		this.uniforms.rotationY.value = 
		(this.uniforms.rotationY.value - this.effectController.rotationY)*this.effectController.rotationYFactor;
		this.ocluniforms.rotationY.value = 
		(this.uniforms.rotationY.value - this.effectController.rotationY)*this.effectController.rotationYFactor;
		this.myTypography.update();
	}

	this.valuesChanger = function(){
		// Get default values
		this.uniforms.radiusFactor.value  = this.effectController.radiusFactor;
		this.uniforms.spiralFactorX.value = this.effectController.spiralFactorX;
		this.uniforms.spiralFactorY.value = this.effectController.spiralFactorY;
	    this.uniforms.textHeight.value = this.effectController.textHeight;
		this.uniforms.posY.value = this.effectController.posY;
		this.uniforms.scale1.value = this.effectController.scale1;
		this.uniforms.scale2.value = this.effectController.scale2;
		this.uniforms.rotationXFont.value = this.effectController.rotationXFont;
		this.uniforms.initialRadius.value = this.effectController.initialRadius;
		this.uniforms.initialRadius.value = this.effectController.initialRadius;
		this.uniforms.radiusMax.value = this.effectController.radiusMax;
		this.uniforms.radiusIncrementalSmoothness.value = this.effectController.radiusIncrementalSmoothness;
		this.uniforms.slopeFactor.value = this.effectController.slopeFactor;
		this.uniforms.cocoonStart.value = this.effectController.cocoonStart;
		this.uniforms.unravelStart.value = this.effectController.unravelStart;
		// Get values from geometry
		this.uniforms.widthText.value = this.myTypography.getTextWidth();
		this.uniforms.heightText.value = this.myTypography.getTextHeight();

		// Get default values
		this.ocluniforms.radiusFactor.value  = this.effectController.radiusFactor;
		this.ocluniforms.spiralFactorX.value = this.effectController.spiralFactorX;
		this.ocluniforms.spiralFactorY.value = this.effectController.spiralFactorY;
	    this.ocluniforms.textHeight.value = this.effectController.textHeight;
		this.ocluniforms.posY.value = this.effectController.posY;
		this.ocluniforms.scale1.value = this.effectController.scale1;
		this.ocluniforms.scale2.value = this.effectController.scale2;
		this.ocluniforms.rotationXFont.value = this.effectController.rotationXFont;
		this.ocluniforms.initialRadius.value = this.effectController.initialRadius;
		this.ocluniforms.initialRadius.value = this.effectController.initialRadius;
		this.ocluniforms.radiusMax.value = this.effectController.radiusMax;
		this.ocluniforms.radiusIncrementalSmoothness.value = this.effectController.radiusIncrementalSmoothness;
		this.ocluniforms.slopeFactor.value = this.effectController.slopeFactor;
		this.ocluniforms.cocoonStart.value = this.effectController.cocoonStart;
		this.ocluniforms.unravelStart.value = this.effectController.unravelStart;
		// Get values from geometry
		this.ocluniforms.widthText.value = this.myTypography.getTextWidth();
		this.ocluniforms.heightText.value = this.myTypography.getTextHeight();
	}

	this.updateText = function(text){
		this.myTypography.addWord(text);
	};

	this.repeatText = function(text){
		this.myTypography.repeatText();
	};

	this.setNewWish = function(text){
		this.myTypography.addNewWish(text);
	};

	this.setEventsCallback = function(callback){
		this.myTypography.setEventsCallback(callback);
	}

	this.finishSpeech = function(){
		this.myTypography.finishSpeech();
	}

	this.createShaderMaterial();
	this.createText();
	this.createMesh();
	this.setNewWish("");
}


function Cocoon(id){
	var self = this;
	this.id = id;

	this.setup = function(){
		// cocoon position 
		if(id==1){
			this.pos = new THREE.Vector3(-150,110,0);
		}
		if(id==2){
			this.pos = new THREE.Vector3(0,110,0);
		}
		if(id==3){
			this.pos = new THREE.Vector3(150,110,0);
		}

		// Text cocoons
		this.myTextCocoon = new TextCocoon();
		this.myTextCocoon.setEventsCallback(this.eventsReceiver);

		this.group = new THREE.Object3D;
		this.group.position = this.pos;
		this.oclGroup = new THREE.Object3D;
		this.oclGroup.position = this.pos;
		this.group.add(this.myTextCocoon.text);
		this.oclGroup.add(this.myTextCocoon.ocltext);

		var s = scene1;
		scene1 = this.oclGroup;
		this.butterfly = new Butterfly();
		scene1 = this.group;
		this.boringfly = new Butterfly();
		scene1 = s;

		this.boringfly.opacityTarget = 1;
		this.boringfly.scaleTarget = 1;
		this.boringfly.opacity = this.boringfly.scale = 1;

		this.butterfly.opacityTarget = 1;
		this.butterfly.scaleTarget = 1;
		this.butterfly.opacity = this.butterfly.scale = 1;

		this.boringfly.hide();
		this.butterfly.hide();

		this.bscale = 0.75;

		scene.add(this.group);
		oclscene.add(this.oclGroup);

		// Vol light
		this.vlight = new THREE.Mesh( 
			new THREE.IcosahedronGeometry(10, 3),
			new THREE.MeshBasicMaterial({
				color: 0x888888
			})
		);
		this.vlight.position.y = 45;
		this.vlight.scale.set(0.0001);
		this.oclGroup.add( this.vlight );

		// Variables 
		this.effectController = {
			radiusFactor: 1.7,
			initialRadius:43.0,
			radiusMax:0.43,
			slopeFactor:2.0,
			radiusIncrementalSmoothness:488.0,
			spiralFactorX: 0.16,
			spiralFactorY: 6.7,
			textHeight: 11.2, 
			posY: 400.0,
			scale1: 0.076,
			scale2: 0.34,
			rotationXFont:2.5,
			rotationY:0.0,
			cocoonStart: 0.0,
			unravelStart: 0.0,
			rotationYFactor: 0.0,
			black: 0.0
		};

		this.blurController = {
			fExposure: 0.6,
			fDecay: 0.88,
			fDensity: 0.72,
			fWeight: 0.6,
			fClamp: 1.0
		};

		this.resetValues = {
			effectController: {},
			blurController: {}
		};

		for (var i in this.effectController) {
			this.resetValues.effectController[i] = this.effectController[i];
		}

		for (var i in this.blurController) {
			this.resetValues.blurController[i] = this.blurController[i];
		}

		this.valuesChanger();
	};

	this.valuesChanger = function(){
		this.myTextCocoon.effectController = this.effectController;
		this.myTextCocoon.valuesChanger();
		this.myTextCocoon.uniforms.black.value = this.effectController.black;
		this.myTextCocoon.ocluniforms.black.value = 1.0;
	};

	this.eventsReceiver = function(e){
		if(e=="text-finish-drawing"){
			self.startAnimation();
		}
		if(e=="ready-to-get-wish"){
			self.resetAnimation();
		}
		if(e=="finish-animation"){
			self.resetAnimation();
		}
		if(e=="butterfly-go-to-flock"){
			self.resetAnimation();
		}
	};

	this.updateText = function(text){
		this.myTextCocoon.updateText(text);
	};

	this.setNewWish = function(text){
		this.myTextCocoon.setNewWish(text);
	};

	this.resetAnimation = function() {
		this.butterfly.hide();
		this.boringfly.hide();
		this.bscale = 0.75;
		animationTime = 0;
		animationRunning = false;
		handHandling = false;
		this.disappearing = false;
		this.boringfly.opacity = this.boringfly.opacityTarget = 0;
		this.butterfly.opacity = this.butterfly.opacityTarget = 0;

		for (var i in this.effectController) {
			this.effectController[i] = this.resetValues.effectController[i];
		}

		for (var i in this.blurController) {
			this.blurController[i] = this.resetValues.blurController[i];
		}
		this.vlight.scale.set(0.0001, 0.0001, 0.0001);

		this.myTextCocoon.setNewWish('');
	};

	this.startAnimation = function() {
		animationRunning = true;
		socket.emit("add-repulsor-cocoon", { 'microphoneID':this.id, 'position':this.pos });
	};

	this.reappearButterfly = function(callback) {
		this.disappearing = true;

		this.boringfly.opacityTarget = 1;
		this.boringfly.scaleTarget = 1;
		this.boringfly.show();

		this.butterfly.opacityTarget = 0;
		this.butterfly.scaleTarget = 0.01;
		this.butterfly.hide();

		this.reappearCallback = callback;
	};

	this.disappearButterfly = function(){
		this.disappearing = true;
		this.boringfly.opacityTarget = 0;
		this.butterfly.opacityTarget = 0;
		this.boringfly.scaleTarget = 0.01;
		this.butterfly.scaleTarget = 0.01;
	};

	var handHandling = false;
	var animationRunning = false;
	var animationTime = 0;
	var oh = 11.2;
	var d0 = 1000, d1 = 3000, d15 = 1000, d25 = 1000, d35 = 1000, d3 = 1000, d4 = 100, d5 = 3000;
	var d2 = d15+d25+d35;
	var clamp = function (v, min,max) {
		return (v > max ? max : (v < min ? min : v));
	};

	this.update = function(noTimeUpdate){

		// update writted typography
		this.myTextCocoon.update();

		this.boringfly.opacity += (this.boringfly.opacityTarget - this.boringfly.opacity)*0.1;
		this.boringfly.scale += (this.boringfly.scaleTarget - this.boringfly.scale)*0.1;

		this.butterfly.opacity += (this.butterfly.opacityTarget - this.butterfly.opacity)*0.1;
		this.butterfly.scale += (this.butterfly.scaleTarget - this.butterfly.scale)*0.1;

		if (this.boringfly.opacity > 0.99) {
			if (this.disappearing && this.reappearCallback) {
				this.reappearCallback();
				this.reappearCallback = null;
			}
		}

		if (!animationRunning) {
			animationTime = 0;
			return;
		}

		this.vlight.position.y = 30 + Math.sin(animationTime/500) * 5;
		this.vlight.position.x = 0 + Math.sin(animationTime/900) * 2;
		this.vlight.position.z = 0 + Math.sin(animationTime/1500) * 2;

		var sz = 0.0001;
		this.boringfly.hide();

		if (animationTime < d0) {
			// writing text
		
		} else if (animationTime < d0+d1) {

			// let's wrap cocoon
			var t = clamp((animationTime - d0) / d1, 0, 1);
			this.effectController.cocoonStart = (0.5-0.5*Math.cos(Math.PI*(animationTime-d0)/(d1+d15)))*1.25;
			this.effectController.spiralFactorX = 0.16;
			this.myTextCocoon.repeatText();
		
		} else if (animationTime < d0+d1+d15) {

			// show off the cocoon
			var t = clamp((animationTime-(d0+d1))/d15, 0, 1);
			this.effectController.cocoonStart = (0.5-0.5*Math.cos(Math.PI*(animationTime-d0)/(d1+d15)))*1.25;
			this.effectController.spiralFactorX += (0.1*t) * (1/60);
		
		} else if (animationTime < d0+d1+d15+d25) {

			var t = clamp((animationTime-(d0+d1+d15))/d25, 0, 1);
			this.effectController.textHeight = 11.2 + 20*t*t;
			this.effectController.spiralFactorX += (0.1+0.1*t) * (1/60);

		} else if (animationTime < d0+d1+d2) {

			// bring up the light
			var t = clamp((animationTime-(d0+d1+d15+d25))/d35, 0, 1);
			this.vlight.scale.set(t+0.0001,t+0.0001,t+0.0001);

			this.butterfly.show();
			this.butterfly.opacityTarget = 1;
			this.butterfly.scaleTarget = 1;
			sz = t*0.5+0.0001;

			this.effectController.black = 0.5 * (0.5-0.5*Math.cos(Math.PI*t));
			this.effectController.textHeight = 31.2 + 10*Math.sqrt(t);
			oh = this.effectController.textHeight;
			this.effectController.spiralFactorX += (0.2-0.15*t) * (1/60);

		} else if (animationTime < d0+d1+d2+d3) {

			// make butterfly visible
			var t = clamp((animationTime-(d0+d1+d2))/d3, 0, 1);
			
			this.butterfly.show();
			this.butterfly.opacityTarget = 1;
			this.butterfly.scaleTarget = 1;
			sz = t*0.5+0.5;

			this.effectController.spiralFactorX += (0.05*(1-t)) * (1/60);

		} else if (animationTime < d0+d1+d2+d3+d5) {

			// unravel
			//var t = clamp((animationTime-(d0+d1+d2+d3))/d5, 0, 1);
			//var st = 0.5-0.5*Math.cos(t*Math.PI);
			//this.effectController.radiusIncrementalSmoothness = 488 + 1500 * Math.sqrt(t);

			this.butterfly.show();
			this.butterfly.opacityTarget = 1;
			this.butterfly.scaleTarget = 1;
			var t = clamp((animationTime-(d0+d1+d2+d3))/d5, 0, 1);
			this.vlight.scale.set(1.0001-t, 1.0001-t, 1.0001-t);
			sz = 1;
			this.effectController.black = 0.5 - 0.4*Math.sqrt(t);
			this.effectController.textHeight = oh - 30*(0.5-0.5*Math.cos(t*Math.PI));
			//this.effectController.initialRadius = 43 + 200 * t*t;
			this.effectController.spiralFactorX -= (0.5-0.5*Math.cos(t*Math.PI)) * 0.25 * (1/60);
			this.effectController.unravelStart = t*t*2;

		} else {

			sz = 1;
			// fade out shiny butterfly, replace with boring butterfly
			if (!this.disappearing) {
				this.boringfly.opacityTarget = 1;
				this.boringfly.scaleTarget = 1;
				this.butterfly.show();
				this.boringfly.show();
			} else if (this.reappearCallback) {
				this.boringfly.show();
			}
			this.bscale = 0.5 + 0.25*Math.cos((animationTime - (d0+d1+d2+d3+d5)) / 1000);

		}

		this.butterfly.butterflyStatus.state = 'resting';
		this.butterfly.butterflyStatus.update();
		this.butterfly.butterflyStatus.status.position.copy(this.vlight.position);
		this.butterfly.butterflyStatus.status.lookAt.addVectors(this.vlight.position, new THREE.Vector3(0,1,0));
		this.butterfly.butterflyStatus.status.up.set(0, 1, 1);
		if (this.butterfly.group1.visible) {
			this.butterfly.butterflyStatus.opacity = this.butterfly.opacity;
			this.butterfly.updateGroups(this.butterfly.butterflyStatus.status);
		}
		if (this.boringfly.group1.visible) {
			this.butterfly.butterflyStatus.opacity = this.boringfly.opacity;
			this.boringfly.updateGroups(this.butterfly.butterflyStatus.status);
		}
		sz *= 1.5;
		this.butterfly.group1.scale.set(
			this.butterfly.scale*sz*this.bscale,
			this.butterfly.scale*sz*this.bscale,
			this.butterfly.scale*sz*this.bscale);
		this.boringfly.group1.scale.set(
			this.boringfly.scale*sz, 
			this.boringfly.scale*sz, 
			this.boringfly.scale*sz);
		var pos = THREE.Extras.Utils.projectOnScreen(this.vlight, camera);
		grPass.uniforms["fX"+(this.id-1)].value = pos.x/2 + 0.5;
		grPass.uniforms["fY"+(this.id-1)].value = pos.y/2 + 0.5;

		// If we're at the end of the animation, tell hand that there's an available butterfly.
		if (animationTime > d0+d1+d2+d3+d5+3000 && !handHandling) {
			handHandling = true;
			this.availableForHand = true;
			butterflyAvailableForHand(this.id, this.boringfly);
		}

		// If hand does not pick up butterfly, add butterfly to flock and reset cocoon
		if (animationTime > d0+d1+d2+d3+d5+9000 && !this.inHand && !this.outOfHand) {
			this.butterflyOutOfHand();
		}

		animationTime += 16;
		// make complete invisible light
		if(this.vlight.scale.x <0.01){
			this.vlight.visible = false;
		}else{
			this.vlight.visible = true;
		}
	};

	// Called when the hand picks up the butterfly.
	this.butterflyInHand = function() {
		if (!handHandling || this.outOfHand) {
			return;
		}
		this.inHand = true;
		this.availableForHand = false;
		this.disappearButterfly();
		socket.emit("remove-repulsor-cocoon", { 'microphoneID':this.id });
	};

	// Called when the hand loses the butterfly or after the hand pickup times out.
	this.butterflyOutOfHand = function() {
		if (!handHandling) {
			return;
		}
		this.outOfHand = true;
		this.availableForHand = false;
		butterflyNotAvailableForHand(this.id, this.boringfly);
		if (this.inHand) {
			var self = this;
			this.reappearButterfly(function() {
				addButterflyToFlock(self.id, self.boringfly);
			});
		} else {
			addButterflyToFlock(this.id, this.boringfly);
		}
		this.inHand = false;
		socket.emit("remove-repulsor-cocoon", { 'microphoneID':this.id });
	};

	this.butterflyAddedCallback = function() {
		this.outOfHand = false;
		this.resetAnimation();
	};

	this.setId = function(idUint8Array) {
		this.butterfly.butterflyStatus.setId(idUint8Array);
		this.boringfly.butterflyStatus.setId(idUint8Array);
	};

	// energy between -1..1
	this.setEnergy = function(energy) {
		energy = 1 + 0.5 * energy;
		this.butterfly.butterflyStatus.energy = energy;
		this.boringfly.butterflyStatus.energy = energy;
	};

	this.setIdButterfly = function(id){
		this.idButterfly = id;
	};

	this.finishSpeech = function(){
		this.myTextCocoon.finishSpeech();
	};

	this.setup();
}
			