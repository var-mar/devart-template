//jkpqsx

function typography(){
    
    //THREE.Geometry.call( this );
    this.callbackChanger = null;
    this.numPoints = 100;
    this.letter = {};
    this.numPoints = 50;
    this.isLetterToDraw = true;
    this.debug = false;
    this.showTextCenter = false;
    this.isVisibleBox = this.debug;
    var self = this;

    this.tangent = new THREE.Vector3();
    this.axis = new THREE.Vector3();
    this.up = new THREE.Vector3(0, 1, 0);
    this.down = new THREE.Vector3(0, -1, 0);
    this.vertexIndexByLetter = new Array();

    this.minimWidthForCocoon = 200;

    // variables controlled by GUI
    this.varController = {
        timeAnimation:15,
        counterIncrement:0.05,
        whiteSpaceWidth: 50,
        widthBrush:4.0
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

    // J
    this.letter['j'] = [
        new THREE.Vector3(0, 50, 0),
        new THREE.Vector3(5, 65, 0),
        new THREE.Vector3(10, 40, 0),
        new THREE.Vector3(10, 0,  0),
        new THREE.Vector3(5, 40, 0),
        new THREE.Vector3(30, 50, 0) 
    ];

    // K
    this.letter['k'] = [
        new THREE.Vector3(0,  50, 0),
        new THREE.Vector3(10, 60, 0),
        new THREE.Vector3(12, 100,0),       
        new THREE.Vector3(10, 100,0),
        new THREE.Vector3(5,  40, 0),     
        new THREE.Vector3(5, 50, 0),
        new THREE.Vector3(35, 80, 0),
        new THREE.Vector3(7, 50, 0),
        new THREE.Vector3(13, 55, 0),
        new THREE.Vector3(20, 40, 0),
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

    // N
    this.letter['n'] = [
        new THREE.Vector3(0,  50, 0),    
        new THREE.Vector3(10, 80, 0),    
        new THREE.Vector3(20, 80, 0),    
        new THREE.Vector3(25, 40, 0),
        new THREE.Vector3(32, 70, 0),
        new THREE.Vector3(45, 70, 0),    
        new THREE.Vector3(55, 45, 0),
        new THREE.Vector3(65, 50, 0)    
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

    // P
    this.letter['p'] = [
        new THREE.Vector3(0, 50, 0),
        new THREE.Vector3(8, 55, 0),
        new THREE.Vector3(10, 40, 0),
        new THREE.Vector3(10, 0,  0),
        new THREE.Vector3(13, 40, 0),
        new THREE.Vector3(25, 55, 0),
        new THREE.Vector3(10, 65, 0),
        new THREE.Vector3(15, 40, 0),
        new THREE.Vector3(40, 50, 0),
    ];

    // Q
    this.letter['q'] = [
        new THREE.Vector3(0, 50, 0),
        new THREE.Vector3(5, 50, 0),
        new THREE.Vector3(15, 58, 0),
        new THREE.Vector3(30, 65, 0),
        new THREE.Vector3(25, 50, 0),
        new THREE.Vector3(15, 55, 0),
        new THREE.Vector3(30, 65, 0),
        new THREE.Vector3(30, 40, 0),
        new THREE.Vector3(30, 0,  0),
        new THREE.Vector3(33, 40, 0),
        new THREE.Vector3(45, 50, 0)
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

    // S
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

    // X
    this.letter['x'] = [
        new THREE.Vector3(0,  50, 0),
        new THREE.Vector3(15,  52, 0),
        new THREE.Vector3(5, 70, 0),
        new THREE.Vector3(35, 30, 0),
        new THREE.Vector3(20, 50, 0),
        new THREE.Vector3(5, 30, 0),
        new THREE.Vector3(35, 70, 0),
        new THREE.Vector3(20, 48, 0),
        new THREE.Vector3(50, 50, 0)    
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

    this.setup = function(){
        this.wish = "";
        this.setupVars();
        this.createHandLetters();
    };

    this.setupVars = function() {
        this.letterId = -1;
        this.startX = 0.0;
        this.count = 0;
        this.line = null;
        this.f = 0;  // faces
        this.previusTR = null;
        this.previusBR = null;
        this.widthLastLetter = 0;
        this.totalVerticesHandFont = 9999; // could be calculate
        this.counter = 99999;
        this.lastCounter = 0;
        this.counterGeometrySample = 0.05; 
        this.isNeedToMove  = false;
    };

    // call this everytime new wish
    this.newWish = function(){
        this.setupVars();
        this.isDeleteBeforeToDraw = false;
        this.isLetterToDraw = false;
        this.lastVerticeIndex = this.totalVerticesHandFont-1;
        // place vertex in origin position
        for(var i = 0; i < this.totalVerticesHandFont; i++){
            this.ngeo.vertices[i].x = this.ngeo.vertices[i].y = this.ngeo.vertices[i].z = 0;
            this.ogeo.vertices[i].x = this.ogeo.vertices[i].y = this.ogeo.vertices[i].z = 0;
        }
        this.ngeo.verticesNeedUpdate = true;
        this.ngeo.elementsNeedUpdate = true;
        this.ogeo.verticesNeedUpdate = true;
        this.ogeo.elementsNeedUpdate = true;

        this.ngeo.computeBoundingBox();
        this.ogeo.computeBoundingBox();
        this.calculateTextHeight();
    };

    this.setCallback = function(_callbackChanger){
        this.callbackChanger = _callbackChanger;
    };

    this.createHandLetters = function(){    
        this.ngeo  = new THREE.Geometry();
        this.ogeo  = new THREE.Geometry();
        // create 9999 vertices that are not visible (maybe you can calculate the number before) 
        this.ngeo.dynamic = true;
        this.ogeo.dynamic = true;
        for(var i = 0; i < this.totalVerticesHandFont; i++){
            this.ngeo.vertices.push(new THREE.Vector3());
            this.ogeo.vertices.push(new THREE.Vector3());
            //geometryHandFont.vertices[geometryHandFont.vertices.length-1].visible = false;
            if(i % 3 === 0 && i + 3 < (this.totalVerticesHandFont+1)){
                this.ngeo.faces.push(new THREE.Face3(this.f,this.f+1,this.f+2));
                this.ogeo.faces.push(new THREE.Face3(this.f,this.f+1,this.f+2));
                this.f+=3;
            }
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

    this.addNewWish = function(words){
        this.isFinishSpeech = false;
        words = words.toLowerCase();
        this.wish = words;
        // reset geometry
        this.newWish();
        if(words!=''){
            if( !this.isNeedToMove ) {
                if(this.debug){
                    console.log("start interval");
                }
                this.isNeedToMove  = true;
            }
            this.isLetterToDraw = true;
        }
        if(this.debug){
            document.getElementById('wish').innerHTML = this.wish;
            document.getElementById('total-letters').innerHTML = this.wish.length;
        }
    };

    this.addWord = function(word){
        word = word.toLowerCase();
        console.log(word+" - "+this.wish);
        // Clean speech to characters that we don't have.
        word = this.replaceLettersNotExiting(word);
        // do nothing if word are same as current wish
        if(word==this.wish){ 
            return;
        }else if(this.wish==''){
            this.addNewWish(word);
            return;
        }
        if(this.isCorrectionsInWords(word)){
            console.log("enter to correct");
            var differentIndex = this.indexNewCorrectedWish(word);
            // correction is reusing part of sentence
            if(this.letterId >= differentIndex){
                this.letterId = differentIndex;
                this.deleteUntilVertex = this.vertexIndexByLetter[this.letterId];
                //this.letterId--;
                this.isDeleteBeforeToDraw = true;
                console.log("new to correct string", this.deleteUntilVertex, this.letterId, this.vertexIndexByLetter);
                this.isLetterToDraw = true;
            }
        }else if(!this.isDeleteBeforeToDraw){
            this.isDeleteBeforeToDraw = false;   
            this.isLetterToDraw = true;
        }
        
        this.wish = word;
        
        if(this.debug){
            document.getElementById('wish').innerHTML = this.wish;
            document.getElementById('total-letters').innerHTML = this.wish.length;
        }

        if( !this.isNeedToMove) { //this.textInterval 
            if(this.debug){
                console.log("start interval");
            }
            //this.interval = setInterval(this.moveBox, this.varController.timeAnimation);
            this.isNeedToMove  = true;
        }
    };

    this.replaceLettersNotExiting = function(string){
        return string.replace(/[^a-z ]/ig, ' ');
    };

    this.isCorrectionsInWords = function(word){
        var wordTemp =""+word;
        if( wordTemp.indexOf(this.wish)==0){
            return false;
        }else{
            return true;
        }
    };

    this.indexNewCorrectedWish = function(word){
        var string1 = this.wish;
        var string2 = word;
        var i;
        for (i=0; i<string1.length && i<string2.length; i++) {
            if (string1.charCodeAt(i) !== string2.charCodeAt(i)) {
                return i;
            }
        }
        return i;
    };

    this.calculateStartXLetter = function(){
        var startX = 0;
        for(i=0;i<this.letterId;i++){
            var letter = this.wish.split('')[i];
            startX += this.letter[letter][this.letter[letter].length-1].x;
        }
        return startX;
    };

    this.findNextLetter = function(){
        if (self.debug) {
            console.log("findNextLetter", this.letterId);
        }
        this.letterId +=1;
        // reference vertex used for each letter in case we want to remove in the fly
        this.vertexIndexByLetter.push(this.lastVerticeIndex);
        if(this.letterId < this.wish.length){
            this.startX = this.calculateStartXLetter();
            try{
                this.currentLetter = this.wish.split('')[this.letterId];
                if(this.debug){
                    document.getElementById('letter').innerHTML = this.currentLetter;
                }
                this.letterGeometry(this.currentLetter);
            }catch(err){}
        }else{
            //clearInterval(this.interval);
            this.isNeedToMove = false;
            if(this.isFinishSpeech){
                if(this.wish!=''){
                    this.eventsCallback("text-finish-drawing");
                }else{
                    this.eventsCallback("ready-to-get-wish");
                }
            }
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

        var geometry = new THREE.Geometry();
        for (var i = 0; i < this.splinePoints.length; i++) {
            geometry.vertices.push(this.splinePoints[i]);
        }
        
        if(this.debug){
            if(this.line!=null){ 
                scene.remove(this.line);
                if(this.debug) {
                    console.log("remove line object");
                }
            }

            var material = new THREE.LineBasicMaterial({
                color: 0xff00f0,
            });

            this.line = new THREE.Line(geometry, material);
            this.line.position.x = this.startX;
            scene.add(this.line);
        }
    };

    this.update = function () {
        if(self.isNeedToMove){
            if(self.debug){
                document.getElementById('counter').innerHTML = self.counter;
                document.getElementById('letterId').innerHTML = self.letterId;
            }

            if(self.isDeleteBeforeToDraw){
                if (self.deleteUntilVertex > self.lastVerticeIndex) {
                    self.removeGeometry();
                }
                if (self.deleteUntilVertex <= self.lastVerticeIndex){
                    self.isDeleteBeforeToDraw = false;
                    if(self.debug){
                        console.log('removeGeometry end');
                    }
                    self.findNextLetter();
                    if (self.lastVerticeIndex+6 < this.ngeo.vertices.length) {
                        self.previusTR = self.ngeo.vertices[self.lastVerticeIndex+7];
                        self.previusBR = self.ngeo.vertices[self.lastVerticeIndex+10];
                    } else {
                        self.previusBR = null;
                        self.previusTR = null;
                    }
                    self.counter = 0.0;
                }
                if(self.callbackChanger != null){
                    self.callbackChanger();
                }
            }else if (self.isLetterToDraw && self.counter <= 1 ) {   
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

                var brushWidth = self.varController.widthBrush;
                if(self.currentLetter==' '){
                    halfBrushWidth = brushWidth*0.5;
                    brushWidth = (halfBrushWidth*0.2)+halfBrushWidth * Math.abs(self.counter-0.5);
                }

                var tr = new THREE.Vector3(  position.x+brushWidth*pxT,
                                             position.y+brushWidth*pyT,
                                             position.z+brushWidth*self.tangent.z
                                        );
                var br = new THREE.Vector3(  position.x+brushWidth*pxB,
                                             position.y+brushWidth*pyB,
                                             position.z+brushWidth*self.tangent.z
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

                if(self.callbackChanger != null){
                    self.callbackChanger();
                }
            }else {
                if(self.debug){
                    console.log("new letter");
                }
                self.counter = 0.0;
                self.findNextLetter();
            }
        }
    };

    this.repeatText = function(){
        if(this.wish.length < 24){
            var diff = 24 - this.wish.length;
            var text = " ";
            for(var j = 0; j<diff-1; j++){
                text += (this.wish.charAt(j % this.wish.length) || " ");
            }
            var w = this.wish + text;
            this.addWord(w);
        }
    };

    // own methods
    this.calculateTextWidth = function(){
        if(true){
            this.ngeo.computeBoundingBox();
            this.textWidth = this.ngeo.boundingBox.max.x;
        }else{
            var startVertices = this.vertexIndexByLetter[this.vertexIndexByLetter.length-1];
            var tempWidth = self.startX;
            for(var i=startVertices; i<this.lastVerticeIndex; i++){
                if(this.ngeo.vertices[i].x>tempWidth){
                    tempWidth = this.ngeo.vertices[i].x;
                }
            }
            this.textWidth = tempWidth;
        }
    };

    // Height of the font - only need to calculate onces
    this.calculateTextHeight = function(){
        var textHeight = 0;
        for(var i in this.letter){
            for(var y = 0;y<this.letter[i].length;y++){
                var v = this.letter[i][y];
                if(v.y>this.textHeight){
                   textHeight = this.letter.y; 
                }
            }
        }  
        this.textHeight = textHeight;
    };

    this.getTextHeight = function(){
        return this.textHeight;
    };

    this.getTextWidth = function(){
        return this.textWidth;
    };

    this.removeGeometry = function(){
        if(this.lastVerticeIndex<(this.totalVerticesHandFont-6)){
            if(this.lastVerticeIndex < this.ngeo.vertices.length){
                // Modifications in Geometry 1
                // triangles 1
                this.ngeo.vertices[this.lastVerticeIndex+6] = 0;
                this.ngeo.vertices[this.lastVerticeIndex+5] = 0;
                this.ngeo.vertices[this.lastVerticeIndex+4] = 0;
                // triangle 2
                this.ngeo.vertices[this.lastVerticeIndex+3] = 0;
                this.ngeo.vertices[this.lastVerticeIndex+2] = 0;
                this.ngeo.vertices[this.lastVerticeIndex+1] = 0;
                this.ngeo.verticesNeedUpdate = true;
                this.ngeo.elementsNeedUpdate = true;

                // Modifications in Geometry 2
                // triangles 1
                this.ogeo.vertices[this.lastVerticeIndex+6] = 0;
                this.ogeo.vertices[this.lastVerticeIndex+5] = 0;
                this.ogeo.vertices[this.lastVerticeIndex+4] = 0;
                // triangle 2
                this.ogeo.vertices[this.lastVerticeIndex+3] = 0;
                this.ogeo.vertices[this.lastVerticeIndex+2] = 0;
                this.ogeo.vertices[this.lastVerticeIndex+1] = 0;
                this.ogeo.verticesNeedUpdate = true;
                this.ogeo.elementsNeedUpdate = true;
                
                this.lastVerticeIndex+=6;

                this.calculateTextWidth();
            }
        }
    };

    this.addGeometry = function(tr, br){
        if(this.lastVerticeIndex>6){
            if(this.previusTR != null){
                var tl = this.previusTR;
                var bl = this.previusBR;
                var tr = tr;
                var br = br;

                // Modifications in Geometry 2
                // triangles 1
                this.ngeo.vertices[this.lastVerticeIndex--] = br;
                this.ngeo.vertices[this.lastVerticeIndex--] = tl;
                this.ngeo.vertices[this.lastVerticeIndex--] = tr;
                
                // triangle 2
                this.ngeo.vertices[this.lastVerticeIndex--] = bl;
                this.ngeo.vertices[this.lastVerticeIndex--] = tl;
                this.ngeo.vertices[this.lastVerticeIndex--] = br;
                
                this.ngeo.verticesNeedUpdate = true;
                this.ngeo.elementsNeedUpdate = true;
                this.ngeo.computeBoundingBox();

                // Modifications in Geometry 2
                this.ogeo.vertices[this.lastVerticeIndex--] = br;
                this.ogeo.vertices[this.lastVerticeIndex--] = tl;
                this.ogeo.vertices[this.lastVerticeIndex--] = tr;
                
                // triangle 2
                this.ogeo.vertices[this.lastVerticeIndex--] = bl;
                this.ogeo.vertices[this.lastVerticeIndex--] = tl;
                this.ogeo.vertices[this.lastVerticeIndex--] = br;
                
                this.ogeo.verticesNeedUpdate = true;
                this.ogeo.elementsNeedUpdate = true;
            }   
            this.previusTR = tr;
            this.previusBR = br;
            
            if(this.debug){
                document.getElementById('totalUseVertices').innerHTML = this.vertices.length - this.lastVerticeIndex;
            }
            this.calculateTextWidth();
        }
    };
    
    this.unload = function(){
        scene.remove(this.line);
        if(this.isVisibleBox){
            scene.remove(this.box);
        }
    };

    this.setEventsCallback = function(callback){
        this.eventsCallback = callback;
    };

    this.finishSpeech = function(){
        this.isFinishSpeech = true;
        if(!self.isNeedToMove){
            if(this.wish!=''){
                this.eventsCallback("text-finish-drawing");
            }else{
                this.eventsCallback("ready-to-get-wish");
            }
        }
    }

    this.setup();
    this.createBrush();
    this.newWish();
};