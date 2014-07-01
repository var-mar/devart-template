/**

	Cocoon - how it works

	1. There is one render pass in the composer
		a. Cocoons + shiny effect + butterflies (copy from flocking)

	<- 1.0 Cocoon receives start new wish from cone
	<- 1.1 Cocoon receives wish text from cone
	<- 1.2 Cocoon receives finish speech from cone
	<- 1.5 Cocoon receives butterfly texture id from cone

	2. The butterfly created from the cocoon is a butterfly like in flocking Butterfly.js

	-> 2.5. Cocoon sends message to hand server, saying the id of the available butterfly

	3. Before transferring butterfly to flock, the butterfly is managed locally by the cocoon
	
	<- 3.5a Cocoon gets message from hand server, saying the microphone id of the butterfly to transfer to hand
	<- 3.6a Cocoon gets message from hand server, saying the microphone id of the butterfly that has left the hand

	OR

	-> 3.5b Cocoon's hand timer runs out and it tells the hand server that butterfly for mic id is not available anymore

	THEN

	-> 3.7. Cocoon sends message to flocking server, sending info about butterfly to add to flock

	4. At the point of transferring the butterfly to flocking server, the cocoon resets its state and is ready for next visitor
	5. After leaving the cocoon-hand, the butterfly is managed by the main flocking butterfly server
	6. The flocking server flies the butterflies up from the cocoon screen into the flocking screens
	7. The cocoon app renders out the butterfly UDP packets just like the flocking renderers

	Milestones to implement:

	[X] 1. Make cocoon use flocking butterflies.
	[X] 1.5. Make cocoon butterflies look ok.
	[X] 2. Add a flocking renderer to the cocoon app.
	[X] 3. Add timer for hand so that butterflies are added to flock on timeout
	[X] 4. Add butterflies to flocking server
	[X] 5. Add hand interaction.

*/

var hsvShader = {
	uniforms: {

		"tDiffuse": { type: "t", value: null }

	},

	vertexShader: [

		"varying vec2 vUv;",

		"void main() {",

			"vUv = uv;",
			"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

		"}"

	].join("\n"),

	fragmentShader: document.getElementById('hsvshiftshader').textContent
};

var changeVisibility = function( obj, visible ) {
    obj.visible = visible;
    if(obj.children){
		for(var i = 0,il = obj.children.length;i<il;i++){
		    changeVisibility( obj.children[i], visible );
		}
    }
};

var dpr = 1;
if (window.devicePixelRatio !== undefined) {
  dpr = window.devicePixelRatio;
}

var handPositions = {
	0: {x: 0, y: 0, z: 0, xPx: 0, yPx: 0},
	1: {x: 0, y: 0, z: 0, xPx: 0, yPx: 0},
	2: {x: 0, y: 0, z: 0, xPx: 0, yPx: 0}
};

var container, stats;
var camera, scene, scene1, renderer;
var group, text;
//var widthScreen = window.innerWidth;
//var heightScreen = window.innerHeight;

var widthScreen = 1920;
var heightScreen = 1200;

var controls;
var cocoons = [];

var valuesChanger;
var oclscene, oclcomposer, butterflyComposer, grPass;
var depthPassPlugin,composer, depthTarget;
var depthScale = 1.0;

var mybutterflyManager;
var clock;
var disapearEffect;

var boid, boids;
var maximumButterflies = 80;
var composer1,composer2;
var worldSize,worldPosition;
var stats;
var bId = 0;
var idArr = new Uint8Array(18);
var testBfly;

var butterflyArray = [];
var butterflyIndex = 0;

