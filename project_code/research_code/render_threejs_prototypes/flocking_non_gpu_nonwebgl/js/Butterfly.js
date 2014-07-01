var Butterfly = function () {

	THREE.Geometry.call( this );

	var verts = this.vertices;
	var faces = this.faces;
	var uvs = this.faceVertexUvs[ 0 ];

	var fi = 0;

	// wings
	var wingsSpan = 120;
	var wingsWidth = 80;

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
		
	this.applyMatrix( new THREE.Matrix4().makeScale( 0.2, 0.2, 0.2 ) );

	this.computeCentroids();
	this.computeFaceNormals();
	this.computeVertexNormals();

}
Butterfly.prototype = Object.create( THREE.Geometry.prototype );
