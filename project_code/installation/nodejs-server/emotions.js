/*
Emotions Node.js library makes text analysis from the 8 basic emotions. 

Credits: 
	* Node.js code: Mar Canet Sola & Varvara Guljajeva (as part Google Art commission Devart - art made with code)
	* Database: We are using NRC word-emotion by Saif M. Mohammad from National Research Council Canada.
	The lexicon has human annotations of emotion associations for more than 24,200 word senses (about 14,200 word types). The annotations include whether the target is positive or negative, and whether the target has associations with eight basic emotions (joy, sadness, anger, fear, surprise, anticipation, trust, disgust). The lexicon is described in the papers below.

	To get a copy lexicon copy go to fill a form in author website and agree in his terms of usage:
	http://www.saifmohammad.com/WebPages/ResearchInterests.html

========= USAGE ===============
e = new EmotionLexicon();
setTimeout(function(){
	output = e.analyse("i abandon to be butterfly ");
	console.log(output);
		//output in console object:
		//	{	
		//	anger: 0,
		//	anticipation: 0,
		//	disgust: 0,
		//	fear: 1,
		//	joy: 0,
		//	sadness: 1,
		//	surprise: 0,
		//	trust: 0,
		//	negative: 1,
		//	positive: 0 
		//	}
	
},3000);
*/
var fs = require('fs');
var path = require('path');

function EmotionLexicon(){
	this.load();
}

EmotionLexicon.prototype.analyse = function (sentence){
	var wordsAr = sentence.split(' ');
	var output = {'anger':0,'anticipation':0,'disgust':0,'fear':0,'joy':0,'sadness':0,'surprise':0,'trust':0,'negative':0,'positive':0};
	for(i=0;i<wordsAr.length;i++){
		try{
			this.addValues(output,this.database[wordsAr[i]]);
		}catch(err){}
	}
	return output;
};

EmotionLexicon.prototype.addValues = function(a,b){
	a.anger += b.anger;
	a.anticipation += b.anticipation;
	a.disgust += b.disgust;
	a.fear += b.fear;
	a.joy += b.joy;
	a.sadness += b.sadness;
	a.surprise += b.surprise;
	a.trust += b.trust;
	a.negative += b.negative;
	a.positive += b.positive;
	return a;
};

EmotionLexicon.prototype.load = function(){
	var filePath = path.join(__dirname + '/data/emotion-lexicon.json');
	var self = this;
	fs.readFile(filePath, {encoding: 'utf-8'}, function(err,data){
	    if (!err){
	    	self.database = JSON.parse(data);
	    }
	});
};

console.log("try");
e = new EmotionLexicon();
setTimeout(function(){
	output = e.analyse("i abandon to be butterfly ");
	console.log("output"+output);
		//output in console object:
		//	{	
		//	anger: 0,
		//	anticipation: 0,
		//	disgust: 0,
		//	fear: 1,
		//	joy: 0,
		//	sadness: 1,
		//	surprise: 0,
		//	trust: 0,
		//	negative: 1,
		//	positive: 0 
		//	}
	
},3000);

exports.EmotionLexicon = EmotionLexicon;