//---------------------------------------------------------

function Butterfly(textureID){

	var self = this;

	this.light_ambient = 0x333333; 
	this.light_color =  0xffffff; 
	this.light_specular = 0x444444;
	this.light_emissive = 0x4c4c4c;
	this.light_shininess = 4;

	this.body = new THREE.Object3D();

	this.bodyGeos = [];
	this.bodyMaterial = new THREE.MeshLambertMaterial({color: 0xffffff});
	this.legMaterial = new THREE.LineBasicMaterial({
	        color: 0x999999,
	    });
	this.legs = [];

	this.body_top = function(){
		var manager = new THREE.LoadingManager();
		manager.onProgress = function ( item, loaded, total ) {
			console.log( item, loaded, total );
		};
		var self = this;
		// set up the sphere vars
		var loader = new THREE.OBJLoader( manager );
		loader.load( 'obj/butterflyUpPart.obj', function ( object ) {
			object.traverse( function ( child ) {
				if ( child instanceof THREE.Mesh ) {
					child.material = self.bodyMaterial;
					self.bodyGeos.push(child.geometry);
				}
			} );
			self.body_topObj = object;
			self.group1.add(self.body);
			object.scale.multiplyScalar(0.05);
			
			self.body.add( object );
			
			self.body.rotation.x = Math.PI/2;
			self.body.position.x = -2.5;
			self.body.position.y = 0;
			self.body.position.z = -3;
			
			self.makeLegs();
			changeVisibility(self.group1, self.group1.visible);
		} );
	};

	this.body_lower = function(){
		var manager = new THREE.LoadingManager();
		manager.onProgress = function ( item, loaded, total ) {
			console.log( item, loaded, total );
		};
		var self = this;
		// set up the sphere vars
		var loader = new THREE.OBJLoader( manager );
		loader.load( 'obj/butterflyDownPart.obj', function ( object ) {
			object.traverse( function ( child ) {
				if ( child instanceof THREE.Mesh ) {
					child.material = self.bodyMaterial;
					self.bodyGeos.push(child.geometry);
				}
			} );
			self.body_lowerObj = new THREE.Object3D();
			self.body_lowerObj.position.set(0, 5, 0);
			object.position.set(0, -5, 0);
			self.body_lowerObj.add( object );

			object.scale.multiplyScalar(0.05);

			self.body.add( self.body_lowerObj );

			changeVisibility(self.group1, self.group1.visible);

		} );
	};

	this.makeLegs = function(){
		var totalLegs = 4;

		for(var i=0; i<totalLegs; i++){ 
		    var numPoints = 25;
		    var spline = new THREE.SplineCurve3([
			    new THREE.Vector3(0, 0, 0),
			    new THREE.Vector3(18, -10, 0),
			    new THREE.Vector3(12, -28, 0),
			    new THREE.Vector3(25, -40, 0)
		    ]);

		    var geometry = new THREE.Geometry();
		    var splinePoints = spline.getPoints(numPoints);

		    for (var j = 0; j < splinePoints.length; j++) {
		        geometry.vertices.push(splinePoints[j]);
		    }

		    var legLine = new THREE.Line(geometry, this.legMaterial);
		    // legLine.scale.multiplyScalar(2);
		    legLine.position.x = 40+20*Math.floor(i/2);
		    legLine.position.y = 110-10*(i%2);
		    legLine.position.z = 0;
		    legLine.rotation.y = -Math.PI/2;
		    legLine.rotation.x = -0.5 + (i%2)*0.3;
		    this.legs.push(legLine);
		    this.body_topObj.add(legLine);
		}

		// antennae
		for(var i=0; i<2; i++){ 
			var lr = i%2;
			var sign = lr ? -1 : 1;
		    var numPoints = 25;
		    var spline = new THREE.SplineCurve3([
			    new THREE.Vector3(0, 10, 0),
			    new THREE.Vector3(0, 40, sign*10),
			    new THREE.Vector3(0, 70, sign*25),
			    new THREE.Vector3(0, 100, sign*40)
		    ]);

		    var geometry = new THREE.Geometry();
		    var splinePoints = spline.getPoints(numPoints);

		    for (var j = 0; j < splinePoints.length; j++) {
		        geometry.vertices.push(splinePoints[j]);
		    }

		    var legLine = new THREE.Line(geometry, this.legMaterial);
		    // legLine.scale.multiplyScalar(2);
		    legLine.position.x = 40+20*lr;
		    legLine.position.y = 110;
		    legLine.position.z = 0;
		    legLine.rotation.y = -Math.PI/2;
		    legLine.rotation.x = -0.2;
		    this.legs.push(legLine);
		    this.body_topObj.add(legLine);
		}
	};

	this.imageLoader = butterflyImageLoader;

	this.loadTexture = function() {
		var idString = String.fromCharCode.apply(String, this.butterflyStatus.id);
		var tex = this.butterflyTexture;
		this.imageLoader.load('http://'+ipServer+':6001/butterflyTextures/'+ btoa(idString) + '.png', function(image){ 
			tex.image = image;
			tex.needsUpdate = true;
		});
	};

	this.wings = function(){
		this.geometry = new ButterflyGeometry();
		this.butterflyTexture = new THREE.Texture();
		this.body_top();
		this.body_lower();
		var simpleMaterialPhong = new THREE.MeshPhongMaterial( { 
			map: this.butterflyTexture, 
			side: THREE.DoubleSide, 
			transparent: true,
			opacity:1,
			alphaTest:1/254,
			color: this.light_color, 
			specular: this.light_specular, 
			shininess: this.light_shininess
		});
		this.butterflyMesh = new ButterflyMesh( this.geometry, simpleMaterialPhong );
		this.group1.add( this.butterflyMesh );

	};

	this.create = function(){
		this.group1 = new THREE.Object3D();
		this.group1.rotationAutoUpdate = true;

		// butterfly parts
		this.wings();

		scene1.add(this.group1);

		this.butterflyStatus = new ButterflyStatus();
		this.butterflyStatus.onIdChange = this.onIdChange;
	};

	window.Bid = window.Bid || 0;

	this.bid = Bid++;
	this.updateGroups = function(status) {

		this.moveButterfly(status);
		this.moveWings(status);

		if (status.opacity <= 1/255) {
			this.hide();
		} else {
			this.show();
			this.butterflyMesh.material.opacity = status.opacity;
			this.bodyMaterial.color.setRGB(status.opacity, status.opacity, status.opacity);
			this.legMaterial.color.setRGB(status.opacity*0x99/255, status.opacity*0x99/255, status.opacity*0x99/255);
		}

	};

	this.moveButterfly = function(status) {
		this.group1.position.copy(status.position);
		this.group1.up.copy(status.up);
		this.group1.lookAt(status.lookAt);

		var sz = (status.position.z + 750) / 450;
		this.group1.scale.set(sz,sz,sz);
	};

	this.moveWings = function(status) {
		this.butterflyMesh.geometry.rotateWings(status.phase);
		this.butterflyMesh.geometry.verticesNeedUpdate = true;
		if (this.body_lowerObj) {
			this.body_lowerObj.rotation.x = 0.1-0.2*status.phase;
		}
	};


	this.unload = function(){
		scene1.remove(this.group1);
		for (var i=0; i<this.bodyGeos.length; i++) {
			this.bodyGeos[i].dispose();
		}
		for (var i=0; i<this.legs.length; i++) {
		        this.legs[i].geometry.dispose();
		}

		this.legMaterial.dispose();
		this.bodyMaterial.dispose();
		this.butterflyTexture.dispose();
		this.butterflyMesh.material.dispose();
		this.butterflyMesh.geometry.dispose();
		console.log("dispose");
	};

	this.onIdChange = function() {
		self.loadTexture();
	};

	this.hide = function() {
		if (this.group1.visible !== false) {
			changeVisibility(this.group1, false);
		}
		this.butterflyMesh.material.opacity = 0;
		this.bodyMaterial.opacity = 0;
		this.legMaterial.opacity = 0;
		this.bodyMaterial.color.setRGB(0,0,0);
		this.legMaterial.color.setRGB(0,0,0);
	};

	this.show = function() {
		if (this.group1.visible !== true) {
			changeVisibility(this.group1, true);
		}
		this.butterflyMesh.material.opacity = 1;
		this.bodyMaterial.opacity = 1;
		this.legMaterial.opacity = 1;
		this.bodyMaterial.color.setRGB(1,1,1);
		this.legMaterial.color.setRGB(0x99/255, 0x99/255, 0x99/255);
	};

	this.create();
}
//---------------------------------------------------------