var butterflyImageLoader = {
	load : function (url, callback) {
		var xhr = new XMLHttpRequest();
		xhr.open('GET', url, true);
		xhr.responseType = 'blob';
		xhr.onerror = function() {
  			console.log('error loading xhr, retry', url);
			butterflyImageLoader.load(url, callback);
		};
		xhr.onload = function(e) {
			if (this.status == 200) {
				console.log("image load sucessfully");
		    	var blob = this.response;
		    	var img = new Image();
		    	img.onerror = function() {
		    		// on error, try again
		  			window.URL.revokeObjectURL(img.src);
		  			console.log('error loading image, retry', url);
					butterflyImageLoader.load(url, callback);
		    	};
		    	img.onload = function(e) {
	    			// Clean up after yourself
		  			window.URL.revokeObjectURL(img.src);
		      		console.log("clean image");
		      		callback(img);
		   		};
		    	img.src = window.URL.createObjectURL(blob);

		    	// Do something with the img
		    	// document.body.appendChild(img);
		  	}else{
		  		console.log("error load image");
		  	}
	  	};
		xhr.send();
	},

	cache: { clear: function() {} }
};

var f32array = new Float32Array(100 * 16);
var f32buf = f32array.buffer;

var socket;
var socketId;
var butterflyData = f32buf;

var onReceive = function(info) {
    if (info.socketId !== socketId)
		return;	
	if (info.data.byteLength === 6400) { // Butterfly data
		butterflyData = info.data;
		updateButterflies(butterflyData);
		for (var i=0; i<nextPacketCallbacks.length; i++) {
			var r = nextPacketCallbacks[i]();
			if (r) {
				nextPacketCallbacks.splice(i,1);
			}
		}
	}
};

var socketCloser = function(sockets) {
	if (sockets.length > 0) {
		var s = sockets.pop();
		console.log(s);
		chrome.sockets.udp.close(s.socketId, function() { socketCloser(sockets); } );
		return;
	}
	console.log('all sockets closed');
	chrome.sockets.udp.create({bufferSize:6400}, function (socketInfo) {
		// The socket is created, now we can send some data
		socketId = socketInfo.socketId;
		var tryBind = function() {
			chrome.sockets.udp.bind(socketId, "0.0.0.0", 3007, function(result) {
			    if (result < 0) {
					console.log("Error binding socket.");
					setTimeout(tryBind, 3000);
					return;
			    }
			    console.log('socket bound');
			    init();
				chrome.sockets.udp.onReceive.addListener(onReceive);
			    animate();
			});
		};
		tryBind();
	});
};
chrome.sockets.udp.getSockets(socketCloser);

var screenId;

