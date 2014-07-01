function cocoon(){
				// Get text from hash
				
				this.generateText = function(text){
					this.myTypography = new typography();
					this.myTypography.setCallback(this.valuesChanger);
    				this.myTypography.addWord("I wish will be butterfly");
				}
				
				this.createShaderMaterial = function(){
					this.uniforms = {
						time: { type: "f", value: 1.0 },
						radiusFactor: { type: "f", value: 1.0 },
						initialRadius: { type: "f", value: 1.0 },
						radiusMax: { type: "f", value: 1.0 },
						radiusIncrementalSmoothness: { type: "f", value: 1.0 },
						spiralFactorX: { type: "f", value: 1.0 },
						spiralFactorY: { type: "f", value: 1.0 },
			    		textHeight: { type: "f", value: 1.0 },
						posY: { type: "f", value: 1.0 },
						scale1: { type: "f", value: 1.0 },
						scale2: { type: "f", value: 1.0 },
						rotationXFont: { type: "f", value: 1.0 },
						widthText:{ type: "f", value: 1.0 },
						heightText:{ type: "f", value: 1.0 },
						slopeFactor:{ type: "f", value: 1.0 },
						rotationY:{ type: "f", value: 1.0 }
					};
					this.attributes = {

					};

					this.effectController = {
						radiusFactor: 1.0,
						initialRadius:50.0,
						radiusMax:0.5,
						radiusIncrementalSmoothness:600.0,
						spiralFactorX: 0.1,
						spiralFactorY: 3.5,
						textHeight: 11.2, 
						posY: 1700.0,
						scale1: 0.076,
						scale2: 0.09,
						rotationXFont:2.5,
						slopeFactor:4.0,
						rotationY:0.0
					};

					// create the sphere's material
					this.shaderMaterial = new THREE.ShaderMaterial({
						uniforms: this.uniforms,
		  				attributes: this.attributes,
						vertexShader:   document.getElementById( 'vertexshader' ).textContent,
						fragmentShader: document.getElementById( 'fragmentshader' ).textContent,
						wireframe:true
					});
				}

				this.createMesh = function(){
					this.text = new THREE.Mesh( this.myTypography, this.shaderMaterial );
					this.group.add( this.text );
				}

				this.createGroup = function(){
					this.group = new THREE.Object3D();
					scene.add( this.group );
				}

				this.rotateY = function(){
					this.uniforms.rotationY.value -= 0.01;
				}
				
				this.refreshText = function(text){
					this.group.remove( this.text );
					this.createText(text);
				};

				this.valuesChanger = function(){
					// Get default values
					this.uniforms.radiusFactor.value  = this.effectController.radiusFactor;
					this.uniforms.spiralFactorX.value = this.effectController.spiralFactorX;
					this.uniforms.spiralFactorY.value = this.effectController.spiralFactorY;
				    this.uniforms.textHeight.value = this.effectController.textHeight;
					this.uniforms.posY.value = this.effectController.posY;
					this.uniforms.scale1.value = this.effectController.scale1;
					this.uniforms.scale2.value = this.effectController.scale2;
					this.uniforms.rotationXFont.value = this.effectController.rotationXFont;
					this.uniforms.initialRadius.value = this.effectController.initialRadius;
					this.uniforms.initialRadius.value = this.effectController.initialRadius;
					this.uniforms.radiusMax.value = this.effectController.radiusMax;
					this.uniforms.radiusIncrementalSmoothness.value = this.effectController.radiusIncrementalSmoothness;
					this.uniforms.slopeFactor.value = this.effectController.slopeFactor;
					this.uniforms.rotationY.value = this.effectController.rotationY;
					// Get values from geometry
					
					this.uniforms.widthText.value = this.myTypography.boundingBox.max.x;
					this.uniforms.heightText.value = this.myTypography.boundingBox.max.y;
				}

				this.createText= function(text){
					this.generateText(text);
					this.createMesh();
					this.valuesChanger();
				};

				this.createShaderMaterial();
				this.createGroup();
				this.createText("I wish to be a queen butterfly aksdja asdasd asdasdasd ");
				
			}

			