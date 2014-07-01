/*
Swear filter
Description:This filter text get in speech recognition to dictionay not apropiate words
*/
var fs = require('fs');
var path = require('path');

function swearFilter(){
	this.word_and_termsObj = {};
	this.word_and_termsAr = new Array();
	var self = this;

	this.load = function(){
		var filePath = path.join(__dirname + '/data/swear-filter-list.txt');
		
		fs.readFile(filePath, {encoding: 'utf-8'}, function(err,data){
		    if (!err){
		    	lines = data.split('\n');
	        	for(i=0;i<lines.length;i++){
					self.word_and_termsObj[lines[i].toLowerCase()] = 1;
					self.word_and_termsAr.push(lines[i].toLowerCase());
	        	}
		    }
		});
	};

	this.analyzeTerms = function(text){
		var textAr = text.split('');
		var foundTerm = false;
		for(var i=0;i<self.word_and_termsAr.length; i++){
			var wordOrTerm = this.word_and_termsAr[i];
			var index = text.indexOf(wordOrTerm);
			var lastLetter = text.substring(index+wordOrTerm.length,index+wordOrTerm.length+1);
			var startLetter = text.substring(index-1,index);
			if(index!=-1 && (lastLetter=='' || lastLetter==' ') && (startLetter=='' || startLetter==' ')){
				textAr = this.stars(index,index+this.word_and_termsAr[i].length,textAr);
				foundTerm  = true;
			}
		}
		if(foundTerm){
			text = "";
			for(var i=0; i<textAr.length; i++){
				text += textAr[i];
			}
		}
		return text;
	};

	this.stars = function(index,length,textAr){
		for(var i=index;i<length;i++){
			textAr[i] ="*";
		}
		return textAr;
	};
	this.load();
}

swearFilter.prototype.filter = function(text){
	text = text.toLowerCase();
	text = this.analyzeTerms(text);
	return text;
};

exports.swearFilter = swearFilter;