function init() {
	setupSocket();
	container = document.createElement( 'div' );
	document.body.appendChild( container );

	// set some camera attributes
	var VIEW_ANGLE = 15,
	ASPECT = widthScreen / heightScreen,
	NEAR = 100,
	FAR = 10000;

	screenId = 3;
	createBlendingCamera(
	    VIEW_ANGLE,
	    ASPECT,
	    NEAR,
	    FAR,
	    3,3
	);

	//camera = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR );
	worldSize = new THREE.Vector3( 500, 600, 400 );
	worldPosition = new THREE.Vector3( 0, 450, 0 );

	scene = new THREE.Scene();
	scene2 = new THREE.Scene();
	clock = new THREE.Clock();
	scene1 = scene;

	boids = [];

	for (var i=0; i<100; i++) {
		butterflyArray.push(new Butterfly());
		butterflyArray[i].hide();
	}

	// 4-light lighting

	// add subtle ambient lighting
	var ambientLight = new THREE.AmbientLight(0x444444);
	scene1.add(ambientLight);
	scene2.add(ambientLight.clone());

	var directionalLight3 = new THREE.DirectionalLight( 0xffffff, 0.3 );
	directionalLight3.position.set( 1, 0, 0.5 );
	var directionalLight4 = new THREE.DirectionalLight( 0xffffff, 0.4 );
	directionalLight4.position.set( 0, 1, 0.5 );

	var directionalLight2 = new THREE.DirectionalLight( 0xffffff, 0.3 );
	directionalLight2.position.set( 0, -1, 0.5 );

	var directionalLight1 = new THREE.DirectionalLight( 0xffffff, 0.1 );
	directionalLight1.position.set( -1, 0, 0.5 );

	directionalLight3.castShadow = true;
	directionalLight4.castShadow = true;
	
	scene1.add( directionalLight1 );
	scene2.add( directionalLight1.clone() );

	scene1.add( directionalLight2 );
	scene2.add( directionalLight2.clone() );

	scene1.add( directionalLight3 );
	scene2.add( directionalLight3.clone() );

	scene1.add( directionalLight4 );
	scene2.add( directionalLight4.clone() );

	// fog
	scene1.fog = new THREE.Fog(0x000000, 3850, 4550);
	scene2.fog = new THREE.Fog(0x000000, 3850, 4550);
	
	// OCL SCENE
	oclscene = scene2;
	oclcamera = camera.clone();
	oclcamera.position = camera.position;
	
	cocoons[0] 	= new Cocoon(1);
	cocoons[1]	= new Cocoon(2);
	cocoons[2] 	= new Cocoon(3);
	
	setupGUI();

	renderer = new THREE.WebGLRenderer({antialias: false});
	renderer.setClearColor( 0x000000 );
	renderer.setSize( widthScreen, heightScreen );

	renderer.domElement.style.width = '100%';
	renderer.domElement.style.height = 'auto';

	// Prepare the occlusion composer's render target
	var renderTargetParameters = { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBFormat, stencilBuffer: false };
	var renderTargetOcl = new THREE.WebGLRenderTarget( widthScreen, heightScreen, renderTargetParameters );
	renderTargetOcl.generateMipmaps = false;
	 
	// Prepare the simple blur shader passes
	var hblur = new THREE.ShaderPass( THREE.HorizontalBlurShader );
	var vblur = new THREE.ShaderPass( THREE.VerticalBlurShader );
	
	var blurriness = 1;
	 
	hblur.uniforms[ "h" ].value = blurriness / widthScreen;
	vblur.uniforms[ "v" ].value = blurriness / heightScreen;
	
	// Prepare the occlusion scene render pass
	var renderModelOcl = new THREE.RenderPass( oclscene, oclcamera );
	 
	// Prepare the godray shader pass
	grPass = new THREE.ShaderPass( THREE.Extras.Shaders.Godrays );
	grPass.needsSwap = true;
	//grPass.renderToScreen = true;
	 
	// Prepare the composer
	oclcomposer = new THREE.EffectComposer( renderer, renderTargetOcl );
	oclcomposer.addPass( renderModelOcl );
	//oclcomposer.addPass( hblur );
	//oclcomposer.addPass( vblur );
	//oclcomposer.addPass( hblur );
	//oclcomposer.addPass( vblur );
	oclcomposer.addPass( grPass );

	// depth pass
	depthTarget = new THREE.WebGLRenderTarget( widthScreen, heightScreen, { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter } );
	depthTarget.generateMipmaps = false;
	depthPassPlugin = new THREE.DepthPassPlugin();
	depthPassPlugin.renderTarget = depthTarget;
	renderer.addPrePlugin( depthPassPlugin );

	// postprocessing
	composer = new THREE.EffectComposer( renderer );
	// Double resolution (twice the size of the canvas)
	var sampleRatio = 2;
	composer.setSize(widthScreen * sampleRatio, heightScreen * sampleRatio);
	composer.addPass( new THREE.RenderPass( scene, camera ) );
	
	var finalPass = new THREE.ShaderPass( THREE.Extras.Shaders.Additive );
	finalPass.needsSwap = true;
	finalPass.uniforms.tAdd.value = renderTargetOcl;
	composer.addPass(finalPass);

	var flipPass = new THREE.ShaderPass( THREE.FlipXShader );
	composer.addPass(flipPass);

	var hsvPass = new THREE.ShaderPass( hsvShader );
	hsvPass.renderToScreen = true;
	composer.addPass(hsvPass);
	/*
	var fxaa = new THREE.ShaderPass( THREE.FXAAShader );
	fxaa.uniforms[ 'resolution' ].value = new THREE.Vector2( 1/widthScreen, 1/heightScreen );
	fxaa.renderToScreen = true;
	composer.addPass( fxaa );
	
	var edgeBlendingEffect = new THREE.ShaderPass( THREE.EdgeBlendingShader ); 
	edgeBlendingEffect.uniforms[ 'OverlapTop' ].value = 0.2;
	edgeBlendingEffect.renderToScreen = true;
	//composer.addPass( edgeBlendingEffect );
	*/

	container.appendChild( renderer.domElement );
	if(debug){
		stats = new Stats();
		stats.domElement.style.position = 'absolute';
		stats.domElement.style.top = '0px';
		container.appendChild( stats.domElement );
	}
	// testBfly = new Butterfly();
	// initialize cocoons with testing text
	// for (var i=0; i<cocoons.length; i++) {
	// 	cocoons[i].myTextCocoon.setNewWish("I wish to be a butterfly");
	// 	cocoons[i].startAnimation();
	// }

	/*
	cocoons[0].myTextCocoon.setNewWish("I wish to be a butterfly");
	setTimeout(function(){
		cocoons[0].myTextCocoon.updateText("london to go holidays");
	},2500);
	setTimeout(function(){
		cocoons[0].myTextCocoon.updateText("go liverpool home");
	},2600);
	setTimeout(function(){
		cocoons[0].myTextCocoon.updateText("barcelona is best city");
	},2800);
	setTimeout(function(){
		cocoons[0].myTextCocoon.updateText("london is a financial city");
	},3500);
	*/
}

