var fs = require('fs'),
    path = require('path'),
    svg2png = require('svg2png'),
    xml = require("xml2json"),
    colorScheme = require('color-scheme'),
    Shuffle = require("shuffle");

function renderButterfly(){

}

renderButterfly.prototype = {
    // -------------------------------------------------------------------------------------------------------
    shuffle: function (array) {
      var currentIndex = array.length
        , temporaryValue
        , randomIndex
        ;

      // While there remain elements to shuffle...
      while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
      }
      return array;
    },
    // -------------------------------------------------------------------------------------------------------
    selectColor:function(){
        var scheme = new colorScheme;
        scheme.from_hue(Math.floor((Math.random()*360)))         // Start the scheme 
            .scheme('triade')     // Use the 'triade' scheme, that is, colors
                            // selected from 3 points equidistant around
                            // the color wheel.
            .variation('pastel');   // Use the 'soft' color variation
        var colors = scheme.colors();
        var first = colors.shift();
        var deck = this.shuffle(colors);
        deck.unshift(first);
        colors = deck;
        return colors;
    },
    // -------------------------------------------------------------------------------------------------------
    getAnalyzeEmotionsInOrder:function (analyze){
        delete analyze['emotions']['negative'];
        delete analyze['emotions']['positive'];
        var sortable = [];
        for (var emotion in analyze.emotions){
            sortable.push([emotion, analyze.emotions[emotion]]);
            sortable.sort(function(a, b) {return a[1] - b[1]});
        }
        sortable.reverse();
        return sortable;
    },
    // -------------------------------------------------------------------------------------------------------
    
    getColourFromHue:function (hue){
        var scheme = new colorScheme();
        scheme.from_hue(hue)         // Start the scheme 
            .scheme('triade')     // Use the 'triade' scheme, that is, colors
                            // selected from 3 points equidistant around
                            // the color wheel.
            .variation('pastel');   // Use the 'soft' color variation
        var colors = scheme.colors();
        return colors.shift();
    },
    // -------------------------------------------------------------------------------------------------------
    analyzeColor:function (analyze){
        // get two more active emotions
        var emotionsInOrder = this.getAnalyzeEmotionsInOrder(analyze);
        var outputColours = [];
        var count = 0; 
        for( c in emotionsInOrder){     
            if(count<2 && emotionsInOrder[c][1]>0){
                var emotion = emotionsInOrder[c][0];
                var randomFactor = ((Math.random()-0.5)*10.0);
                console.log(randomFactor);
                outputColours.push( this.getColourFromHue( this.coloursToEmotions[emotion] + randomFactor ) );
                count +=1;
            }else{
                break;
            }
        }
        console.log(outputColours);
        return outputColours;
    },
    // -------------------------------------------------------------------------------------------------------
    thereAreEmotions:function(analyze){
        for(i in analyze.emotions){
            if(analyze.emotions[i]!=0){
                return true;
            }
        }
        return false;
    },
    // -------------------------------------------------------------------------------------------------------
    getColoursEmotions:function (){
        this.coloursToEmotions =  
        { 
            anger: 347.0,
            anticipation: 27.0,
            disgust: 298.0,
            fear: 151.0,
            joy: 47.0,
            sadness: 200.0,
            surprise: 188.0,
            trust: 109.0
        };
    },
    // -------------------------------------------------------------------------------------------------------
    analyzePositiveNegativeColor:function (value){
        this.getColoursEmotions();
        var outputArray = [];
        var randomFactor = ((Math.random()-0.5)*10.0);
        var randomFactor2 = ((Math.random()-0.5)*10.0);
        if(value>0.0){
            outputArray = [
                this.getColourFromHue(this.coloursToEmotions['joy'] + randomFactor),
                this.getColourFromHue(this.coloursToEmotions['joy'] + randomFactor2) 
            ];
        }else{
            outputArray = [
                this.getColourFromHue(this.coloursToEmotions['sadness'] + randomFactor),
                this.getColourFromHue(this.coloursToEmotions['sadness'] + randomFactor2) 
            ];
        }
        return outputArray;
    },
    // -------------------------------------------------------------------------------------------------------
    start:function(id,analyze,_callback){
        this.id = id;
        console.log('start');
        console.log(analyze);
        this.getColoursEmotions();
        var callback = _callback;
        var modelId = Math.floor((Math.random()*5)+1);
        filepath = path.resolve(__dirname, 'models-butterflies-svg/butterfly'+modelId+'.svg');
        var self = this;
        fs.readFile(filepath, 'utf8', function(err, data) {
            if (err) {
                console.log('Error read butterfly SVG model file')
            }  
            var dataModified = data;
            var colorArRandom = self.selectColor();
            var colorArAnalyze = self.analyzeColor(analyze);
            self.colorAr = [];
            // replace color
            if(self.thereAreEmotions(analyze)){
                self.colorAr = self.analyzeColor(analyze);
                console.log("Choose analyze colors");
            }else if(analyze.sentiment.comparative!=0){
                self.colorAr = self.analyzePositiveNegativeColor(analyze.sentiment.comparative);
                // Add a random colour sometimes
                if(Math.random()>0.5){
                    self.colorAr[1] = colorArRandom[0];    
                }
                console.log("Choose positive colors",analyze.sentiment.comparative, self.colorAr);

            }else{
               self.colorAr = colorArRandom;
               console.log("Choose random colors");
               console.log(self.colorAr);
            }
            // Color1
            if(dataModified.indexOf("#FF0000")!=-1 ){
                dataModified = dataModified.replace("#FF0000","#"+self.colorAr[0]);
            }
            // Color2
            if(dataModified.indexOf("#FFFFFF")!=-1 ){
                dataModified = dataModified.replace("#FFFFFF","#"+self.colorAr[1]);
            }
            // save SVG
            self.saveSVG(dataModified,self.id,callback);
        });
    },
    // -------------------------------------------------------------------------------------------------------
    saveSVG:function(dataModified,id,callback){
        var self = this;
        var svg_file = "svg/butterfly_modify_"+id+".svg";
        console.log('saving SVG', id);
        fs.writeFile(svg_file, dataModified, function(err) {
                if(err) {
                    console.log(err);
                } else {
                    console.log(id+":The file was saved!");
                    // 
                    self.savePNG(svg_file,id,callback);
                }
        });
    },
    // -------------------------------------------------------------------------------------------------------
    savePNG:function(svg_file,id,callback){
        var self = this;
        console.log('SVG2PNG', id);
        svg2png(svg_file, "./public/butterflyTextures/"+(id).toString()+".png", function (err) {
            // ones png is save it delete modify svg
            try{
                fs.unlink(svg_file, function (err) {
                    if (err){
                        console.log("error deleting file.", svg_file, id);
                    }
                });
            }catch(err){
                console.log("error deleting file");
            }
            // call back
            callback(self.colorAr);
        });
    }

};

exports.renderButterfly = renderButterfly;