var Butterfly_wingL = function () {
	
	THREE.Geometry.call( this );

	var verts = this.vertices;
	var faces = this.faces;
	var uvs = this.faceVertexUvs[ 0 ];

	var fi = 0;

	// wings
	var wingsSpan = 10;
	var wingsWidth = 12;

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
     
	this.applyMatrix( new THREE.Matrix4().makeScale( 1, 1, 1 ) );

	//this.computeCentroids();
	this.computeFaceNormals();
	this.computeVertexNormals();

}
Butterfly_wingL.prototype = Object.create( THREE.Geometry.prototype );

var Butterfly_wingR = function () {
	
	THREE.Geometry.call( this );

	var verts = this.vertices;
	var faces = this.faces;
	var uvs = this.faceVertexUvs[ 0 ];

	var fi = 0;

	// wings
	var wingsSpan = 10;
	var wingsWidth = 12;
	
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
	
	this.applyMatrix( new THREE.Matrix4().makeScale( 1, 1, 1 ) );

	//this.computeCentroids();
	this.computeFaceNormals();
	this.computeVertexNormals();

}
Butterfly_wingR.prototype = Object.create( THREE.Geometry.prototype );

function Butterfly(){
	var butterflyTexture = new THREE.ImageUtils.loadTexture( 'imgs/butterfly_wind.png' );
	var simpleMaterial = new THREE.MeshBasicMaterial( { 
		map: butterflyTexture, 
		side: THREE.DoubleSide, 
		transparent: true,
		opacity:1,
		alphaTest:0.05
	});
	var butterflyTexture2 = new THREE.ImageUtils.loadTexture( 'imgs/butterfly_wind.png' );
	var simpleMaterial2 = new THREE.MeshBasicMaterial( { 
		map: butterflyTexture, 
		side: THREE.DoubleSide, 
		transparent: true,
		opacity:1,
		alphaTest:0.05
	});
	var  geometryL = new Butterfly_wingL();
	this.wingL = new THREE.Mesh( geometryL, simpleMaterial );
	var  geometryR = new Butterfly_wingR();
	this.wingR = new THREE.Mesh( geometryR, simpleMaterial2 );
	scene.add( this.wingL );
	scene.add( this.wingR );
}
Butterfly.prototype = function(){
}