var debugText = true;
debugTextCounter = 0;

function moveBflyPP(id, pp) {
	var h = handPositions[id];
	var p = physicalPointToCocoonProjector(pp);
	h.xPx = p.x;
	h.yPx = p.y;
}

function animate() {
	requestAnimationFrame( animate );
	
	cocoons[0].update();
	cocoons[1].update();
	cocoons[2].update();
	valuesChanger();
	
	render(clock.getDelta());
	if(debug){
		stats.update();	
	}
}

function render(dt) {
	now = performance.now();
	/*
	if (false) {
		var cocoon = cocoons[0];
		if (debugTextCounter == 0) {
			cocoon.myTextCocoon.setNewWish('');
		}
		if (debugTextCounter == 20) {
			cocoon.myTextCocoon.updateText('abc');
		}
		if (debugTextCounter == 1000) {
			cocoon.myTextCocoon.setNewWish('');
		}
		if (debugTextCounter == 1020) {
			cocoon.myTextCocoon.updateText('bxz');
		}
		if (debugTextCounter == 1420) {
			cocoon.myTextCocoon.updateText('xib');
		}
		if (debugTextCounter == 1930) {
			cocoon.myTextCocoon.finishSpeech();
		}
		if (debugTextCounter == 2000) {
			var sId = atob("53ab1f6da5a04d0b01e73ddf");
			var idArr = [];
			for (var i=0; i<sId.length; i++) {
				idArr.push(sId.charCodeAt(i));
			}
			console.log('set id', sId);
			cocoon.setId(idArr);
		}		
		if (debugTextCounter == 10000) {
			console.log('inhand');
			cocoon.butterflyInHand();
		}
		if (debugTextCounter == 12000) {
			console.log('outhand');
			cocoon.butterflyOutOfHand();
		}
	}
	*/
	
	depthPassPlugin.enabled = true;
	renderer.autoClear = false;
	renderer.render( scene, camera );
	depthPassPlugin.enabled = false;
	oclcomposer.render();
	composer.render();
	
	/*
	if (testBfly) {		
		testBfly.butterflyStatus.setId(butterflyArray[0].butterflyStatus.id);
		testBfly.butterflyStatus.opacity = 1;
		testBfly.butterflyStatus.state = 'resting';
		testBfly.butterflyStatus.boid.position.set(-100, 50, -150);
		testBfly.butterflyStatus.boid.velocity.set(0, 1, 0);
		testBfly.butterflyStatus.update();
		testBfly.updateGroups(testBfly.butterflyStatus.status);
	}
	for (var i in handPositions) {
		if (cocoons[i].handPosition != null) {
			moveBflyPP(i, cocoons[i].handPosition);
		} else {
			moveBflyPP(i, {x:(i-1)*600+50 + Math.cos(Date.now()/1000)*300, y:0, z:1000 + Math.sin(Date.now()/1000)*300});
		}
		// var e = document.getElementById("hand-"+i);
		// e.style.left = handPositions[i].xPx + 'px';
		// e.style.top = handPositions[i].yPx + 'px';
	}
	debugTextCounter+=10;
	*/
}

