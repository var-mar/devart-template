
var BIRDS = 1024;

THREE.CustomGeometry = function () {

	THREE.Geometry.call( this );

	BIRDS = WIDTH * WIDTH;

	var verts = this.vertices;
	var faces = this.faces;
	var uvs = this.faceVertexUvs[ 0 ];

	var fi = 0;

	for (var f = 0; f<BIRDS; f++ ) {

		// wings
		var wingsSpan = 30;
		var wingsWidth = 30;

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
			new THREE.Vector2(1, 0),
			new THREE.Vector2(0, 0),
			new THREE.Vector2(1, 1)
		]);

		uvs.push([
			new THREE.Vector2(0, 0),
			new THREE.Vector2(0, 1),
			new THREE.Vector2(1, 1)
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
			new THREE.Vector2(1, 0),
			new THREE.Vector2(0, 0),
			new THREE.Vector2(1, 1)
		]);

		uvs.push([
			new THREE.Vector2(0, 0),
			new THREE.Vector2(0, 1),
			new THREE.Vector2(1, 1)
		]);
		
		// body (need to be remove it)
		
		verts.push(
			new THREE.Vector3(0, -0, -20),
			new THREE.Vector3(0, 0, -20),
			new THREE.Vector3(0, 0, 30)
		);

		faces.push(new THREE.Face3(
			fi++,
			fi++,
			fi++
		));

		uvs.push([
			new THREE.Vector2(0, 0),
			new THREE.Vector2(0, 1),
			new THREE.Vector2(1, 1)
		]);
		
	}


	this.applyMatrix( new THREE.Matrix4().makeScale( 0.2, 0.2, 0.2 ) );

	this.computeCentroids();
	this.computeFaceNormals();
	this.computeVertexNormals();

}


THREE.CustomGeometry.prototype = Object.create( THREE.Geometry.prototype );


function initBirds() {
	var geometry = new THREE.CustomGeometry( );


	// For Vertex Shaders
	birdAttributes = {
		index: { type: 'i', value: [] },
		birdColor: {	type: 'c', value: [] },
		reference: { type: 'v2', value: [] },
		birdVertex: { type: 'f', value: [] },
	};

	// For Vertex and Fragment
	birdUniforms = {

		color:     { type: "c", value: new THREE.Color( 0xff2200 ) },
		texturePosition:     { type: "t", value: null },
		textureVelocity:     { type: "t", value: null },
		time: { type: "f", value: 1.0 },
		delta: { type: "f", value: 0.0 },
		texture1: { type: "t", value:THREE.ImageUtils.loadTexture( "imgs/butterfly_wind.png" )}

	};

	// ShaderMaterial
	var shaderMaterial = new THREE.ShaderMaterial( {
		uniforms: 		birdUniforms,
		attributes:     birdAttributes,
		vertexShader:   document.getElementById( 'birdVS' ).textContent,
		fragmentShader: document.getElementById( 'birdFS' ).textContent,
		side: THREE.DoubleSide,
		transparent: true
		//wireframe: true

	});

	//geometry.dynamic = true;

	var vertices = geometry.vertices;
	var birdColors = birdAttributes.birdColor.value;
	var references = birdAttributes.reference.value;
	var birdVertex = birdAttributes.birdVertex.value;

	for( var v = 0; v < vertices.length; v++ ) {

		var i = ~~(v / 3);
		var x = (i % WIDTH) / WIDTH;
		var y = ~~(i / WIDTH) / WIDTH;

		birdColors[ v ] = new THREE.Color(
			Math.random() * 0xffffff
			// ~~(v / 9) / BIRDS * 0xffffff
		);
		references[ v ] = new THREE.Vector2( x, y );
		birdVertex[ v ] = v % (15);
	}


	// var 
	birdMesh = new THREE.Mesh( geometry, shaderMaterial );
	birdMesh.rotation.y = Math.PI / 2;
	birdMesh.sortObjects = false;

	birdMesh.matrixAutoUpdate = false;
	birdMesh.updateMatrix();

	scene.add(birdMesh);

}
