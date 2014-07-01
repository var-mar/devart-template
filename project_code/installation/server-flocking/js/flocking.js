// Based on http://www.openprocessing.org/visuals/?visualID=6910

var Boid = function() {
	var vector = new THREE.Vector3(),
	_acceleration, _width = 500, _height = 500, _depth = 200, _goal, _neighborhoodRadius = 100,
	_maxSpeed = 1, _maxSteerForce = 0.05, _avoidWalls = true;

	this.maxSpeed = _maxSpeed;
	
	this.neighbors = [];
	this.worldPosition = new THREE.Vector3();
	this.position = new THREE.Vector3();
	this.velocity = new THREE.Vector3();
	_acceleration = new THREE.Vector3();

	this.setGoal = function ( target ) {
		_goal = target;
	};

	this.setAvoidWalls = function ( value ) {
		_avoidWalls = value;
	};

	this.setWorldSize = function ( width, height, depth ) {
		_width = width;
		_height = height;
		_depth = depth;
	};
	this.setWorldPosition = function ( x, y, z ) {
		this.worldPosition.x = x;
		this.worldPosition.y = y;
		this.worldPosition.z = z;
	};

	this.run = function ( boids ) {
		var repulsionForceWallsSides = 19;
		var repulsionForceWallsRest = 5;

		if ( _avoidWalls ) {
			vector.set( - _width+this.worldPosition.x, this.position.y, this.position.z );
			vector = this.avoid( vector );
			vector.multiplyScalar( repulsionForceWallsSides );
			_acceleration.add( vector );

			vector.set( _width+this.worldPosition.x, this.position.y, this.position.z );
			vector = this.avoid( vector );
			vector.multiplyScalar( repulsionForceWallsSides );
			_acceleration.add( vector );

			vector.set( this.position.x, - _height+this.worldPosition.y, this.position.z );
			vector = this.avoid( vector );
			vector.multiplyScalar( repulsionForceWallsRest );
			_acceleration.add( vector );

			vector.set( this.position.x, _height+this.worldPosition.y, this.position.z );
			vector = this.avoid( vector );
			vector.multiplyScalar( repulsionForceWallsRest );
			_acceleration.add( vector );

			vector.set( this.position.x, this.position.y, - _depth+this.worldPosition.z );
			vector = this.avoid( vector );
			vector.multiplyScalar( repulsionForceWallsRest );
			_acceleration.add( vector );

			vector.set( this.position.x, this.position.y, _depth+this.worldPosition.z );
			vector = this.avoid( vector );
			vector.multiplyScalar( repulsionForceWallsRest );
			_acceleration.add( vector );
		} else {
			this.checkBounds();	
		}

		if ( Math.random() > 0.5 ) {
			this.flock( boids );
		}
		this.move();
	};

	this.flock = function ( boids ) {
		this.neighbors = [];
		if ( _goal ) {
			_acceleration.add( this.reach( _goal, 0.005 ) );
		}
		// _acceleration.add( this.alignment( boids ) );
		// _acceleration.add( this.cohesion( boids ) );
		_acceleration.add( this.separation( boids ) );
	};


	this.move = function () {
		this.velocity.add( _acceleration );
		var l = this.velocity.length();
		if ( l > this.maxSpeed ) {
			this.velocity.divideScalar( l / this.maxSpeed );
		}
		this.position.add( this.velocity );
		_acceleration.set( 0, 0, 0 );
		if (this.individual) {
		//	console.log(_acceleration, this.velocity, this.position);
		}
	};

	this.checkBounds = function () {

		if ( this.position.x >   _width+this.worldPosition.x  ) this.position.x = - _width;
		if ( this.position.x < - _width+this.worldPosition.x  ) this.position.x =   _width;
		if ( this.position.y >   _height+this.worldPosition.y ) this.position.y = - _height;
		if ( this.position.y < - _height+this.worldPosition.y ) this.position.y =  _height;
		if ( this.position.z >  _depth+this.worldPosition.z ) this.position.z = - _depth;
		if ( this.position.z < - _depth+this.worldPosition.z ) this.position.z =  _depth;

	};

	this.avoid = function ( target ) {
		var steer = new THREE.Vector3();
		steer.copy( this.position );
		steer.sub( target );
		steer.multiplyScalar( 1 / this.position.distanceToSquared( target ) );
		return steer;
	};

	this.repulse = function ( target ) {
		var distance = this.position.distanceTo( target );
		if ( distance < 125 ) {
			var steer = new THREE.Vector3();
			steer.subVectors( this.position, target );
			steer.multiplyScalar( 0.5 / distance );
			_acceleration.add( steer );
		}
	};

	this.reach = function ( target, amount ) {
		var steer = new THREE.Vector3();
		steer.subVectors( target, this.position );
		steer.multiplyScalar( amount );
		return steer;
	};

	this.alignment = function ( boids ) {
		var boid, velSum = new THREE.Vector3(), distance, count = 0;
		for ( var i = 0, il = boids.length; i < il; i++ ) {
			if ( Math.random() > 0.6 ) continue;
			boid = boids[ i ];
			if (boid.individual) continue;
			distance = boid.position.distanceTo( this.position );
			if ( distance > 0 && distance <= _neighborhoodRadius ) {
				velSum.add( boid.velocity );
				count++;
			}
		}

		if ( count > 0 ) {
			velSum.divideScalar( count );
			var l = velSum.length();
			if ( l > _maxSteerForce ) {
				velSum.divideScalar( l / _maxSteerForce );
			}
		}
		return velSum;
	};

	this.cohesion = function ( boids ) {
		var boid, distance,
		posSum = new THREE.Vector3(),
		steer = new THREE.Vector3(),
		count = 0;

		for ( var i = 0, il = boids.length; i < il; i ++ ) {

			if ( Math.random() > 0.6 ) continue;

			boid = boids[ i ];
			if (boid.individual) continue;
			distance = boid.position.distanceTo( this.position );

			if ( distance > 0 && distance <= _neighborhoodRadius ) {

				posSum.add( boid.position );
				count++;
			}
		}
		if ( count > 0 ) {
			posSum.divideScalar( count );
		}
		steer.subVectors( posSum, this.position );
		var l = steer.length();
		if ( l > _maxSteerForce ) {

			steer.divideScalar( l / _maxSteerForce );

		}
		return steer;
	};

	this.separation = function ( boids ) {
		var boid, distance,
		posSum = new THREE.Vector3(),
		repulse = new THREE.Vector3();

		for ( var i = 0, il = boids.length; i < il; i ++ ) {
			if ( Math.random() > 0.6 ) continue;
			boid = boids[ i ];
			if (boid.individual) continue;
			distance = boid.position.distanceTo( this.position );
			if ( distance > 0 && distance <= _neighborhoodRadius ) {
				this.neighbors.push(boid);
				repulse.subVectors( this.position, boid.position );
				repulse.normalize();
				repulse.divideScalar( distance );
				posSum.add( repulse );
			}
		}
		return posSum;
	};
};

// to debug and visually see walls boids

function showWallsBoids(){
	var worldGeometry1 = new THREE.BoxGeometry(worldSize.x, worldSize.y, worldSize.z);
	var worldMaterial1 = new THREE.MeshBasicMaterial( { color: 0x00ff00, wireframe:true } );
	var worldGeometry2 = new THREE.BoxGeometry(worldSize.x, worldSize.y, worldSize.z);
	var worldMaterial2 = new THREE.MeshBasicMaterial( { color: 0x00ff00, wireframe:true } );
	var worldMesh1 = new THREE.Mesh( worldGeometry1, worldMaterial1  );
	worldMesh1.position = worldPosition;
	var worldMesh2 = new THREE.Mesh( worldGeometry2, worldMaterial2  );
	worldMesh2.position = worldPosition;
	scene1.add(worldMesh1);
	scene2.add(worldMesh2);
}