function updateButterflies(data) {
    // console.log('got data for butterflies', data.byteLength);
	for (var i=0; i<butterflyArray.length; i++) {
	    var f32a = new Float32Array(data, i*(4*11+20), 11);
	    var u8a = new Uint8Array(data, i*(4*11+20)+(11*4), 18);
	    var bfly = butterflyArray[i];
	    bfly.butterflyStatus.deserializeStatus(bfly.butterflyStatus.status, f32a);
        bfly.updateGroups(bfly.butterflyStatus.status);
        bfly.butterflyStatus.setId(u8a);
	}
	// console.log('updated butterflies');
}

valuesChanger = function() {
   	cocoons[0].valuesChanger();
   	cocoons[1].valuesChanger();
   	cocoons[2].valuesChanger();
};

// cocoon 0 is for testing things with sliders the 1 and 2 will be not affected
function setupGUI(){
	
	var colorControl = { color: '#888888' };
	if (false && typeof dat !== 'undefined') {
		var gui = new dat.GUI();
		gui.add( cocoons[0].effectController, "radiusFactor", 0.0, 5.0, 1.0 ).onChange( valuesChanger );
		gui.add( cocoons[0].effectController, "initialRadius", 0.0, 2000.0, 0.001 ).onChange( valuesChanger );
		gui.add( cocoons[0].effectController, "radiusMax", 0.35, 0.65, 0.001 ).onChange( valuesChanger );
		gui.add( cocoons[0].effectController, "slopeFactor", 2.0, 4.5, 0.001 ).onChange( valuesChanger );
		gui.add( cocoons[0].effectController, "radiusIncrementalSmoothness", 0.0, 1000.00, 0.001 ).onChange( valuesChanger );
		gui.add( cocoons[0].effectController, "spiralFactorX", 0.0, 2, 0.001 ).onChange( valuesChanger );
		gui.add( cocoons[0].effectController, "spiralFactorY", 0.0, 100, 0.001 ).onChange( valuesChanger );
		gui.add( cocoons[0].effectController, "textHeight", 0.0, 100.0, 0.025 ).onChange( valuesChanger );
		gui.add( cocoons[0].effectController, "posY", -4000.0, 4000.0, 0.025 ).onChange( valuesChanger );
		gui.add( cocoons[0].effectController, "scale1", -0.0, 1.0, 0.001 ).onChange( valuesChanger );
		gui.add( cocoons[0].effectController, "scale2", -0.0, 1.0, 0.001 ).onChange( valuesChanger );
		gui.add( cocoons[0].effectController, "rotationXFont", 0.0, 10.0, 0.001 ).onChange( valuesChanger );			
		gui.add( cocoons[0].effectController, "cocoonStart", 0.0, 1.11, 0.01 ).onChange( valuesChanger );			
		gui.add( cocoons[0].effectController, "unravelStart", 0.0, 2.0, 0.01 ).onChange( valuesChanger );		
		gui.add( cocoons[0].effectController, "rotationY", 0.01, 0.1, 0.001 ).onChange( valuesChanger );	
		gui.add( cocoons[0].effectController, "rotationYFactor", 0.0, 1.0, 0.001 ).onChange( valuesChanger );		
		gui.add( cocoons[0].effectController, "black", 0.0, 1.0, 0.001 ).onChange( valuesChanger );		
		gui.addColor( colorControl, "color").onChange( function(cv) {
			cv.replace('#', '0x');
			cocoons[0].vlight.material.color = new THREE.Color(cv);
		});
		gui.add( cocoons[0].blurController, "fExposure", 0.0, 1.0).onChange( valuesChanger );
		gui.add( cocoons[0].blurController, "fDecay", 0.0, 1.0).onChange( valuesChanger );
		gui.add( cocoons[0].blurController, "fDensity", 0.0, 1.0).onChange( valuesChanger );
		gui.add( cocoons[0].blurController, "fWeight", 0.0, 1.0).onChange( valuesChanger );
		gui.add( cocoons[0].blurController, "fClamp", 0.0, 1.0).onChange( valuesChanger );
		gui.close();
	}
}

