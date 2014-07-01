
var groupButteflies = 100;

THREE.CustomGeometry = function () {

	THREE.Geometry.call( this );

	var verts = this.vertices;
	var faces = this.faces;
	var uvs = this.faceVertexUvs[ 0 ];

	var fi = 0;

	for (var f = 0; f<groupButteflies; f++ ) {
		var xf = (f%10);
		var yf = Math.floor(f/10);
		// wings
		var wingsSpan = 40*3.5;
		var wingsWidth = 60*3.5;

		verts.push(
			new THREE.Vector3(0, 0, -wingsWidth),
			new THREE.Vector3(-wingsSpan, 0, -wingsWidth),
			new THREE.Vector3(0, 0, wingsWidth)
		);

		verts.push(
			new THREE.Vector3(-wingsSpan, 0, -wingsWidth),
			new THREE.Vector3(-wingsSpan, 0, wingsWidth),
			new THREE.Vector3(0, 0, wingsWidth)
		);
		
		faces.push(new THREE.Face3(
			fi++,
			fi++,
			fi++
		));

		faces.push(new THREE.Face3(
			fi++,
			fi++,
			fi++
		));

		uvs.push([
			new THREE.Vector2((1+xf)*0.1, yf*0.2),
			new THREE.Vector2(xf*0.1, yf*0.2),
			new THREE.Vector2((1+xf)*0.1, (1+yf)*0.2)
		]);

		uvs.push([
			new THREE.Vector2(xf*0.1, yf*0.2),
			new THREE.Vector2(xf*0.1, (1+yf)*0.2),
			new THREE.Vector2((1+xf)*0.1, (1+yf)*0.2)
		]);
        
		// extra triangel
		
		verts.push(
			new THREE.Vector3(0, 0, -wingsWidth),
			new THREE.Vector3(wingsSpan, 0, -wingsWidth),
			new THREE.Vector3(0, 0, wingsWidth)
		);

		verts.push(
			new THREE.Vector3(wingsSpan, 0, -wingsWidth),
			new THREE.Vector3(wingsSpan, 0, wingsWidth),
			new THREE.Vector3(0, 0, wingsWidth)
		);

		faces.push(new THREE.Face3(
			fi++,
			fi++,
			fi++
		));

		faces.push(new THREE.Face3(
			fi++,
			fi++,
			fi++
		));

		uvs.push([
			new THREE.Vector2((1+xf)*0.1, yf*0.2),
			new THREE.Vector2(xf*0.1, yf*0.2),
			new THREE.Vector2((1+xf)*0.1, (1+yf)*0.2)
		]);

		uvs.push([
			new THREE.Vector2(xf*0.1, yf*0.2),
			new THREE.Vector2(xf*0.1, (1+yf)*0.2),
			new THREE.Vector2((1+xf)*0.1, (1+yf)*0.2)
		]);
		
	}

	this.applyMatrix( new THREE.Matrix4().makeScale( 0.2, 0.2, 0.2 ) );

	//this.computeCentroids();
	this.computeFaceNormals();
	this.computeVertexNormals();
}

THREE.CustomGeometry.prototype = Object.create( THREE.Geometry.prototype );

