/**

	Hand - draws butterflies from top projector onto hands

	[X] Draw three butterflies
	[X] Toggle butterflies on and off
	[X] Hook socket events to butterfly visibility
	[X] Move butterflies around to x,y coords
	[X] Hook socket events to butterfly movement

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

var container, stats;
var camera, scene1, renderer;
var group, text;
//var widthScreen = window.innerWidth;
//var heightScreen = window.innerHeight;

var widthScreen = 1920;
var heightScreen = 1200;

var controls;
var clock;

var boid, boids = [];
var composer1,composer2;
var worldSize,worldPosition;
var stats;
var debug = true;

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

		  	}else{
		  		console.log("error load image");
		  	}
	  	};
		xhr.send();
	},
	cache: { clear: function() {} }
};

var socket;
var socketId;

var butterflies = [];

init();
animate();

var screenId;

function init() {
	setupSocket();
	UdpListener();
	container = document.createElement( 'div' );
	document.body.appendChild( container );

	// set some camera attributes
	var VIEW_ANGLE = 15,
	ASPECT = widthScreen / heightScreen,
	NEAR = 100,
	FAR = 10000;

	screenId = 3;
	camera = new THREE.OrthographicCamera( 0, widthScreen, 0, heightScreen, NEAR, FAR )

	//camera = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR );
	worldSize = new THREE.Vector3( 500, 600, 400 );
	worldPosition = new THREE.Vector3( 0, 0, 0 );

	scene1 = new THREE.Scene();
	clock = new THREE.Clock();

	// 4-light lighting

	// add subtle ambient lighting
	var ambientLight = new THREE.AmbientLight(0xcccccc);
	scene1.add(ambientLight);

	var directionalLight3 = new THREE.DirectionalLight( 0xffffff, 0.3 );
	directionalLight3.position.set( 1, 0, 0.5 );
	var directionalLight4 = new THREE.DirectionalLight( 0xffffff, 0.4 );
	directionalLight4.position.set( 0, 1, 0.5 );

	var directionalLight2 = new THREE.DirectionalLight( 0xffffff, 0.3 );
	directionalLight2.position.set( 0, -1, 0.5 );

	var directionalLight1 = new THREE.DirectionalLight( 0xffffff, 0.1 );
	directionalLight1.position.set( -1, 0, 0.5 );

	scene1.add( directionalLight1 );
	scene1.add( directionalLight2 );
	scene1.add( directionalLight3 );
	scene1.add( directionalLight4 );

	// ---------------------------------

	var idU8a = new Uint8Array(18);
	var s = atob("53b017a6be25ac6b097860d2");
	for (var i=0; i<18; i++) {
		idU8a[i] = s.charCodeAt(i);
	}

	for (var i=0; i<3; i++) {
		var b = new Butterfly();
		b.butterflyStatus.setId(idU8a);
		b.position = new THREE.Vector3();
		b.position.set(-150 + 150*i, 0, 0);
		b.opacity = 0;
		b.opacityTarget = b.opacity;
		b.scale = 0.01;
		b.scaleTarget = b.scale;
		butterflies.push(b);
	}

	// ---------------------------------
	renderer = new THREE.WebGLRenderer({antialias: false});
	renderer.setClearColor( 0x000000 );
	renderer.setSize( widthScreen, heightScreen );

	renderer.domElement.style.width = '100%';
	renderer.domElement.style.height = 'auto';

	// postprocessing
	composer = new THREE.EffectComposer( renderer );
	// Double resolution (twice the size of the canvas)
	var sampleRatio = 2;
	composer.setSize(widthScreen * sampleRatio, heightScreen * sampleRatio);
	composer.addPass( new THREE.RenderPass( scene1, camera ) );
	
	var hsvPass = new THREE.ShaderPass( hsvShader );
	//hsvPass.renderToScreen = true;
	composer.addPass(hsvPass);

	var fxaa = new THREE.ShaderPass( THREE.FXAAShader );
	fxaa.uniforms[ 'resolution' ].value = new THREE.Vector2( 1/widthScreen, 1/heightScreen );
	fxaa.renderToScreen = true;
	composer.addPass( fxaa );

	container.appendChild( renderer.domElement );

	stats = new Stats();
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.top = '0px';
	//container.appendChild( stats.domElement );
}

function animate() {
	requestAnimationFrame( animate );

	for (var i=0; i<butterflies.length; i++) {
		if (!butterflies[i].receivedHandMovement) {
			//moveBfly(i, 160-Math.cos(Date.now()/300)*30, 120-Math.sin(Date.now()/300)*30, Math.sin(Date.now()/900)*500+501);
			moveBfly(i, 160, 120, 1);
		}
		var b = butterflies[i];
		var bs = b.butterflyStatus;
		bs.state = 'resting';
		b.opacity += (b.opacityTarget - b.opacity)*0.1;
		bs.opacity = b.opacity;
		bs.update();
		var scale = b.position.z;
		b.position.z = -150;
		bs.status.position.set(b.position.x, b.position.y, b.position.z);
		bs.status.lookAt.copy(bs.status.position).add(new THREE.Vector3(0,-1,0));
		bs.status.opacity = b.opacity;
		b.updateGroups(bs.status);
		b.scale += (b.scaleTarget - b.scale)*0.1;
		b.group1.scale.set(b.scale, b.scale, b.scale);
	}

	render(clock.getDelta());
	stats.update();
}

function render(dt) {
	now = performance.now();
	composer.render();
}




