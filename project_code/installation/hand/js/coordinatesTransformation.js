

	var projectorWidthPixels = 1920;
	var projectorHeightPixels = 1200;
	var heightProjectorMm = 5500;
	var halfWidthProjectorImageMm = 1645;

	var handProjectorXOffset = 0.0;
	var handProjectorYOffset = 0.0;

	var kinectDistanceFromWallMm = 185;

	var kinectPositions = [-550, 50, 650];
	var kinectMappings = {};
	kinectMappings[0] = function(id, xPixels, yPixels, zMm) {
		var kinectXMm = kinectPositions[id];
		var kinectYMm = kinectDistanceFromWallMm;
		var wMm = zMm * (2.5/7);
		xPixels += -Math.max(0, Math.min(2*(xPixels-150), 20)); // tween xPixels offset between 0 at 140 to -20 at 160 and above
		xPixels += 25
		yPixels += 20;
		var xMm = kinectXMm + wMm * -2*((xPixels - kinectWidthPx/2) / (kinectWidthPx/2));
		var yMm = kinectYMm + wMm * 2*((yPixels - kinectHeightPx/2) / (kinectHeightPx/2));
		return {x: xMm, y: yMm, z: zMm};
	};
	kinectMappings[1] = function(id, xPixels, yPixels, zMm) {
		var kinectXMm = kinectPositions[id];
		var kinectYMm = kinectDistanceFromWallMm;
		var wMm = zMm * (2.5/7);
		xPixels += -Math.max(0, Math.min(2*(xPixels-150), 20)); // tween xPixels offset between 0 at 140 to -20 at 160 and above
		xPixels += 25
		yPixels += 20;
		var xMm = kinectXMm + wMm * -2*((xPixels - kinectWidthPx/2) / (kinectWidthPx/2));
		var yMm = kinectYMm + wMm * 2*((yPixels - kinectHeightPx/2) / (kinectHeightPx/2));
		return {x: xMm, y: yMm, z: zMm};
	};
	kinectMappings[2] = function(id, xPixels, yPixels, zMm) {
		var kinectXMm = kinectPositions[id];
		var kinectYMm = kinectDistanceFromWallMm;
		var wMm = zMm * (2.5/7);
		xPixels += -Math.max(0, Math.min(2*(xPixels-150), 20)); // tween xPixels offset between 0 at 140 to -20 at 160 and above
		xPixels += 10
		yPixels += 20;
		var xMm = kinectXMm + wMm * -2*((xPixels - kinectWidthPx/2) / (kinectWidthPx/2));
		var yMm = kinectYMm + wMm * 2*((yPixels - kinectHeightPx/2) / (kinectHeightPx/2));
		return {x: xMm, y: yMm, z: zMm};
	};

	var kinectWidthPx = 320;
	var kinectHeightPx = 240;

	var cocoonProjectorImageHalfWidthMm = 2280/2;
	var cocoonProjectorImageHalfHeightMm = cocoonProjectorImageHalfWidthMm * (10/16);

	// The origin for the returned coordinates is the wall at the middle Kinect's location.
	// This seems to work.
	function detectedPointToPhysical(id, xPixels, yPixels, zMm){
		return kinectMappings[id](id, xPixels, yPixels, zMm);
	}

	function physicalPointToHandProjector(p) {
		// Transform point to projector's coordinate system (z grows from lens forward).
		var q = {x:p.x, y:p.y, z:heightProjectorMm-p.z};
		var f = (q.z/heightProjectorMm) * (halfWidthProjectorImageMm);
		var xRelative = (q.x / f); // -1 .. 1
		var yRelative = (q.y / (2*f));
		xRelative = 0.5 + 0.5*xRelative;
		var xPixels = xRelative * projectorWidthPixels;
		var yPixels = yRelative * projectorHeightPixels;
		return {x: xPixels, y: yPixels};
	}

	function physicalPointToCocoonProjector(p) {
		var rX = 0.5 + 0.5*(p.x / cocoonProjectorImageHalfWidthMm);
		var rY = 1.0 - (p.z / (2*cocoonProjectorImageHalfHeightMm));
		return {x: rX * 1920, y: rY * 1200};
	}
