function typography(){
    this.numPoints = 100;
    this.letter = {};
    this.numPoints = 50;
    this.isLetterToDraw = true;
    this.debug = true;
    var self = this;

    // A 
    this.letter['a'] = [
        new THREE.Vector3(0,  50, 0),
        new THREE.Vector3(45, 90, 0),
        new THREE.Vector3(15, 65, 0),
        new THREE.Vector3(5,  40, 0),
        new THREE.Vector3(25, 40, 0),
        new THREE.Vector3(45, 70, 0),
        new THREE.Vector3(48, 50, 0),
        new THREE.Vector3(55, 45, 0),
        new THREE.Vector3(60, 50, 0)
    ];

    // B
    this.letter['b'] = [
        new THREE.Vector3(0,  50, 0),
        new THREE.Vector3(10, 60, 0),
        new THREE.Vector3(20, 100,0),       
        new THREE.Vector3(10, 100,0),
        new THREE.Vector3(5,  40, 0),
        new THREE.Vector3(15, 40, 0),
        new THREE.Vector3(23, 60, 0),
        new THREE.Vector3(15, 50, 0),
        new THREE.Vector3(40, 50, 0)
    ];

    // C
    this.letter['c'] = [
        new THREE.Vector3(0,  50, 0),    
        new THREE.Vector3(12, 80, 0),    
        new THREE.Vector3(30, 81, 0), 
        new THREE.Vector3(32, 78, 0),   
        new THREE.Vector3(15, 75, 0),
        new THREE.Vector3(5, 45, 0),
        new THREE.Vector3(30, 35, 0),
        new THREE.Vector3(50, 50, 0)    
    ];

    // D 
    this.letter['d'] = [
        new THREE.Vector3(0,  50, 0),
        new THREE.Vector3(45, 90, 0),
        new THREE.Vector3(15, 65, 0),
        new THREE.Vector3(5,  40, 0),
        new THREE.Vector3(25, 40, 0),
        new THREE.Vector3(45, 70, 0),
        new THREE.Vector3(55, 150,0),
        new THREE.Vector3(45, 45, 0),
        new THREE.Vector3(55, 45, 0),
        new THREE.Vector3(60, 50, 0)
    ];

    // E
    this.letter['e']  = [
        new THREE.Vector3(0,  50, 0),
        new THREE.Vector3(15, 55, 0),
        new THREE.Vector3(20, 70, 0),
        new THREE.Vector3(10, 70, 0),
        new THREE.Vector3(5,  40, 0),
        new THREE.Vector3(40, 50, 0)
    ];

    // F
    this.letter['f'] = [
        new THREE.Vector3(0,  50, 0),
        new THREE.Vector3(10, 60, 0),
        new THREE.Vector3(20, 100,0),            
        new THREE.Vector3(10, 100,0),
        new THREE.Vector3(15, 40, 0),
        new THREE.Vector3(20, 0,  0),
        new THREE.Vector3(10, 0,  0),
        new THREE.Vector3(20, 40, 0),
        new THREE.Vector3(40, 50, 0)
    ]);

    // G
    this.letter['g'] = [
        new THREE.Vector3(0,  50, 0),
        new THREE.Vector3(10, 40, 0),
        new THREE.Vector3(15, 50, 0),
        new THREE.Vector3(20, 65, 0),   
        new THREE.Vector3(7,  55, 0),
        new THREE.Vector3(15, 40, 0),
        new THREE.Vector3(25, 0,  0),
        new THREE.Vector3(10, 0,  0),
        new THREE.Vector3(20, 40, 0),
        new THREE.Vector3(40, 50, 0)
    ];

    // H
    this.letter['h'] = [
        new THREE.Vector3(0,  50, 0),
        new THREE.Vector3(10, 60, 0),
        new THREE.Vector3(20, 100,0),
        new THREE.Vector3(10, 100,0),
        new THREE.Vector3(5,  40, 0),
        new THREE.Vector3(20, 65, 0),
        new THREE.Vector3(30, 65, 0),
        new THREE.Vector3(35, 40, 0),
        new THREE.Vector3(40, 50, 0)
    ];

    // I
    this.letter['i'] = [
        new THREE.Vector3(0,  50, 0),
        new THREE.Vector3(8,  52, 0),
        new THREE.Vector3(15, 70, 0),    
        new THREE.Vector3(17, 50, 0), 
        new THREE.Vector3(22, 45, 0), 
        new THREE.Vector3(35, 50, 0)   
    ];

    // L 
    this.letter['l'] = [
        new THREE.Vector3(0,  50, 0),
        new THREE.Vector3(10, 60, 0),
        new THREE.Vector3(20, 100,0),            
        new THREE.Vector3(10, 100,0),
        new THREE.Vector3(15, 40, 0),
        new THREE.Vector3(40, 50, 0),
    ];

    // M
    this.letter['m'] = [
        new THREE.Vector3(0,  50, 0),    
        new THREE.Vector3(10, 80, 0),    
        new THREE.Vector3(20, 80, 0),    
        new THREE.Vector3(25, 40, 0),
        new THREE.Vector3(28, 75, 0),
        new THREE.Vector3(45, 70, 0),    
        new THREE.Vector3(55, 45, 0),
        new THREE.Vector3(54, 75, 0),
        new THREE.Vector3(70, 75, 0),
        new THREE.Vector3(80, 45, 0),
        new THREE.Vector3(85, 50, 0)    
    ];

    // O
    this.letter['o'] = [
        new THREE.Vector3(0,  50, 0),
        new THREE.Vector3(10, 60, 0),
        new THREE.Vector3(25, 75, 0),
        new THREE.Vector3(50, 65, 0),
        new THREE.Vector3(45, 30, 0),
        new THREE.Vector3(15, 40, 0),
        new THREE.Vector3(20, 70, 0),
        new THREE.Vector3(45, 65, 0),
        new THREE.Vector3(55, 45, 0),
        new THREE.Vector3(60, 50, 0)
    ];

    // R
    this.letter['r'] = [
        new THREE.Vector3(0,  50, 0),
        new THREE.Vector3(8,  55, 0), 
        new THREE.Vector3(9, 65, 0),
        new THREE.Vector3(15, 70, 0),
        new THREE.Vector3(30, 68, 0),
        new THREE.Vector3(35, 50, 0),
        new THREE.Vector3(40, 50, 0)  
    ]);

    // T 
    this.letter['t'] = [
        new THREE.Vector3(0,  50, 0),
        new THREE.Vector3(10, 60, 0),
        new THREE.Vector3(15, 100,0),     
        new THREE.Vector3(15, 80, 0),
        new THREE.Vector3(0,  80, 0),
        new THREE.Vector3(30, 80, 0),
        new THREE.Vector3(15, 80, 0),       
        new THREE.Vector3(15, 40, 0),
        new THREE.Vector3(40, 50, 0)
    ];
    
    // U
    this.letter['u'] = [
        new THREE.Vector3(0,  50, 0),
        new THREE.Vector3(15, 80, 0),
        new THREE.Vector3(10,  40, 0),
        new THREE.Vector3(35, 40, 0),    
        new THREE.Vector3(50, 70, 0),
        new THREE.Vector3(51, 50, 0),
        new THREE.Vector3(60, 50, 0)
    ];

    // v
    this.letter['v'] = [
        new THREE.Vector3(0,  50, 0),
        new THREE.Vector3(8,  52, 0),
        new THREE.Vector3(10, 70, 0),    
        new THREE.Vector3(17, 40, 0), 
        new THREE.Vector3(22, 40, 0), 
        new THREE.Vector3(38, 68, 0),
        new THREE.Vector3(32, 52, 0),
        new THREE.Vector3(50, 50, 0)    
    ];

    // W
    this.letter['w'] = [
        new THREE.Vector3(0,  50, 0),
        new THREE.Vector3(8,  52, 0),
        new THREE.Vector3(10, 70, 0),    
        new THREE.Vector3(17, 40, 0), 
        new THREE.Vector3(22, 40, 0), 
        new THREE.Vector3(38, 68, 0),
        new THREE.Vector3(45, 40, 0), 
        new THREE.Vector3(50, 40, 0),
        new THREE.Vector3(60, 68, 0),
        new THREE.Vector3(70, 52, 0),
        new THREE.Vector3(80, 50, 0)     
    ];


    this.createBrush = function(){
        var geometry = new THREE.CubeGeometry(40,5, 4);
        var material = new THREE.MeshBasicMaterial({
            color: 0xff0000
        });
        this.box = new THREE.Mesh(geometry, material);
        scene.add(this.box);
    };

    this.letterGeometry = function(letter){
        this.spline = new THREE.SplineCurve3(this.letter[letter]);
        this.splinePoints = spline.getPoints(this.numPoints);
    };

    this.getNextLetter = function(){

    };

    this.brushBox = function () {
        if (this.isLetterToDraw && this.counter <= 1) {
            this.box.position = spline.getPointAt(counter);
            tangent = spline.getTangentAt(counter).normalize();
            axis.cross(up, tangent).normalize();
            var radians = Math.acos(up.dot(tangent));
            this.box.quaternion.setFromAxisAngle(axis, radians);
            this.counter += 0.005;
        } else {
            this.counter = 0;
            this.getNextLetter();
        }
    };

    this.addGeometry = function(){
        /*
        for (var i = 0; i < splinePoints.length; i++) {
            geometry.vertices.push(splinePoints[i]);
        }
        */
    };

}