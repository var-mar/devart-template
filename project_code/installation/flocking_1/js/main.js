// Array Remove - By John Resig (MIT Licensed)
Array.prototype.remove = function(from, to) {
	var rest = this.slice((to || from) + 1 || this.length);
	this.length = from < 0 ? this.length + from : from;
	return this.push.apply(this, rest);
};


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

var widthScreen= 1920,
heightScreen = 1200,
SCREEN_WIDTH_HALF = widthScreen  / 2,
SCREEN_HEIGHT_HALF = heightScreen / 2;

var clock;

var camera1,camera2, scene1, scene2, renderer1,renderer2,
butterflys, butterfly, butterfly2;

var boid, boids;
var maximumButterflies = 80;
var composer1,composer2, composer, composers = [];
var worldSize,worldPosition;
var stats;
var bId = 0;
var idArr = new Uint8Array(18);

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

var butterflyData = f32buf;

function deleteOldestButterfly(){
	deleteButterfly((butterflyIndex+20) % butterflyArray.length);
}

//var gui = new dat.GUI();

var makeLightController = function(light) {
	var control = {
		color: '#888888',
		intensity: 0.5,
		x: 0,
		y: 0,
		z: 0
	};
	gui.addColor(control, 'lightColor');
	gui.add(control, 'intensity', 0, 5, 0.1);
	gui.add(control, 'x', -150, 150);
	gui.add(control, 'y', -150, 150);
	gui.add(control, 'z', -150, 150);
}

function init() 
{



	clock = new THREE.Clock();

	// set some camera attributes
	var VIEW_ANGLE = 15,
	ASPECT = widthScreen / heightScreen,
	NEAR = 100,
	FAR = 10000;

	camera1 = createBlendingCamera(
	    VIEW_ANGLE,
	    ASPECT,
	    NEAR,
	    FAR,
	    1
	);

	camera2 = createBlendingCamera(
	    VIEW_ANGLE,
	    ASPECT,
	    NEAR,
	    FAR,
	    2
	);

	scene1 = new THREE.Scene();
	scene2 = new THREE.Scene();

	// mesh to see volume of the walls for boids
	worldSize = new THREE.Vector3( 500, 600, 400 );
	worldPosition = new THREE.Vector3( 0, 450, 0 );
	
	// just to debug",
	if(debug){
	//	showWallsBoids();
	}

	boids = [];

	for (var i=0; i<100; i++) {
		butterflyArray.push(new Butterfly());
		butterflyArray[i].hide();
	}

	var lightSetup = 1;

	if (lightSetup == 0) {

		// blue butterflies

		// add subtle ambient lighting
		var ambientLight = new THREE.AmbientLight(0x222222);
		scene1.add(ambientLight);
		scene2.add(ambientLight.clone());

		var directionalLight1 = new THREE.DirectionalLight( 0xffecdd, 0.9 );
		directionalLight1.position.set( 0, 950, 250 );
		directionalLight1.target.position.set(0, 500, 0);

		var directionalLight2 = new THREE.DirectionalLight( 0x544555, 0.1 );
		directionalLight2.position.set( 0, -1, -0.2 );

		directionalLight1.castShadow = true;
		directionalLight1.shadowCameraVisible = true;
	    directionalLight1.shadowMapWidth = directionalLight1.shadowMapHeight = 2048;
	    directionalLight1.shadowCameraNear = 100;
	    directionalLight1.shadowCameraFar = 1000;
	    directionalLight1.shadowDarkness = 0.5;
	    
	    var d = 250;

	    directionalLight1.shadowCameraLeft = -d;
	    directionalLight1.shadowCameraRight = d;
	    directionalLight1.shadowCameraTop = d;
	    directionalLight1.shadowCameraBottom = -d;

		// directionalLight2.castShadow = true;
		
		scene1.add( directionalLight1 );
		scene2.add( directionalLight1.clone() );

		var groundMaterial = new THREE.MeshPhongMaterial({
		    color: 0x222222
		});
		plane = new THREE.Mesh(new THREE.PlaneGeometry(500, 1500), groundMaterial);
		plane.position.y = 600;
		plane.position.z = -153;
		//plane.rotation.x = -Math.PI / 2;
		plane.receiveShadow = true;

		// fog
		scene1.fog = new THREE.Fog(0x000000, 3850, 4550);
		scene2.fog = new THREE.Fog(0x000000, 3850, 4550);
    	    	
		scene1.add( directionalLight2 );
		scene2.add( directionalLight2.clone() );

	} else if (lightSetup == 3) {

		// red butterflies

		// add subtle ambient lighting
		var ambientLight = new THREE.AmbientLight(0x330000);
		scene1.add(ambientLight);
		scene2.add(ambientLight.clone());

		var directionalLight1 = new THREE.DirectionalLight( 0xff0000, 1.9 );
		directionalLight1.position.set( 0, 1, 0.2 );
		var directionalLight2 = new THREE.DirectionalLight( 0x880000, 0.9 );
		directionalLight2.position.set( 0, -1, -0.2 );

		directionalLight1.castShadow = true;
		directionalLight2.castShadow = true;
		
		scene1.add( directionalLight1 );
		scene2.add( directionalLight1.clone() );

		scene1.add( directionalLight2 );
		scene2.add( directionalLight2.clone() );

	} else if (lightSetup == 1) {

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

	} else if (lightSetup == 2) {

		// colorful lighting

		// add subtle ambient lighting
		var ambientLight = new THREE.AmbientLight(0xb0aa98);
		scene1.add(ambientLight);
		scene2.add(ambientLight.clone());

		var directionalLight3 = new THREE.DirectionalLight( 0x3399ff, 0.4 );
		directionalLight3.position.set( 0, 1, 0.5 );
		var directionalLight4 = new THREE.DirectionalLight( 0x443311, 0.6 );
		directionalLight4.position.set( 0, -1, 0.5 );

		var directionalLight5 = new THREE.SpotLight( 0xffee66, 8 );
		directionalLight5.position.set( 0, 150, 50 );

		directionalLight5.castShadow = true;
		
		scene1.add( directionalLight3 );
		scene2.add( directionalLight3.clone() );

		scene1.add( directionalLight4 );
		scene2.add( directionalLight4.clone() );

		scene1.add( directionalLight5 );
		scene2.add( directionalLight5.clone() );
	}

	// screen top
	renderer1 = new THREE.WebGLRenderer({ alpha: true });
	renderer1.sortObjects = true;
	renderer1.setSize( widthScreen ,heightScreen);

	renderer1.domElement.id = 'screenTop';
	document.body.appendChild( renderer1.domElement );

	if(debug){
		stats = new Stats();
		stats.domElement.style.position = 'absolute';
		stats.domElement.style.left = '0px';
		stats.domElement.style.top = '0px';
		stats.domElement.id='stats';
		document.getElementById( 'container' ).appendChild(stats.domElement);
	}

	// Postprocessing

	var sampleRatio = 2;
	for (var i=0; i<4; i++) {
		var renderTarget = new THREE.WebGLRenderTarget(
			widthScreen * sampleRatio, 
			heightScreen * sampleRatio, 
			{ minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBFormat, stencilBuffer: false }
		);
		renderTarget.generateMipmaps = false;
		var c = new THREE.EffectComposer( renderer1, renderTarget );
		// Double resolution (twice the size of the canvas)
		c.setSize(widthScreen * sampleRatio, heightScreen * sampleRatio);
		c.addPass( new THREE.RenderPass( scene1, camera1 ) );
		var flipPass = new THREE.ShaderPass( THREE.FlipXShader );
		c.addPass( flipPass );
		composers[i] = c;
	}

	composer1 = new THREE.EffectComposer( renderer1 );
	composer1.setSize(widthScreen * sampleRatio, heightScreen * sampleRatio);
	composer1.addPass( new THREE.RenderPass( scene1, camera1 ) );

	var flipPass = new THREE.ShaderPass( THREE.FlipXShader );
	composer1.addPass( flipPass );

/*
	var mPass = new THREE.ShaderPass( THREE.Merge4Shader );
	mPass.uniforms.t0.value = composers[0].renderTarget1;
	mPass.uniforms.t1.value = composers[1].renderTarget1;
	mPass.uniforms.t2.value = composers[2].renderTarget1;
	mPass.uniforms.t3.value = composers[3].renderTarget1;
	composer1.addPass(mPass);
*/
	var hsvPass = new THREE.ShaderPass( hsvShader );
//	hsvPass.renderToScreen = true;
	composer1.addPass(hsvPass);

	var fxaa = new THREE.ShaderPass( THREE.FXAAShader );
	fxaa.uniforms[ 'resolution' ].value = new THREE.Vector2( 1/widthScreen, 1/heightScreen );
	fxaa.renderToScreen = true;
	composer1.addPass( fxaa );

}

