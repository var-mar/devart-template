function ButterflyAttactionPath(){
	var spline;
	var counter = 0;
	
    var end = new THREE.Vector3( (Math.random()*100.0)+10.0, (Math.random()*100.0)+10.0 , 10.);
    var timer;
    var vec3PointsAr;
    var newPosition = new THREE.Vector3(0.,0.,0.);
    var line;

	this.createPath = function(){
		counter = 0;
        var totalPoints = Math.floor(Math.random()*7.0)+3;
        var ySection = (origin.y -end.y )/totalPoints;
        vec3PointsAr = new Array();
        vec3PointsAr.push(origin);
        for(var i=0;i<totalPoints;i++){
            var x = Math.floor(Math.random()*300);
            vec3PointsAr.push(new THREE.Vector3( x, 0 , ySection*i));
        }
        vec3PointsAr.push(end);
		spline = new THREE.SplineCurve3(vec3PointsAr);

        positionsBoidsAr[boidId]  = origin.x;
        positionsBoidsAr[boidId+1]= origin.y;
        positionsBoidsAr[boidId+2]= origin.z;
        velocityBoidsAr[boidId] = 0;
        velocityBoidsAr[boidId+1] = 0;
        velocityBoidsAr[boidId+2] = 0;
        velocityBoidsAr[boidId+3] = 2.0;
        timer = setInterval(this.move,25);
	}

    this.draw = function() {
         var material = new THREE.LineBasicMaterial({
            color: 0xff00f0,
        });  
        var geometry = new THREE.Geometry();
        var splinePoints = spline.getPoints( vec3PointsAr.length*10 ); 
        for( var i = 0; i < splinePoints.length; i++ ){
            geometry.vertices.push( splinePoints[i] );  
        }
        line = new THREE.Line( geometry, material );
        scene.add( line );
    }

	this.move = function() {
    	if (counter <= 1) {
    		newPosition = spline.getPointAt(counter);
    	    counter += 0.001
            $("#log").html(counter);
    	}
	}

    this.applyMove = function(){
        if (counter <= 1) {
            velocityBoidsAr[boidId]  = newPosition.x-positionsBoidsAr[boidId];
            velocityBoidsAr[boidId+1]= newPosition.y-positionsBoidsAr[boidId+1];
            velocityBoidsAr[boidId+2]= newPosition.z-positionsBoidsAr[boidId+2];
        }else{
            // move to flocking again
            velocityBoidsAr[boidId] = Math.random() - 0.5;
            velocityBoidsAr[boidId+1] = Math.random() - 0.5;
            velocityBoidsAr[boidId+2] = Math.random() - 0.5;
            velocityBoidsAr[boidId+3]= 1.0;
            // remove timer
            clearInterval(timer);
            // remove line
            if(line) scene.remove(line); 
            // remove object from array
            manager.finishPath(boidId);
        }
    }
}