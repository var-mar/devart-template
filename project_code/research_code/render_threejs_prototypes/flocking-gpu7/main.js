var WIDTH = 32; 
var container, stats;
var camera, scene, renderer, particles, geometry, materials = [], parameters, i, h, color;
var mouseX = 0, mouseY = 0;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

var HEIGHT = WIDTH;
var maximumBoids = WIDTH * WIDTH;

// Vars for boids and shaders
var newButterFly = false;
var groupButterFliesAr;
var boidUniformsAr;
var velocityBoidsAr;
var positionsBoidsAr;
var BOUNDS = 600, BOUNDS_HALF = BOUNDS / 2;

// Vars for postprocessing
var projector = new THREE.Projector();
var sunPosition = new THREE.Vector3( 0, 1000, -1000 );
var screenSpacePosition = new THREE.Vector3();
var postprocessing = { enabled : true };
var bgColor = 0x000511;
var sunColor = 0xffee00;
var materialDepth;

function change(n) {
	console.log(n);
	location.hash = n;
	location.reload();
	return false;
}
var totalGroupButterflies = 50;

var debug = true;
var data, texture;

var spline = new THREE.SplineCurve3();

var timer = 0;
var paused = false;

var last = performance.now();
var delta, now, t = 0;

var simulator;
var flipflop = true;
var rtPosition1, rtVelocity1;

var textureRenderButterfliesAr;
var canvasRenderButterfliesAr;
var canvasPosition;

var dtPosition;
var dtVelocity;

var rtTemp128;

var pixelsUint8Temp128Position;
var pixelsUint8Temp128Velocity;

init();
animate();	
var rendererStats;
var manager;

function init() {

	container = document.createElement('div');
	container.setAttribute("id","threejs");
	document.body.appendChild( container );

	camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 3000 );
	camera.position.y = -100;
	camera.position.z = 690;
	
	scene = new THREE.Scene();

	renderer = new THREE.WebGLRenderer({ alpha: true });
	renderer.sortObjects = false;
	renderer.setSize( window.innerWidth, window.innerHeight );
	container.appendChild( renderer.domElement );

	////////
	simulator = new SimulatorRenderer(WIDTH, renderer);

	manager = new ButterflyManager();
	// textures for store data
	dtPosition = generatePositionTexture();
	dtVelocity = generateVelocityTexture();
	// render target to render shaders flocking GPU
	rtVelocity1 = simulator.getRenderTarget();
	rtPosition1 = simulator.getRenderTarget();
	// one render target 4x bigger to compress data from float32 to vec4 Unsigned bytes(8bites*4=32)
	rtTemp128 = simulator.getRenderTarget128x32();
	// array to get return data compressed . Lenght calculations: 32 * 32 * 4(compress 1 pixel in 4) * 4 (rgba)
	pixelsUint8Temp128Position = new Uint8Array(WIDTH * WIDTH * 4 *4); 
	pixelsUint8Temp128Velocity = new Uint8Array(WIDTH * WIDTH * 4 *4); 
	// transfer initial data from textures to render target
	renderTexturePosition();
	renderTextureVelocity();
	simulator.velocityUniforms.testing.value = 1;

	/////////

	plane = new THREE.PlaneGeometry( BOUNDS, BOUNDS, 1, 1 );

	stats = new Stats();
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.top = '0px';
	stats.domElement.setAttribute("id","fpsStats");
	document.body.appendChild( stats.domElement );

	rendererStats = new THREEx.RendererStats()
	rendererStats.domElement.style.position = 'absolute';
	rendererStats.domElement.style.left = '0px';
	rendererStats.domElement.style.bottom   = '0px'
	rendererStats.domElement.setAttribute("id","renderStats");
	document.body.appendChild(rendererStats.domElement );

	
	//
	window.addEventListener( 'resize', onWindowResize, false );

	var gui = new dat.GUI();

	var effectController = {
		seperation: 111.0,
		alignment: 0.0,
		cohesion: 0.0,
		freedom: 0.75
	};

	var valuesChanger = function() {
		simulator.velocityUniforms.seperationDistance.value = effectController.seperation;
		simulator.velocityUniforms.alignmentDistance.value = effectController.alignment;
		simulator.velocityUniforms.cohesionDistance.value = effectController.cohesion;
		simulator.velocityUniforms.freedomFactor.value = effectController.freedom;
	};

	valuesChanger();
	gui.add( effectController, "seperation", 0.0, 300.0, 1.0 ).onChange( valuesChanger );
	gui.add( effectController, "alignment", 0.0, 100, 0.001 ).onChange( valuesChanger );
	gui.add( effectController, "cohesion", 0.0, 100, 0.025 ).onChange( valuesChanger );
	gui.close();

	initButterflies();
	// cube is only for debug
	if(debug){
		/*
		cube = new THREE.Mesh(
			new THREE.CubeGeometry( BOUNDS, BOUNDS, BOUNDS),
			new THREE.MeshBasicMaterial( {color: 0xFFFFFF, wireframe: true, depthWrite: false} )
		);
		cube.rotation.x = -Math.PI / 2;
		cube.position.y = 0;
		scene.add(cube);
		*/
	}

	// Add stats
	var htmlLog = "<div id=\"generalStats\" >";
	htmlLog += "<span id=\"totalButterfliesLabel\"></span></br><hr>";
	htmlLog += "<span id=\"log\"></span></br><hr>";
	htmlLog += "<span id=\"log1\"></span></br><span id=\"log2\"></span></br><hr>";
	htmlLog += "<span id=\"log3\"></span></br><span id=\"log4\"></span></br><hr>";
	htmlLog += "<span id=\"log5\"></span></br><span id=\"log6\"></span></br><hr>";
	htmlLog += "</div>";

	$("body").append(htmlLog);
	//initPostprocessing();
	manager.createPath(0, new THREE.Vector3( 394 , -711 , 0));
	setupSocket();
}

