function ButterflyPath(_boid){
	var spline;
	var counter = 0;
	this.boid = _boid;
    var origin = this.boid.position;
    var end = new THREE.Vector3( (Math.random()*100.0)+10.0, (Math.random()*100.0)+10.0 , 10.);
    var timer;
    var vec3PointsAr;
    var newPosition = new THREE.Vector3(0.,0.,0.);
    var line;

	this.createPath = function(){
		counter = 0;
        vec3PointsAr = new Array();
        vec3PointsAr.push(origin);
        vec3PointsAr.push(origin);
        var Vector3 = THREE.Vector3;
        vec3PointsAr.push(new Vector3(origin.x, 75, 0));
        vec3PointsAr.push(new Vector3(origin.x+50, 100, 0));
        vec3PointsAr.push(new Vector3(origin.x+0, 150, 0));
        vec3PointsAr.push(new Vector3(origin.x-50, 100, 0));
        vec3PointsAr.push(new Vector3(origin.x-0, 75, 0));
        vec3PointsAr.push(new Vector3(origin.x+75, 100, 0));
        vec3PointsAr.push(new Vector3(origin.x-0, 175, 0));
        vec3PointsAr.push(new Vector3(origin.x-75, 100, 0));
        vec3PointsAr.push(new Vector3(origin.x-0, 50, 0));
        vec3PointsAr.push(new Vector3(origin.x+50, 0, 0));
        vec3PointsAr.push(new Vector3(origin.x+30, -50, 0));
        vec3PointsAr.push(new Vector3(origin.x+10, -75, 0));
        vec3PointsAr.push(origin);

		spline = new THREE.SplineCurve3(vec3PointsAr);
	}

    this.getLine = function() {
         var material = new THREE.LineBasicMaterial({
            color: 0xff00f0,
        });  
        var geometry = new THREE.Geometry();
        var splinePoints = spline.getPoints( vec3PointsAr.length*10 ); 
        for( var i = 0; i < splinePoints.length; i++ ){
            geometry.vertices.push( splinePoints[i] );  
        }
        line = new THREE.Line( geometry, material );
        return line;
    }

    this.getNextPoint = function() {
        var v = spline.getPointAt(counter + 0.01);
        return v;
    }

	this.move = function() {
    	if (counter <= 1) {
    		newPosition = spline.getPointAt(counter);
            newPosition.sub(this.boid.position);
            newPosition.multiplyScalar(0.8);
            this.boid.position.add(newPosition);
    	    counter += 0.001
    	}
	}
}