// each group have 50 butterflies 
function addGroupButterflies() {
	var startId = groupButterFliesAr.length*totalGroupButterflies;
	var bunchId = groupButterFliesAr.length;
	var geometry = new THREE.CustomGeometry( );
	createNewButterfliesCanvas();
	// render is for debug
	renderOnCanvas(bunchId);

	// For Vertex Shaders
	var butterflyAttributes = {
		index: { type: 'i', value: [] },
		reference: { type: 'v2', value: [] },
		butterflyVertex: { type: 'f', value: [] },
	};

	// For Vertex and Fragment
	var butterflyUniforms = {
		color:     { type: "c", value: new THREE.Color( 0xff2200 ) },
		texturePosition:     { type: "t", value: null },
		textureVelocity:     { type: "t", value: null },
		time: { type: "f", value: 1.0 },
		delta: { type: "f", value: 0.0 },
		texture1: { type: "t", value:getCanvas(bunchId)}//   value:THREE.ImageUtils.loadTexture( "imgs/export-texture_2000x2000b.png")
	};
	boidUniformsAr.push(butterflyUniforms);

	// ShaderMaterial
	var shaderMaterial = new THREE.ShaderMaterial( {
		uniforms: 		butterflyUniforms,
		attributes:     butterflyAttributes,
		vertexShader:   document.getElementById( 'butterflyVS' ).textContent,
		fragmentShader: document.getElementById( 'butterflyFS' ).textContent,
		side: THREE.DoubleSide,
		transparent: true,
		alphaTest:0.05
		//blending: THREE.AdditiveBlending, 
		//,depthTest: false
	});

	geometry.dynamic = true;

	var vertices = geometry.vertices;
	var references = butterflyAttributes.reference.value;
	var butterflyVertex = butterflyAttributes.butterflyVertex.value;

	var totalVerticesForButterFly = 12;
	// console.log("-----------------------------");
	for( var v = 0; v < vertices.length; v++ ) {
		var i = (~~(v / totalVerticesForButterFly))+startId;
		var x = (i % WIDTH) / WIDTH;
		var y = ~~(i / WIDTH) / WIDTH;
		//console.log(i+"| "+x+" "+y);
		//alert(x+" "+y )
		references[ v ] = new THREE.Vector2( x, y );
		butterflyVertex[ v ] = v % (totalVerticesForButterFly);
	}

	var butterflyMesh = new THREE.Mesh( geometry, shaderMaterial );
	butterflyMesh.rotation.y = Math.PI / 2;
	butterflyMesh.sortObjects = false;

	butterflyMesh.matrixAutoUpdate = false;
	butterflyMesh.updateMatrix();
	return butterflyMesh;
}

function createNewButterfliesCanvas(){
	// Create image
	if($("#canvasTextures").length == 0){
		$("body").append("<div id=\"canvasTextures\"></div>");
	}
	var i = canvasRenderButterfliesAr.length;
	var canvas_id = "canvasButterfliesRender"+i.toString();
	$("#canvasTextures").append("<canvas id=\""+canvas_id+"\">");
	var bitmap = document.getElementById(canvas_id);
	bitmap.width = 2000;
	bitmap.height = 2000;
	var g = bitmap.getContext('2d');
	g.fillStyle = 'rgba(0,0,0,0)';
	g.fillRect(0,0,bitmap.width, bitmap.height);
	canvasRenderButterfliesAr.push(bitmap);
	// create canvas
	var texture = new THREE.Texture(canvasRenderButterfliesAr[i]) ;
	texture.magFilter = THREE.NearestFilter;
	texture.minFilter = THREE.NearestFilter;
	texture.needsUpdate = true;
	textureRenderButterfliesAr.push(texture);
}

function renderOnCanvas(i){
	var g = canvasRenderButterfliesAr[i].getContext('2d');
	// render in the texture text
	var text = "adasdas adads";
	g.font = 'Bold 20px Arial';
	g.fillStyle = 'white';
	g.fillText(text, 0, 20);
	g.strokeStyle = 'black';
	g.strokeText(text, 0, 20);
	var img = new Image();
	img.onload = function() {
		var g = canvasRenderButterfliesAr[i].getContext('2d');
		g.drawImage(img, 0, 0);
		manager.addTextureIdToUpdate(i);
		// create canvas
		var texture = new THREE.Texture(canvasRenderButterfliesAr[i]) 
		texture.needsUpdate = true;
		texture.magFilter = THREE.NearestFilter;
		texture.minFilter = THREE.NearestFilter;
		textureRenderButterfliesAr[i] = texture;
	}
	img.src = 'imgs/export-texture_2000x2000b.png';
}

function getCanvas(i){
	// Canvas contents will be used for a texture
	return textureRenderButterfliesAr[i];
}

function initButterflies() {
	boidUniformsAr =  new Array();
	canvasRenderButterfliesAr = new Array();
	textureRenderButterfliesAr  = new Array();
	groupButterFliesAr = new Array();
	createNewButterfliesCanvas();
	// Create bunch butterflies
	for(var y=0;y<2;y++){
		groupButterFliesAr.push(addGroupButterflies());
	}
	// Add bunch butterflies to scene
	for(var i=0;i<groupButterFliesAr.length;i++){
		scene.add(groupButterFliesAr[i]);
	}
}