function toFixed(value, precision) {
    var precision = precision || 0,
    neg = value < 0,
    power = Math.pow(10, precision),
    value = Math.round(value * power),
    integral = String((neg ? Math.ceil : Math.floor)(value / power)),
    fraction = String((neg ? -value : value) % power),
    padding = new Array(Math.max(precision - fraction.length, 0) + 1).join('0');
    return precision ? integral + '.' +  padding + fraction : integral;
}

function onWindowResize() {
	windowHalfX = window.innerWidth / 2;
	windowHalfY = window.innerHeight / 2;
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
}

function animate() {
	requestAnimationFrame( animate );
	render();
	// call each update function
	stats.update();
	rendererStats.update(renderer);
}

function render() {
	//renderer.clear();
	
	now = performance.now()
	delta = (now - last) / 1000;
	if (delta > 1) delta = 1; // safety cap on large deltas
	last = now;

	if (!paused){
		
		manager.update();

		// update 
		updateDataTexture(dtVelocity,velocityBoidsAr);
        updateDataTexture(dtPosition,positionsBoidsAr);
		// Flocking butterflies GPU -> render target -> readpixels -> texture
		// render in a RT the velocity calculated in GPU 
		simulator.renderVelocity(dtPosition, dtVelocity, rtVelocity1, delta);
		// Get pixels and save array float32
		getFullDataTextureVelocity(rtVelocity1);
		// Save pixels in a texture and update
		updateDataTexture(dtVelocity,velocityBoidsAr);
		// render in GPU flocking butterflies
		simulator.renderPosition(dtPosition, dtVelocity, rtPosition1, delta);
		// Get pixels and save array float32
		getFullDataTexturePosition(rtPosition1);
		// update
		// Save pixels in a texture and update
		updateDataTexture(dtPosition,positionsBoidsAr);

		// display 
		// position
		$("#log2").html( " x:"+toFixed(positionsBoidsAr[ 0 ],2)+" y:"+toFixed(positionsBoidsAr[ 1 ],2)+" z:"+toFixed(positionsBoidsAr[ 2 ],2)+" w:"+toFixed(positionsBoidsAr[ 3 ],2) );
		$("#log4").html( " x:"+toFixed(positionsBoidsAr[ 4+0 ],2)+" y:"+toFixed(positionsBoidsAr[ 4+1 ],2)+" z:"+toFixed(positionsBoidsAr[ 4+2 ],2)+" w:"+toFixed(positionsBoidsAr[ 4+3 ],2) );
		$("#log6").html( " x:"+toFixed(positionsBoidsAr[ 8+0 ],2)+" y:"+toFixed(positionsBoidsAr[ 8+1 ],2)+" z:"+toFixed(positionsBoidsAr[ 8+2 ],2)+" w:"+toFixed(positionsBoidsAr[ 8+3 ],2) );
		// velocity
		$("#log1").html( " x:"+toFixed(velocityBoidsAr[ 0 ],2)+" y:"+toFixed(velocityBoidsAr[ 1 ],2)+" z:"+toFixed(velocityBoidsAr[ 2 ],2)+" w:"+toFixed(velocityBoidsAr[ 3 ],2) );
		$("#log3").html( " x:"+toFixed(velocityBoidsAr[ 4+0 ],2)+" y:"+toFixed(velocityBoidsAr[ 4+1 ],2)+" z:"+toFixed(velocityBoidsAr[ 4+2 ],2)+" w:"+toFixed(velocityBoidsAr[ 4+3 ],2) );
		$("#log5").html( " x:"+toFixed(velocityBoidsAr[ 8+0 ],2)+" y:"+toFixed(velocityBoidsAr[ 8+1 ],2)+" z:"+toFixed(velocityBoidsAr[ 8+2 ],2)+" w:"+toFixed(velocityBoidsAr[ 8+3 ],2) );
	
		// Pass variables to boids
		for(var i=0;i<boidUniformsAr.length;i++){
			boidUniformsAr[i].texturePosition.value = dtPosition;
			boidUniformsAr[i].textureVelocity.value = dtVelocity;
			boidUniformsAr[i].time.value = now;
			boidUniformsAr[i].delta.value = delta;
		}
	}
	camera.lookAt( scene.position );
	renderer.render( scene, camera );
	//renderPosprocessing();
}

function NewButterFly(){
	manager.addTextureIdToUpdate(0);
}