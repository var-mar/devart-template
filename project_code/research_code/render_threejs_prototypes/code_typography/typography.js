//jkpqsx

function typography(){
    this.numPoints = 100;
    this.letter = {};
    this.numPoints = 50;
    this.isLetterToDraw = true;
    this.debug = false;
    this.showTextCenter = true;
    this.isVisibleBox = this.debug;
    var self = this;

    this.tangent = new THREE.Vector3();
    this.axis = new THREE.Vector3();
    this.up = new THREE.Vector3(0, 1, 0);
    this.down = new THREE.Vector3(0, -1, 0);

    // variables controlled by GUI
    this.varController = {
        timeAnimation:200,
        counterIncrement:0.05,
        whiteSpaceWidth: 50,
        widthBrush:2.0
    };
    this.letter[' '] = [
        new THREE.Vector3(0,  50, 0),
        new THREE.Vector3(25,  45, 0),
        new THREE.Vector3(50,  50, 0)
    ];
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
    ];

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
        new THREE.Vector3(13,  50, 0),
        new THREE.Vector3(20, 70, 0),    
        new THREE.Vector3(23, 50, 0), 
        new THREE.Vector3(27, 38, 0), 
        new THREE.Vector3(40, 50, 0)
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
        new THREE.Vector3(9,  65, 0),
        new THREE.Vector3(15, 70, 0),
        new THREE.Vector3(30, 68, 0),
        new THREE.Vector3(35, 50, 0),
        new THREE.Vector3(40, 50, 0)  
    ];

    this.letter['s'] = [
        new THREE.Vector3(0,  50, 0), 
        new THREE.Vector3(15, 62, 0),
        new THREE.Vector3(35, 75, 0),
        new THREE.Vector3(30, 45, 0),   
        new THREE.Vector3(25, 32, 0),
        new THREE.Vector3(20, 40, 0),
        new THREE.Vector3(50, 50,  0) 
    ];

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
        new THREE.Vector3(5,  50, 0),
        new THREE.Vector3(15, 70, 0),
        new THREE.Vector3(10, 30, 0),
        new THREE.Vector3(25, 30, 0),    
        new THREE.Vector3(40, 60, 0),
        new THREE.Vector3(41, 40, 0),
        new THREE.Vector3(50, 50, 0)
    ];

    // V
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

    // Y
    this.letter['y'] = [
        new THREE.Vector3(0,  50, 0),
        new THREE.Vector3(10, 40, 0),
        new THREE.Vector3(5, 65, 0),
        new THREE.Vector3(15, 40, 0),   
        new THREE.Vector3(30,  65, 0),
        new THREE.Vector3(25, 40, 0),
        new THREE.Vector3(40, 0,  0),
        new THREE.Vector3(30, 0,  0),
        new THREE.Vector3(30, 40, 0),
        new THREE.Vector3(50, 50, 0)    
    ];

    // Z
    this.letter['z'] = [
        new THREE.Vector3(0,  50, 0),
        new THREE.Vector3(15, 65, 0),
        new THREE.Vector3(30, 70, 0),
        new THREE.Vector3(35, 70, 0),
        new THREE.Vector3(20, 50, 0),   
        new THREE.Vector3(35, 45, 0),
        new THREE.Vector3(50, 0,  0),
        new THREE.Vector3(40, 0,  0),
        new THREE.Vector3(40, 40, 0),
        new THREE.Vector3(60, 50, 0)    
    ];

    this.newWish = function(){
        this.wish = "";
        this.letterId = -1;
        this.startX = 0.0;
        this.count = 0;
        this.line = null;
        this.f = 0;  // faces
        this.previusTR = null;
        this.previusBR = null;
        this.widthLastLetter = 0;
        this.totalVerticesHandFont = 9999; // could be calculate
        this.createHandLetters();

        self.lastCounter = 0;
        self.counterGeometrySample = 0.05; 
    };

    this.createHandLetters = function(){    
        // create 9999 vertices that are not visible (maybe you can calculate the number before) 
        var geometryHandFont = new THREE.Geometry();
        geometryHandFont.dynamic = true;

        for(var i = 0; i < this.totalVerticesHandFont; i++){
            geometryHandFont.vertices.push(new THREE.Vector3());
            //geometryHandFont.vertices[geometryHandFont.vertices.length-1].visible = false;
            if(i % 3 === 0 && i + 3 < (this.totalVerticesHandFont+1)){
                geometryHandFont.faces.push(new THREE.Face3(this.f++,this.f++,this.f++));
            }
        }
        //this.lastVerticeIndex = -1;
        this.lastVerticeIndex = this.totalVerticesHandFont-1;

        var materialHandFont = new THREE.MeshBasicMaterial({
            color: 0xffffff, wireframe:true, side: THREE.DoubleSide
        });
        
        this.handFont = new THREE.Mesh(geometryHandFont, materialHandFont);
        this.handFont.geometry.dynamic = true;
        scene.add(this.handFont);

        if(this.debug){
            document.getElementById('totalVertices').innerHTML = this.handFont.geometry.vertices.length; 
        }
    };

    this.createBrush = function(){
        if(this.debug){
            var geometrySmallBox = new THREE.BoxGeometry(5,5, 4);
            var material2 = new THREE.MeshBasicMaterial({
                color: 0x00ff00
            });
            this.boxTop = new THREE.Mesh(geometrySmallBox, material2);
            this.boxBottom = new THREE.Mesh(geometrySmallBox, material2);
            scene.add(this.boxTop);
            scene.add(this.boxBottom);
        }
    };

    this.addWord = function(word){
        word = word.toLowerCase();
        this.wish += word;
        if( !this.textInterval) {
            if(this.debug){
                console.log("start interval");
            }
            this.interval = setInterval(this.moveBox, this.varController.timeAnimation);
        }
        this.isLetterToDraw = true;
        document.getElementById('wish').innerHTML = this.wish;
        document.getElementById('total-letters').innerHTML = this.wish.length;
    };

    this.findNextLetter = function(){
        this.letterId +=1;
        if(this.letterId < this.wish.length){
            this.startX += self.widthLastLetter;
            try{
                var letter = this.wish.split('')[this.letterId];
                document.getElementById('letter').innerHTML = letter;
                this.letterGeometry(letter);
                self.widthLastLetter = self.spline.points[self.spline.points.length-1].x;
            }catch(err){}
        }else{
            clearInterval(this.interval);
        }
        if(this.debug){
            document.getElementById('startx').innerHTML = this.startX;
        }
    };

    this.letterGeometry = function(letter){
        if(this.debug){
            console.log("get new letter");
        }
        this.spline = new THREE.SplineCurve3(this.letter[letter]);
        this.splinePoints = this.spline.getPoints(this.numPoints);

        var material = new THREE.LineBasicMaterial({
            color: 0xff00f0,
        });

        var splinePoints = this.spline.getPoints(this.numPoints);


        var geometry = new THREE.Geometry();
        for (var i = 0; i < this.splinePoints.length; i++) {
            geometry.vertices.push(this.splinePoints[i]);
        }
        
        if(this.debug){
            if(this.line!=null){ 
                scene.remove(this.line);
                if(this.debug){
                console.log("remove line object");
                }
            }
            this.line = new THREE.Line(geometry, material);
            this.line.position.x = this.startX;
            scene.add(this.line);
        }
    };

    this.moveBox = function () {
        console.log(self.isLetterToDraw);
        console.log(self.counter);
        document.getElementById('counter').innerHTML = self.counter;
        document.getElementById('letterId').innerHTML =self.letterId;
        if (self.isLetterToDraw && self.counter <= 1) {   
            if(self.counter>1.0){
                self.counter = 1.0;
            }         
            var position = self.spline.getPointAt(self.counter);
            position.x += self.startX;

            self.tangent = self.spline.getTangentAt(self.counter).normalize();
            self.axis.crossVectors(self.up, self.tangent).normalize();
            var radians = Math.acos(self.up.dot(self.tangent));
            
            var pxT = self.tangent.x * Math.cos(Math.PI/2) - self.tangent.y * Math.sin(Math.PI/2); 
            var pyT = self.tangent.x * Math.sin(Math.PI/2) + self.tangent.y * Math.cos(Math.PI/2);
            var pxB = self.tangent.x * Math.cos(-Math.PI/2) - self.tangent.y * Math.sin(-Math.PI/2); 
            var pyB = self.tangent.x * Math.sin(-Math.PI/2) + self.tangent.y * Math.cos(-Math.PI/2);

            var tr = new THREE.Vector3(  position.x+self.varController.widthBrush*pxT,
                                         position.y+self.varController.widthBrush*pyT,
                                         position.z+self.varController.widthBrush*self.tangent.z
                                    );
            var br = new THREE.Vector3(  position.x+self.varController.widthBrush*pxB,
                                         position.y+self.varController.widthBrush*pyB,
                                         position.z+self.varController.widthBrush*self.tangent.z
                                    );
            
            if(self.debug){
                self.boxTop.position.x = tr.x;
                self.boxTop.position.y = tr.y;
                self.boxTop.position.z = tr.z;

                self.boxBottom.position.x = br.x;
                self.boxBottom.position.y = br.y;
                self.boxBottom.position.z = br.z;
            }
            
            self.addGeometry(tr, br);
            self.counter += self.varController.counterIncrement;

        } else {
            self.counter = 0.0;
            self.findNextLetter();
            if(self.debug){
                console.log("new letter");
            }
        }
    };

    this.addGeometry = function(tr, br){
        if(this.previusTR != null){
            var tl = this.previusTR;
            var bl = this.previusBR;
            var tr = tr;
            var br = br;
            
            // triangle 1
            this.handFont.geometry.vertices[this.lastVerticeIndex--] = tl;
            this.handFont.geometry.vertices[this.lastVerticeIndex--] = tr;
            this.handFont.geometry.vertices[this.lastVerticeIndex--] = br;
            // triangle 2
            this.handFont.geometry.vertices[this.lastVerticeIndex--] = tr;
            this.handFont.geometry.vertices[this.lastVerticeIndex--] = br;
            this.handFont.geometry.vertices[this.lastVerticeIndex--] = bl;
            
            this.handFont.geometry.verticesNeedUpdate = true;
            this.handFont.geometry.elementsNeedUpdate = true;

            this.handFont.geometry.computeBoundingBox();
            this.handFont.geometry.computeFaceNormals();
            this.handFont.geometry.computeVertexNormals();

            if(this.showTextCenter){
                var boundingBoxMax = this.handFont.geometry.boundingBox.max,
                centerXPos = boundingBoxMax.x / -2,
                centerYPos = boundingBoxMax.y / -2,
                centerZPos = boundingBoxMax.z / -2;
                
                this.handFont.position = new THREE.Vector3(centerXPos,centerYPos,centerZPos);
            }
        }   
        this.previusTR = tr;
        this.previusBR = br;
        if(this.debug){
            document.getElementById('totalUseVertices').innerHTML = this.handFont.geometry.vertices.length - this.lastVerticeIndex;
        }
    };
    /*
    this.updateGeometry = function(tr, br){
        var totalVertices = this.handFont.geometry.vertices.length;  
        this.handFont.geometry.vertices[ totalVertices-2] =  br;
        this.handFont.geometry.vertices[ totalVertices-3] =  tr;
        this.handFont.geometry.vertices[ totalVertices-4] =  br;
        this.handFont.geometry.vertices[ totalVertices-5] =  tr;
        this.handFont.geometry.verticesNeedUpdate = true;
        this.handFont.geometry.computeBoundingBox();
        this.previusTR = tr;
        this.previusBL = br;
    };
    */
    this.unload = function(){
        scene.remove(this.line);
        if(this.isVisibleBox){
            scene.remove(this.box);
        }
    };

    this.valuesChanger = function(){

    };

    this.newWish();
    this.createBrush();
};