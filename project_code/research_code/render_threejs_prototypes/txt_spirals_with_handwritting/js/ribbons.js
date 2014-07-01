/*
//http://blog.nobel-joergensen.com/2010/10/22/spherical-coordinates-in-unity/
public static void SphericalToCartesian(float radius, float polar, float elevation, out Vector3 outCart){
        float a = radius * Mathf.Cos(elevation);
        outCart.x = a * Mathf.Cos(polar);
        outCart.y = radius * Mathf.Sin(elevation);
        outCart.z = a * Mathf.Sin(polar);
    }
And converting from cartesian coordinates to spherical coordinates:

public static void CartesianToSpherical(Vector3 cartCoords, out float outRadius, out float outPolar, out float outElevation){
        if (cartCoords.x == 0)
            cartCoords.x = Mathf.Epsilon;
        outRadius = Mathf.Sqrt((cartCoords.x * cartCoords.x)
                        + (cartCoords.y * cartCoords.y)
                        + (cartCoords.z * cartCoords.z));
        outPolar = Mathf.Atan(cartCoords.z / cartCoords.x);
        if (cartCoords.x < 0)
            outPolar += Mathf.PI;
        outElevation = Mathf.Asin(cartCoords.y / outRadius);
    }


function cartesianToPolar(x,y,z, radius){
    var sqrd = (x*x)+(y*y)+(z*z);
    var radius = Math.pow(sqrd,.5);
    var theta = Math.acos(z/radius);
    var phi = Math.atan2(y,x);
    var toReturn = {
        r:radius,
        t:theta,
        p:phi
    }
    return toReturn;
}
function  SphericalToCartesian(radius, theta, phi){
        float a = radius * Math.cos(phi);
        var toReturn = {
        	x: a * Math.cos(theta),
        	y : radius * Math.sin(phi),
        	z : a * Math.sin(polar)
        };
        return toReturn;
}
*/

function CreateWish()
{
	var oneWish = new Wish("dhakjsdha");
	oneWish.createRibbons(1);
	wishAr.push(oneWish);
}

function Wish(id)
{
	this.id = id;
	this.ribbons			= [];
	this.targets			= [];

	this.createRibbons = function(amount)
	{
		for (var i=0; i<amount; i++)
		{
			var ribbon = new Ribbon();
			ribbon.targetX = 0;
			ribbon.targetY = 0;
			ribbon.targetZ = 0;
			this.targets.push(ribbon.targetX, ribbon.targetY, ribbon.targetZ);
			this.ribbons.push(ribbon);
			scene.add( ribbon.mesh);
		}
		this.getNextRandomPosition();
	}

	this.getNextRandomPosition = function()
	{
		for (var i=0; i<this.ribbons.length; i++)
		{
			var posRibbonHead = new THREE.Vector3(this.ribbons[i].x,this.ribbons[i].y,this.ribbons[i].z);
			var distance = Math.abs(posRibbonHead.distanceTo(new THREE.Vector3(this.targets[i*3],this.targets[i*3+1],this.targets[i*3+2])));
			
			if(distance>this.ribbons[i].radius){
				var dx = (Math.cos(this.ribbons[i].ax * theta)) * speed;
				var dy = (Math.sin(this.ribbons[i].ay * theta)) * speed;
				var dz = (Math.sin(this.ribbons[i].az * theta)) * speed;

				this.targets[i*3]	= this.ribbons[i].targetX + dx;
				this.targets[i*3+1]	= this.ribbons[i].targetY + dy;
				this.targets[i*3+2]	= this.ribbons[i].targetZ + dz;
			}else{
				//this.targets[i*3]	+= dy;
				//this.targets[i*3+1]	+= dx;
				//this.targets[i*3+2]	+= 0;
				/*
				if(!ribbons[i].collisioned){
					ribbons[i].alpha1 = 0;
					ribbons[i].beta1 = 0;
					ribbons[i].collisioned = true;
					//ribbons[i].alpha2 = random(0,360);
					//ribbons[i].beta2 = random(0,180);
				}

				*/
				/**/
				if(this.ribbons[i].z>300){ 
					this.ribbons[i].direction=-1;
				}
				if(this.ribbons[i].z<0){ 
					this.ribbons[i].direction=+1;
				}
				
				if(!this.ribbons[i].collisioned){
					this.ribbons[i].collisioned = true;
					this.ribbons[i].posCollisioned = posRibbonHead;
					this.ribbons[i].matrix = new THREE.Matrix3();
					//this.ribbons[i].matrix.
				}
				speed = 1;
				var dx = this.ribbons[i].radius * (Math.sin( theta* speed)) ;//this.ribbons[i].ax *
				var dy = this.ribbons[i].radius * (Math.cos( theta* speed)) ;//this.ribbons[i].ay *
				var dz = this.ribbons[i].direction * 1.0 * speed;//this.ribbons[i].radius * (Math.sin( this.ribbons[i].az *(theta/100)* speed)) ;

				// Ellipsoide
				this.targets[i*3]	= dx;
				this.targets[i*3+1]	= dy;
				this.targets[i*3+2]	= dz;

			}
		}
	}	
}

