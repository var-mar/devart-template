
function screenToThreejs(x,y)
{
	var vector = new THREE.Vector3(
	    ( x / window.innerWidth ) * 2 - 1,
	    - ( y / window.innerHeight ) * 2 + 1,
	    0.5 );
	var projector = new THREE.Projector();
	projector.unprojectVector( vector, camera );
	var dir = vector.sub( camera.position ).normalize();
	var distance = - camera.position.z / dir.z;
	var pos = camera.position.clone().add( dir.multiplyScalar( distance ) );
	return pos;
}