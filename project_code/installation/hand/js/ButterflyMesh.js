var ButterflyGeometry = function () {
	
	THREE.Geometry.call( this );

	var verts = this.vertices;
	var faces = this.faces;
	var uvs = this.faceVertexUvs[ 0 ];

	var fi = 0;

	// Wings
	this.wingsSpan = 10;
	this.wingsWidth = 12;

	// LEFT
	this.wingL2 = function(){
		verts.push(
			new THREE.Vector3(0, 0, -this.wingsWidth),
			new THREE.Vector3(-this.wingsSpan, 0, -this.wingsWidth),
			new THREE.Vector3(0, 0, this.wingsWidth)
		);

		verts.push(
			new THREE.Vector3(-this.wingsSpan, 0, -this.wingsWidth),
			new THREE.Vector3(-this.wingsSpan, 0, this.wingsWidth),
			new THREE.Vector3(0, 0, this.wingsWidth)
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
    };

    this.wingL8 = function(){
    	var totalSegments = 5;
    	var triangles = 8;

		// wing L
		//1,3,4,7,9,10,13,15,16,19,21,22

    	// triangle 1 , 2
		verts.push(
			new THREE.Vector3(0, 0, -this.wingsWidth),
			new THREE.Vector3(-this.wingsSpan, 0, -this.wingsWidth),
			new THREE.Vector3(0, 0, -this.wingsWidth*0.5)
		);

		verts.push(
			new THREE.Vector3(-this.wingsSpan, 0, -this.wingsWidth),
			new THREE.Vector3(-this.wingsSpan, 0, -this.wingsWidth*0.5),
			new THREE.Vector3(0, 0, -this.wingsWidth*0.5)
		);
		// triangle 3 , 4
		verts.push(
			new THREE.Vector3(0, 0, -this.wingsWidth*0.5),
			new THREE.Vector3(-this.wingsSpan, 0, -this.wingsWidth*0.5),
			new THREE.Vector3(0, 0, -this.wingsWidth*0)
		);

		verts.push(
			new THREE.Vector3(-this.wingsSpan, 0, -this.wingsWidth*0.5),
			new THREE.Vector3(-this.wingsSpan, 0, -this.wingsWidth*0),
			new THREE.Vector3(0, 0, -this.wingsWidth*0)
		);
		// triangle 5 , 6
		verts.push(
			new THREE.Vector3(0, 0, -this.wingsWidth*0),
			new THREE.Vector3(-this.wingsSpan, 0, -this.wingsWidth*0),
			new THREE.Vector3(0, 0, this.wingsWidth*0.5)
		);

		verts.push(
			new THREE.Vector3(-this.wingsSpan, 0, -this.wingsWidth*0),
			new THREE.Vector3(-this.wingsSpan, 0, this.wingsWidth*0.5),
			new THREE.Vector3(0, 0, this.wingsWidth*0.5)
		);
		// triangle 7 , 8
		verts.push(
			new THREE.Vector3(0, 0, this.wingsWidth*0.5),
			new THREE.Vector3(-this.wingsSpan, 0, this.wingsWidth*0.5),
			new THREE.Vector3(0, 0, this.wingsWidth)
		);

		verts.push(
			new THREE.Vector3(-this.wingsSpan, 0, this.wingsWidth*0.5),
			new THREE.Vector3(-this.wingsSpan, 0, this.wingsWidth),
			new THREE.Vector3(0, 0, this.wingsWidth)
		);

		for(i=0; i<triangles; i++){
			faces.push(new THREE.Face3(
				fi++,
				fi++,
				fi++
			));
		}
		/* ------- */
		uvs.push([
			new THREE.Vector2(1, 0),
			new THREE.Vector2(0, 0),
			new THREE.Vector2(1, 0.25)
		]);

		uvs.push([
			new THREE.Vector2(0, 0),
			new THREE.Vector2(0, 0.25),
			new THREE.Vector2(1, 0.25)
		]);
		uvs.push([
			new THREE.Vector2(1, 0.25),
			new THREE.Vector2(0, 0.25),
			new THREE.Vector2(1, 0.5)
		]);

		uvs.push([
			new THREE.Vector2(0, 0.25),
			new THREE.Vector2(0, 0.5),
			new THREE.Vector2(1, 0.5)
		]);
		uvs.push([
			new THREE.Vector2(1, 0.5),
			new THREE.Vector2(0, 0.5),
			new THREE.Vector2(1, 0.75)
		]);

		uvs.push([
			new THREE.Vector2(0, 0.5),
			new THREE.Vector2(0, 0.75),
			new THREE.Vector2(1, 0.75)
		]);
		uvs.push([
			new THREE.Vector2(1, 0.75),
			new THREE.Vector2(0, 0.75),
			new THREE.Vector2(1, 1)
		]);

		uvs.push([
			new THREE.Vector2(0, 0.75),
			new THREE.Vector2(0, 1),
			new THREE.Vector2(1, 1)
		]);
    };
    
    this.wingLC = function(totalSegments){
    	// Wing left
    	for(var i=0;i<totalSegments;i++){
    		var valueUp   =   Math.map_range(  i*(1/totalSegments),		0.0,1.0,-1.0,1.0 );
    		var valueDown =   Math.map_range( (i+1)*(1.0/totalSegments),0.0,1.0,-1.0,1.0 );

	    	verts.push(
				new THREE.Vector3(0, 0, this.wingsWidth*valueUp ),
				new THREE.Vector3(-this.wingsSpan, 0, this.wingsWidth*valueUp),
				new THREE.Vector3(0, 0, this.wingsWidth*valueDown)
			);

			verts.push(
				new THREE.Vector3(-this.wingsSpan, 0, this.wingsWidth*valueUp ),
				new THREE.Vector3(-this.wingsSpan, 0, this.wingsWidth*valueDown),
				new THREE.Vector3(0, 0, this.wingsWidth*valueDown)
			);
		}
    	// add triangles
    	for(i=0; i<totalSegments; i++){
			faces.push(new THREE.Face3(
				fi++,
				fi++,
				fi++
			));
			this.verticesHeightRLAr.push(fi-2);
			this.verticesHeightLAr.push(fi-2);
			faces.push(new THREE.Face3(
				fi++,
				fi++,
				fi++
			));
			this.verticesHeightRLAr.push(fi-3);
			this.verticesHeightRLAr.push(fi-2);
			this.verticesHeightLAr.push(fi-3);
			this.verticesHeightLAr.push(fi-2);
		}
    	// UV coordinates
    	for(var i=0;i<totalSegments;i++){
    		var valueUp = i*(1/totalSegments);
    		var valueDown = (i+1)*(1.0/totalSegments);
		    uvs.push([
				new THREE.Vector2(1, valueUp),
				new THREE.Vector2(0, valueUp),
				new THREE.Vector2(1, valueDown)
			]);

			uvs.push([
				new THREE.Vector2(0, valueUp),
				new THREE.Vector2(0, valueDown),
				new THREE.Vector2(1, valueDown)
			]);
    	}
    };

	// RIGHT
	this.wingR2 = function(){
		verts.push(
			new THREE.Vector3(0, 0, -this.wingsWidth),
			new THREE.Vector3(this.wingsSpan, 0, -this.wingsWidth),
			new THREE.Vector3(0, 0, this.wingsWidth)
		);

		verts.push(
			new THREE.Vector3(this.wingsSpan, 0, -this.wingsWidth),
			new THREE.Vector3(this.wingsSpan, 0, this.wingsWidth),
			new THREE.Vector3(0, 0, this.wingsWidth)
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
	};

	this.wingR8 = function(){
		var triangles = 8;

		// 25,27,28,31,33,34,37,39,40,43,45,46
		verts.push(
			new THREE.Vector3(0, 0, -this.wingsWidth),
			new THREE.Vector3(this.wingsSpan, 0, -this.wingsWidth),
			new THREE.Vector3(0, 0, -this.wingsWidth*0.5)
		);

		verts.push(
			new THREE.Vector3(this.wingsSpan, 0, -this.wingsWidth),
			new THREE.Vector3(this.wingsSpan, 0, -this.wingsWidth*0.5),
			new THREE.Vector3(0, 0, -this.wingsWidth*0.5)
		);
		// triangle 3 , 4
		verts.push(
			new THREE.Vector3(0, 0, -this.wingsWidth*0.5),
			new THREE.Vector3(this.wingsSpan, 0, -this.wingsWidth*0.5),
			new THREE.Vector3(0, 0, -this.wingsWidth*0)
		);

		verts.push(
			new THREE.Vector3(this.wingsSpan, 0, -this.wingsWidth*0.5),
			new THREE.Vector3(this.wingsSpan, 0, -this.wingsWidth*0),
			new THREE.Vector3(0, 0, -this.wingsWidth*0)
		);
		// triangle 5 , 6
		verts.push(
			new THREE.Vector3(0, 0, -this.wingsWidth*0),
			new THREE.Vector3(this.wingsSpan, 0, -this.wingsWidth*0),
			new THREE.Vector3(0, 0, this.wingsWidth*0.5)
		);

		verts.push(
			new THREE.Vector3(this.wingsSpan, 0, -this.wingsWidth*0),
			new THREE.Vector3(this.wingsSpan, 0, this.wingsWidth*0.5),
			new THREE.Vector3(0, 0, this.wingsWidth*0.5)
		);
		// triangle 7 , 8
		verts.push(
			new THREE.Vector3(0, 0, this.wingsWidth*0.5),
			new THREE.Vector3(this.wingsSpan, 0, this.wingsWidth*0.5),
			new THREE.Vector3(0, 0, this.wingsWidth)
		);

		verts.push(
			new THREE.Vector3(this.wingsSpan, 0, this.wingsWidth*0.5),
			new THREE.Vector3(this.wingsSpan, 0, this.wingsWidth),
			new THREE.Vector3(0, 0, this.wingsWidth)
		);

		for(i=0; i<triangles; i++){
			faces.push(new THREE.Face3(
				fi++,
				fi++,
				fi++
			));
		}

		/* ------- */
		uvs.push([
			new THREE.Vector2(1, 0),
			new THREE.Vector2(0, 0),
			new THREE.Vector2(1, 0.25)
		]);

		uvs.push([
			new THREE.Vector2(0, 0),
			new THREE.Vector2(0, 0.25),
			new THREE.Vector2(1, 0.25)
		]);
		uvs.push([
			new THREE.Vector2(1, 0.25),
			new THREE.Vector2(0, 0.25),
			new THREE.Vector2(1, 0.5)
		]);

		uvs.push([
			new THREE.Vector2(0, 0.25),
			new THREE.Vector2(0, 0.5),
			new THREE.Vector2(1, 0.5)
		]);
		uvs.push([
			new THREE.Vector2(1, 0.5),
			new THREE.Vector2(0, 0.5),
			new THREE.Vector2(1, 0.75)
		]);

		uvs.push([
			new THREE.Vector2(0, 0.5),
			new THREE.Vector2(0, 0.75),
			new THREE.Vector2(1, 0.75)
		]);
		uvs.push([
			new THREE.Vector2(1, 0.75),
			new THREE.Vector2(0, 0.75),
			new THREE.Vector2(1, 1)
		]);

		uvs.push([
			new THREE.Vector2(0, 0.75),
			new THREE.Vector2(0, 1),
			new THREE.Vector2(1, 1)
		]);
	};

	this.wingRC = function(totalSegments){
		// Wing left
    	for(var i=0;i<totalSegments;i++){
    		var valueUp   =   Math.map_range(  i*(1/totalSegments),		0.0,1.0,-1.0,1.0 );
    		var valueDown =   Math.map_range( (i+1)*(1.0/totalSegments),0.0,1.0,-1.0,1.0 );

	    	verts.push(
				new THREE.Vector3(0, 0, this.wingsWidth*valueUp ),
				new THREE.Vector3(this.wingsSpan, 0, this.wingsWidth*valueUp),
				new THREE.Vector3(0, 0, this.wingsWidth*valueDown)
			);

			verts.push(
				new THREE.Vector3(this.wingsSpan, 0, this.wingsWidth*valueUp ),
				new THREE.Vector3(this.wingsSpan, 0, this.wingsWidth*valueDown),
				new THREE.Vector3(0, 0, this.wingsWidth*valueDown)
			);
		}
    	// Add triangles
		for(i=0; i<totalSegments; i++){
			faces.push(new THREE.Face3(
				fi++,
				fi++,
				fi++
			));
			this.verticesHeightRLAr.push(fi-2);
			this.verticesHeightLAr.push(fi-2);
			
			faces.push(new THREE.Face3(
				fi++,
				fi++,
				fi++
			));
			this.verticesHeightRLAr.push(fi-3);
			this.verticesHeightRLAr.push(fi-2);
			this.verticesHeightLAr.push(fi-3);
			this.verticesHeightLAr.push(fi-2);
		}
    	// UV coordinates
    	for(var i=0;i<totalSegments;i++){
    		var valueUp = i*(1/totalSegments);
    		var valueDown = (i+1)*(1.0/totalSegments);
		    uvs.push([
				new THREE.Vector2(1, valueUp),
				new THREE.Vector2(0, valueUp),
				new THREE.Vector2(1, valueDown)
			]);

			uvs.push([
				new THREE.Vector2(0, valueUp),
				new THREE.Vector2(0, valueDown),
				new THREE.Vector2(1, valueDown)
			]);
    	}
    };

    this.calculateSegments = function(){
    	this.segIdxs = [];
		for (var i=0;i<verts.length;i++) {
			this.segIdxs[i] = 0;
		}
		var verticesHeight = this.verticesHeightRLAr;
		for(var i=0; i<verticesHeight.length; i++){
			var verticeIndex = verticesHeight[i];
			var uvIdx = (verticeIndex/3) | 0;
			var uvSubIdx = verticeIndex - (3*uvIdx);
			var segmentIndex = this.segments-((uvs[uvIdx][uvSubIdx].y * this.segments) | 0);
			this.segIdxs[verticeIndex] = segmentIndex;
		}
    };

	this.triangleWing = 8;
	switch(this.triangleWing){
		case 2:
			this.wingL2();
			this.wingR2();
			break;
		/*
		case 8:	
			this.wingL8();
			this.wingR8();
			this.verticesHeightRLAr = [1,3,4,7,9,10,13,15,16,19,21,22,25,27,28,31,33,34,37,39,40,43,45,46];
			this.verticesHeightLAr = [1,3,4,7,9,10,13,15,16,19,21,22];
			this.verticesHeightRAr = [25,27,28,31,33,34,37,39,40,43,45,46];
			this.calculateSegments();
			
			break;
		*/
		case 8:
			this.verticesHeightRLAr = [];
			this.verticesHeightLAr = [];
			this.verticesHeightRAr = [];
			this.segments = 16;
			this.wingLC(this.segments);
			this.wingRC(this.segments);
			// fi = total vertices 
			this.calculateSegments();
			break;
		

	}

	this.applyMatrix( new THREE.Matrix4().makeScale( 1, 1, 1 ) );

	this.computeBoundingBox();
	this.computeFaceNormals();
	this.computeVertexNormals();
};

ButterflyGeometry.prototype = Object.create( THREE.Geometry.prototype );

ButterflyGeometry.prototype.rotateWings = function(radians){
	if(this.triangleWing == 2){
		// axis Y
		this.vertices[ 1 ].y = this.vertices[ 3 ].y = this.vertices[ 4 ].y = this.vertices[ 7 ].y = this.vertices[ 9 ].y = this.vertices[ 10 ].y = (Math.sin( radians ) * this.wingsSpan);
		// axis X
		this.vertices[ 1 ].x = this.vertices[ 3 ].x = this.vertices[ 4 ].x  = -1 * this.wingsSpan * Math.cos( radians );
		this.vertices[ 7 ].x = this.vertices[ 9 ].x = this.vertices[ 10 ].x = this.wingsSpan * Math.cos( radians ); 
	
	}else if(this.triangleWing == 8){

		// Segmented wings

		// Create current angle array for segments
		// The idea is that the first segment is set to radians,
		// the segments after that have a spring force acting on them 
		// to pull them towards the first segment's angle.
		// Each segment also has its velocity.
		if (!this.segAngles) {
			this.segAngles = [];
			for (var i=0; i<this.segments+1; i++) {
				this.segAngles.push({velocity: 0, position: 0, psin: 0, pcos: 0});
			}
		}

		var sa = this.segAngles;
		// Update segment angles
		var r = radians;
		//this.segAngles[0].position = r;
		//this.segAngles[0].velocity = 0;
		for (var i=0; i<this.segAngles.length; i++) {
			var a = sa[i];
			var archV = -0.2 * Math.pow(0.8*(-1 + 2*i/this.segAngles.length), 2);
			a.position += (r - a.position)*0.95;
			r = a.position;
			a.position += archV;
			a.psin = Math.sin(a.position);
			a.pcos = Math.cos(a.position);
		}

		var vs = this.vertices;
		var vh = this.verticesHeightRLAr;
		var si = this.segIdxs;
		var ws = this.wingsSpan;
		var r = radians;
		for(var i=0;i<this.verticesHeightRLAr.length;i++){

			var vi = vh[i];

			var r = sa[si[vi]];

			var y = ws * r.psin;
			var x = ws * r.pcos;

			vs[ vi ].x = (vi > (this.vertices.length/2) ? x : -x);
			vs[ vi ].y = y;
		}
		//this.computeFaceNormals();
		//this.computeVertexNormals();
	}
};


//---------------------------------------------------------

function ButterflyMesh(geometry, material){
	THREE.Mesh.call( this,geometry, material);
	this.alpha = 0;
	this.phase = 0;
};

ButterflyMesh.prototype = Object.create( THREE.Mesh.prototype );