Wish.prototype.updateRibbons = function(){
	for (var i=0; i<this.ribbons.length; i++)
	{
		var px = this.targets[i*3];
		var py = this.targets[i*3+1];
		var pz = this.targets[i*3+2];
		
		//document.getElementById("target").innerHTML = "target: "+px +" - "+ py +" - "+pz;

		var ribbon	= this.ribbons[i];
		ribbon.update(px, py, pz);
		
		if (ribbon.collisioned || counter%10 == 0)
		{	
			this.getNextRandomPosition();
		}
	}
};

function Ribbon()
{
	this.positions			= [];
	this.rotations			= [];
	this.collisioned 		= false;
	this.alpha1 			= 0;
	this.beta2 				= 0;
	this.alpha2 			= 0;
	this.beta2				= 0;
	this.direction			= 1;
	this.radius 			= 20;
	
	this.x					= 0;
	this.y					= 1000;
	this.z					= 0;
	
	this.targetX			= 0;
	this.targety			= 1000;
	this.targetz			= 0;

	this.velX				= 0;
	this.velY				= 0;
	this.velZ				= 0;
	
	this.ax					= randomRange(movement, movement*2);
	this.ay					= randomRange(movement, movement*2);
	this.az					= randomRange(movement, movement*2);
	
	this.width				= 2;
	this.length				= 200;//randomRange(80, 140);
	
	this.geom				= new THREE.PlaneGeometry(30, 30, 1, this.length-1);
	this.material 			= new THREE.MeshLambertMaterial( {color: Math.random()*0x7777ff,wireframe:false, side: THREE.DoubleSide} );
	this.mesh				= new THREE.Mesh(this.geom, this.material);

	//this.vhelper1 			= new THREE.VertexNormalsHelper( this.mesh, 20, 0xff0000 );
	//this.nhelper1 			= new THREE.FaceNormalsHelper( this.mesh, 20, 0xffff00 );

	this.mesh.dynamic		= true;
	this.mesh.rotation.x	= 90;
	this.mesh.doubleSided = true;
	
	for (var i=0; i<this.length*2; i++)
	{
		this.positions.push(0);
		this.rotations.push(0);
	}

	// Change ribbon start
	this.positions[0] = this.x;
	this.positions[1] = this.y;
	this.positions[2] = this.z;
	
	this.update = function(x, y, z)
	{
		//this.velX	+= (x - this.velX) * friction;
		this.velX	= 0;
		this.velY	+= (y - this.velY) * friction;
		this.velZ	+= (z - this.velZ) * friction;
		
		if(!this.collisioned){
			this.x		+= this.velX	= (this.velX + (x - this.x) * friction) * spring;
			this.y		+= this.velY	= (this.velY + (y - this.y) * friction) * spring;
			this.z		+= this.velZ	= (this.velZ + (z - this.z) * friction) * spring;
		}else{
			this.x		= x;
			this.y		= y;
			this.z		= z;
		}

		this.positions.pop();
		this.positions.pop();
		this.positions.pop();
		
		this.rotations.pop();
		this.rotations.pop();
		this.rotations.pop();
		
		this.positions.unshift(this.x, this.y, this.z);
		this.rotations.unshift(Math.cos(counter*.1)*this.width, Math.sin(counter*.25)*this.width, 0);

		for (var i=0; i<this.length; i++)
		{
			var v1 = this.geom.vertices[i*2];
			var v2 = this.geom.vertices[i*2+1];

			v1.x = this.positions[i*3] + this.rotations[i*3];
			v1.y = this.positions[i*3+1] + this.rotations[i*3+1];
			v1.z = this.positions[i*3+2] + this.rotations[i*3+2];

			v2.x = this.positions[i*3] - this.rotations[i*3];
			v2.y = this.positions[i*3+1] - this.rotations[i*3+1];
			v2.z = this.positions[i*3+2] - this.rotations[i*3+2];
		}
		this.geom.verticesNeedUpdate = true;
		this.geom.normalsNeedUpdate = true;
		this.geom.computeFaceNormals();	
		this.geom.computeVertexNormals();

		//this.vhelper1.update();
		//this.nhelper1.update() 
	}
}

function randomRange(min, max)
{
	return min + Math.random()*(max-min);
}

