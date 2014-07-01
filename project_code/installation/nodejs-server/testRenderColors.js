var fs = require('fs'),
    path = require('path'),
    svg2png = require('svg2png'),
    xml = require("xml2json"),
    colorScheme = require('color-scheme'),
    Shuffle = require("shuffle");

var analize = { 
	sentiment: 
      { score: 1,
        comparative: 0.16666666666666666},
     emotions: 
      { anger: 0,
        anticipation: 0,
        disgust: 1,
        fear: 2,
        joy: 0,
        sadness: 0,
        surprise: 0,
        trust: 0,
        negative: 0,
        positive: 0 } 
};

function getAnalyzeEmotionsInOrder(analize){
	delete analize.emotions['negative']
	delete analize.emotions['positive']
	var sortable = [];
	for (var emotion in analize.emotions){
    	sortable.push([emotion, analize.emotions[emotion]])
		sortable.sort(function(a, b) {return a[1] - b[1]})
	}
	sortable.reverse();
	return sortable;
}

function getColourFromHue(hue){
	var scheme = new colorScheme();
    scheme.from_hue(hue)         // Start the scheme 
        .scheme('triade')     // Use the 'triade' scheme, that is, colors
                        // selected from 3 points equidistant around
                        // the color wheel.
        .variation('pastel');   // Use the 'soft' color variation
    var colors = scheme.colors();
    return colors.shift();
}

function analyzeColor(analize){
    // get two more active emotions
    var coloursToEmotions =  
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
    var emotionsInOrder = getAnalyzeEmotionsInOrder(analize);
    var outputColours = [];
    var count = 0; 
    for( c in emotionsInOrder){    	
    	if(count<2 && emotionsInOrder[c][1]>0){
    		var emotion = emotionsInOrder[c][0];
    		var randomFactor = ((Math.random()-0.5)*10.0);
    		console.log(randomFactor);
    		outputColours.push( getColourFromHue( coloursToEmotions[emotion] + randomFactor ) );
    		count +=1;
    	}else{
    		break;
    	}
    }
    console.log(outputColours);
    return outputColours;
}

//analyzeColor(analize);

function analyzePositiveNegativeColor(value){
	var outputArray = [];
	var randomFactor = ((Math.random()-0.5)*10.0);
	var coloursToEmotions =  
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
	if(value>0.0){
		outputArray = [ coloursToEmotions['joy'] + randomFactor ];
	}else{
		outputArray = [ coloursToEmotions['sadness'] + randomFactor ];
	}
	return outputArray;
}

console.log( analyzePositiveNegativeColor(0.2) );