/*
function disapearButterFlyEffect(){
    this.debug = false;
    var self = this;
    // Create particle group and emitter
    this.initParticles = function () {
        console.log("init particles");
        // Used in initParticles()
        this.pos = new THREE.Vector3();
        var    emitterSettings = {
                type: 'sphere',
                positionSpread: new THREE.Vector3(8, 8, 8),
                radius: 1,
                speed: 50,
                sizeStart: 3,
                sizeStartSpread: 30,
                sizeEnd: 30,
                opacityStart: 1,
                opacityEnd: 0,
                colorStart: new THREE.Color('white'),
                colorStartSpread: new THREE.Vector3(0.02, 1, 0.4),
                colorEnd: new THREE.Color('white'),
                particleCount: 1000,
                alive: 0,
                duration: 0.15
        };

    	this.particleGroup = new SPE.Group({
    		texture: THREE.ImageUtils.loadTexture('img/smokeparticle.png'),
    		maxAge: 0.5,
            blending: THREE.AdditiveBlending,
            transparent: true,
            alphaTest: 0.5,
            depthWrite: false,
            depthTest: true,
            fixedTimeStep: 0.016
    	});

        this.particleGroup.addPool( 10, emitterSettings, false );

        // Add particle group to scene.
    	scene.add( this.particleGroup.mesh );
    };

    // Generate a random number between -size/2 and +size/2
    this.rand = function( size ) {
        return size * Math.random() - (size/2);
    };

    // Trigger an explosion and random co-ords.
    this.createExplosion = function () {
        var num = 150;
        self.particleGroup.triggerPoolEmitter( 1, (self.pos.set( self.rand(num), self.rand(num), self.rand(num) )) );
        //self.particleGroup.triggerPoolEmitter( 1, (self.pos.set( 0, 0, 0 )) );
    };

    this.update = function(dt){
        this.particleGroup.tick( dt );
    };
    // setup
    this.initParticles();
}
*/