function animate() {
	requestAnimationFrame( animate );
	render(clock.getDelta());
	stats.update();
}

var prevData = new ArrayBuffer(6400);
var prevUint8 = new Uint8Array(prevData);

function render(dt) {
	// render pipeline
	/*
	composers[3].render();

	tweenButterflies(prevData, butterflyData, 0.25);
	composers[0].render();
	tweenButterflies(prevData, butterflyData, 0.5);
	composers[1].render();
	tweenButterflies(prevData, butterflyData, 0.75);
	composers[2].render();
	*/

	composer1.render();
	//prevUint8.set(new Uint8Array(butterflyData));
}

function tweenButterflies(frame1, frame2, t) {
	var t1 = (1-t);
    var f32aDst = new Float32Array(11);
	for (var i=0; i<butterflyArray.length; i++) {
	    var f32a1 = new Float32Array(frame1, i*(4*11+20), 11);
	    var f32a2 = new Float32Array(frame2, i*(4*11+20), 11);
	    for (var j=0; j<11; j++) {
	    	f32aDst[j] = f32a1[j] * t1 + f32a2[j] * t;
	    }
	    var bfly = butterflyArray[i];
	    bfly.butterflyStatus.deserializeStatus(bfly.butterflyStatus.status, f32aDst);
        bfly.updateGroups(bfly.butterflyStatus.status);
	}
}

function updateButterflies(data) {
	butterflyData = data;
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

var closeWindow = function (){
	// close UDP
	myUdpListener.myUdpClient.close();
};

var myUdpListener = new UdpListener();
chrome.app.window.onClosed.addListener(closeWindow);
