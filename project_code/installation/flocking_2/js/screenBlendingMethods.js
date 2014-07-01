function createBlendingCamera(view_angle,aspect,near,far, screenId){
	var fullWidth = widthScreen;
	var blendingPixels = 0;//240

	var fullHeight = (1200-blendingPixels)+(1200-blendingPixels-blendingPixels)+(1200-blendingPixels); // total: 2640
	if(screenId==1){
		viewX =  0;
		viewY =  0;
	}else if(screenId==2){
		viewX =  0;
		viewY =  (1200-blendingPixels);
	}else if(screenId==3){
		viewX =  0;
		viewY =  (1200-blendingPixels)+(1200-blendingPixels-blendingPixels);
	}
	console.log("fullscreenW:"+viewX+" fullscreenH:"+viewY);
	console.log("viewX:"+viewX+" viewY:"+viewY);
	// create camera
	var camera = new THREE.PerspectiveCamera( view_angle, aspect, near, far );
	camera.position.set( 0, 370, 4000 );
	camera.setViewOffset( fullWidth, fullHeight, viewX, viewY, widthScreen, heightScreen);
	return camera;
}

function blending(){
	composer = new THREE.EffectComposer( renderer );
	composer.addPass( new THREE.RenderPass( scene, camera ) );

	var effect = new THREE.ShaderPass( THREE.EdgeBlendingShader ); 

	if(screenId==1 ){
		effect.uniforms[ 'OverlapTop' ].value = 0.2;
	}else if(screenId==2 ){
		effect.uniforms[ 'OverlapTop' ].value = 0.2;
		effect.uniforms[ 'OverlapBottom' ].value = 0.2;
	}else if(screenId==3 ){
		effect.uniforms[ 'OverlapBottom' ].value = 0.2;
	}
					
	effect.uniforms[ 'BlendPower' ].value = 0.6;
	effect.uniforms[ 'BlendPower2' ].value = 0.6;
	effect.uniforms[ 'SolidEdgeColor' ].value = new THREE.Vector4( 1.0, 1.0,1.0,0 );

	effect.renderToScreen = true;
	composer.addPass( effect );
}