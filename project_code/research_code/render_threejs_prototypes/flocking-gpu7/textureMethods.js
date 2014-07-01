
function setVoidPositionTexture(k,r,g,b,a){
	positionsBoidsAr[ k*4 + 0 ] = r;
	positionsBoidsAr[ k*4 + 1 ] = g;
	positionsBoidsAr[ k*4 + 2 ] = b;
	positionsBoidsAr[ k*4 + 3 ] = a;
}

function setVoidVelocityTexture(k,r,g,b,a){
	velocityBoidsAr[ k*4 + 0 ] = r;
	velocityBoidsAr[ k*4 + 1 ] = g;
	velocityBoidsAr[ k*4 + 2 ] = b;
	velocityBoidsAr[ k*4 + 3 ] = a;
}

function renderTexturePosition(){
	simulator.renderTexture(dtPosition, rtPosition1);
}

function renderTextureVelocity(){
	simulator.renderTexture(dtVelocity, rtVelocity1);
}

function generatePositionData() {
	var x, y, z;
	positionsBoidsAr = new Float32Array(maximumBoids * 4);
	for (var k = 0; k < maximumBoids; k++) {
		x = Math.random() * BOUNDS - BOUNDS_HALF;
		y = Math.random() * BOUNDS - BOUNDS_HALF;
		z = Math.random() * BOUNDS - BOUNDS_HALF;
		positionsBoidsAr[ k*4 + 0 ] = x;
		positionsBoidsAr[ k*4 + 1 ] = y;
		positionsBoidsAr[ k*4 + 2 ] = z;
		positionsBoidsAr[ k*4 + 3 ] = 1.0;
	}
}

function generateVelocityData() {
	var x, y, z;
	velocityBoidsAr = new Float32Array(maximumBoids * 4);
	for (var k = 0; k < maximumBoids; k++) {
		x = Math.random() - 0.5;
		y = Math.random() - 0.5;
		z = Math.random() - 0.5;
		velocityBoidsAr[ k*4 + 0 ] = x * 10.0;
		velocityBoidsAr[ k*4 + 1 ] = y * 10.0;
		velocityBoidsAr[ k*4 + 2 ] = z * 10.0;
		//if(k<50){
			velocityBoidsAr[ k*4 + 3 ] = 1.0;
		//}else{
		//	velocityBoidsAr[ k*4 + 3 ] = 3.0;
		//}
	}
}

function generatePositionTexture() {
	generatePositionData();
	return savePositionTexture();
}

function savePositionTexture(){
	return saveFloatTexture(positionsBoidsAr);
}

function generateVelocityTexture() {
	generateVelocityData();
	return saveVelocityTexture();
}

function saveVelocityTexture() {
	return saveFloatTexture(velocityBoidsAr);
}

function saveFloatTexture(_ar) {
	var texture = new THREE.DataTexture( _ar, WIDTH, WIDTH, THREE.RGBAFormat, THREE.FloatType );
	texture.minFilter = THREE.NearestFilter;
	texture.magFilter = THREE.NearestFilter;
	texture.needsUpdate = true;
	texture.flipY = false;
	return texture;
}

function updateDataTexture(texture, data){
	texture.image.data = data;
	texture.needsUpdate = true;
}

function getFullDataTexturePosition(_rt){
	// Get data from offline texture
	simulator.renderTextureToGetPositionData(_rt,rtTemp128);
	var gl = renderer.getContext();
	gl.readPixels(0, 0, WIDTH*4, WIDTH, gl.RGBA, gl.UNSIGNED_BYTE, pixelsUint8Temp128Position);
	positionsBoidsAr = new Float32Array(pixelsUint8Temp128Position.buffer);
}

function getFullDataTextureVelocity(_rt){
	// Get data from offline texture
	simulator.renderTextureToGetVelocityData(_rt,rtTemp128);
	var gl = renderer.getContext();
	gl.readPixels(0, 0, WIDTH*4, WIDTH, gl.RGBA, gl.UNSIGNED_BYTE, pixelsUint8Temp128Velocity);
	velocityBoidsAr = new Float32Array(pixelsUint8Temp128Velocity.buffer);
}

function updateButterfliesTextures(){
	if(manager.getTotalTexturesToUpdate()==0) return;
	for(var i=0; i<manager.getTotalTextures(); i++){
		var id = manager.getIdToTextureUpdate();
		if(id!=undefined){
			//console.log("update texture:"+id.toString());
			getCanvas(id).needsUpdate = true;
			boidUniformsAr[id].texture1.value = getCanvas(id);
		}
	}
}
