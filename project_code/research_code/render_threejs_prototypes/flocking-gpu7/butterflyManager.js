function ButterflyManager(){
	var texturesToUpdateAr = new Array();
	var pathButterflyAr = new Array();

	this.newButterfly = function() {

	}

	this.update = function() { 
		// update textures
		updateButterfliesTextures();
		for(var i=0;i<pathButterflyAr.length;i++){
			pathButterflyAr[i].applyMove();
		}
		// update stats
		if(debug){
			$('#totalButterfliesLabel').html("TotalButterflies:"+(groupButterFliesAr.length*totalGroupButterflies).toString());
		}
	}
	// stats

	// Path
	this.createPath = function(id,origen){
		var bp = new ButterflyPath(id,pathButterflyAr.length,origen);
		bp.createPath();
		//bp.draw();
		// add to array
		pathButterflyAr.push(bp);
	}

	this.finishPath = function(boidId){
		console.log(boidId+" - "+pathButterflyAr.length);
		pathButterflyAr.splice(boidId,boidId+1);
		console.log(pathButterflyAr.length);
	}
	// methods for update textures of the wishes
	this.getTotalTexturesToUpdate = function(){
		return texturesToUpdateAr.length;
	}

	this.updateAllTextures= function(){
		for(var i=0;i<groupButterFliesAr.length;i++){
			texturesToUpdateAr.push(i);
		}
	}

	this.getTotalTextures= function(){
		return canvasRenderButterfliesAr.length;
	}

	this.getIdToTextureUpdate = function(){
		return texturesToUpdateAr.pop();
	}

	this.addTextureIdToUpdate = function(id){
		if($.inArray(id, texturesToUpdateAr)){
			texturesToUpdateAr.push(id);
			//console.log("add id:"+id +" - "+texturesToUpdateAr.length);

		}
	}

}