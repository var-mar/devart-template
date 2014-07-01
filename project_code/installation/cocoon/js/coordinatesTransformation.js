

	var projectorWidthPixels = 1920;
	var projectorHeightPixels = 1200;
	var heightProjectorMm = 5500;
	var halfWidthProjectorImageMm = 1645;

	var handProjectorXOffset = 0.0;
	var handProjectorYOffset = 0.0;

	var kinectDistanceFromWallMm = 185;

	var kinectPositions = [-550, 50, 650];

	var kinectWidthPx = 320;
	var kinectHeightPx = 240;

	var cocoonProjectorImageHalfWidthMm = 2280/2;
	var cocoonProjectorImageHalfHeightMm = cocoonProjectorImageHalfWidthMm * (10/16);

	// The origin for the returned coordinates is the wall at the middle Kinect's location.
	// This seems to work.
	function detectedPointToPhysical(id, xPixels, yPixels, zMm){
		var kinectXMm = kinectPositions[id];
		var kinectYMm = kinectDistanceFromWallMm;
		var wMm = zMm * (2.5/7);
		xPixels += -Math.max(0, Math.min(xPixels-140, 20)); // tween xPixels offset between 0 at 140 to -20 at 160 and above
		var xMm = kinectXMm + wMm * -2*((xPixels - kinectWidthPx/2) / (kinectWidthPx/2));
		var yMm = kinectYMm + wMm * 2*((yPixels - kinectHeightPx/2) / (kinectHeightPx/2));
		return {x: xMm, y: yMm, z: zMm};
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
		return {x: xPixels-40, y: yPixels+64};
	}

	function physicalPointToCocoonProjector(p) {
		var rX = 1.0 - (0.5 + 0.5*(p.x / cocoonProjectorImageHalfWidthMm));
		var rY = 1.0 - (p.z / (2*cocoonProjectorImageHalfHeightMm));
		return {x: rX * 1920, y: rY * 1200};
	}
