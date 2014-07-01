function butterflyManager(){
	this.butterflys = {};
	this.debug = true;
	var self = this;

	/* loading texture have to be like this because it is the way i can load in chrome app, it is tested */
	this.loadTexture = function (id,microphoneID, uid, callback){
		var xhr = new XMLHttpRequest();
		var urlImage = "http://localhost:6001/butterflyTextures/538c5f6cae400b440c995414.png";
		//var urlImage = "http://"+ipServer+":6001/butterflyTextures/"+id+".png"
		xhr.open('GET', urlImage, true);
		xhr.responseType = 'blob';
		xhr.onload = function(e) {
			if (this.status == 200) {
				console.log("image load sucessfully");
		    	var blob = this.response;
		    	var img = new Image();
		    	img.onload = function(e) {
	    			// Clean up after yourself
		  			window.URL.revokeObjectURL(img.src);
		      		console.log("clean image");
		      		var texture = new THREE.Texture(img);
		      		texture.needsUpdate = true;
		  			self.createButterfly(id,microphoneID,texture,uid, callback);
		   		};
		    	img.src = window.URL.createObjectURL(blob);

		    	// Do something with the img
		    	document.body.appendChild(img);
		  	}else{
		  		console.log("error load image");
		  	}
	  	};
		xhr.send();
	}

	this.createButterfly = function(id,microphoneID,texture,uid,callback){
		var geometry = new ButterflyGeometry();
		var simpleMaterial = new THREE.MeshBasicMaterial( { 
			map: texture, 
			side: THREE.DoubleSide, 
			transparent: true,
			opacity:1,
			alphaTest:0.05
		});
		var mesh = new THREE.Mesh( geometry, simpleMaterial );
		mesh.phase = Math.floor( Math.random() * 62.0 );
		mesh.position.x = 0;
		mesh.position.y = 0;
		mesh.position.z = 0;
		mesh.rotation.x = 0.3;
		mesh.alpha = 0;
		geometry.rotateWings(12);
		mesh.visible = false;
		// add this buterfly mesh in scene
		scene.add( mesh );

		id = uid || id;

		// add in array
		this.butterflys[ id ] = {
			'mesh':mesh,
			'microphoneID':microphoneID,
			'material':simpleMaterial,
			'texture':texture,
			'geometry':geometry,
			'status':'',
			'id':id};
		console.log("load butterfly");
		if (callback) {
			callback(mesh);
		}
	};

	this.updateButterflyPosition = function(id,x,y,z){
		this.butterflys[id].mesh.position = THREE.Vector3(x,y,z);
	};

	this.updateButterflyStatus = function(id,status){
		this.butterflys[id].status = status;
	};

	this.sendPositionButterfliesWaitingForHand = function(id){
		for(var b in this.butterflys){
			if(this.butterflys[b].status=='waitingForHand'){
				socket.emit("newButterflyWaitingforHand",{
					'wishID':this.butterflys[b].id,
					'x':this.butterflys[b].mesh.position.x,
					'y':this.butterflys[b].mesh.position.y,
					'z':this.butterflys[b].mesh.position.z
				});
			}
		}
	};

	this.getPositionButterflyID = function(id){
		return this.butterflys[id].mesh.position;
	};

	this.getMicrophoneIDButterfly = function(id){
		return this.butterflys[id].microphoneID;
	};

	this.makeSmokeToDisapearButterfly = function(id){
		this.butterflyPosition = butterflys[id].mesh.position;
		// generate particles of smoke
	};

	this.placeButterflyInCoocoon = function(id,position){
		this.butterflys[id].mesh.position = position;
	};

	this.makeVisible = function(id){
		if(this.debug){
			console.log("make visible butterfly");
		}
		this.butterflys[id].mesh.visible = true;
	};

	this.makeInvisible = function(id){
		this.butterflys[id].mesh.visible = false;
	};

	this.destroyButterfly = function(id){
		// deallocate object memory
		this.butterflys[id].texture.dispose();
		this.butterflys[id].material.dispose();
		this.butterflys[id].geometry.dispose();
		scene.remove(this.butterflys[id].mesh);	
	};

	this.update = function(){
		var goUpWings = 10.0;
		var modeEnergy = 1;
		var modeFlighType = 3;
		for(b in this.butterflys){
			var butterfly = this.butterflys[b].mesh;

			// (1) Energetic -> more tired (2,3,4,5)
			if(modeEnergy==1){
				butterfly.phase = ( butterfly.phase + 0.1  ) ;//+ butterfly.rotation.z*0.5)
			}
			
			if(modeEnergy==2){
				butterfly.phase = ( butterfly.phase + 0.01  ) ;//+(butterfly.rotation.z*0.5)
			}
			butterfly.alpha += 0.1;
			// modes fly

			if(modeFlighType==1){
				var maxPhase = Math.radians(60);
				butterfly.phase = maxPhase*Math.sin(butterfly.alpha)-Math.radians(15);
			}
			if(modeFlighType==2){
				var maxPhase = Math.radians(30);
				butterfly.phase = maxPhase*Math.sin(butterfly.alpha);
			}
			if(modeFlighType==3){
				var maxPhase = Math.radians(60);
				butterfly.phase = Math.radians(15)+maxPhase*Math.sin(butterfly.alpha);
			}

			butterfly.geometry.rotateWings(10.0, butterfly.phase);

			// Update geometry
			butterfly.geometry.verticesNeedUpdate = true;
		}
	};
}