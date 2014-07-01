var fs = require('fs');
var path = require('path');
var ar = {};
function loadEmotionLExicon(){
	var filePath = path.join(__dirname + '/data/emotion-lexicon.txt');
	fs.readFile(filePath, {encoding: 'utf-8'}, function(err,data){
	    if (!err){
        	lines = data.split('\n');
        	for(i=0;i<lines.length;i++){
        		var arAtr = lines[i].split('\t');
        		if(ar[arAtr[0]]==undefined){
          			ar[arAtr[0]] = {'anger':0,'anticipation':0,'disgust':0,'fear':0,'joy':0,'sadness':0,'surprise':0,'trust':0,'negative':0,'positive':0}	
          		}
          		ar[arAtr[0]][arAtr[1]] += parseInt(arAtr[2]);
      		};
      		var strJson = JSON.stringify(ar);

      		var fs = require('fs');
			fs.writeFile("emotion-lexicon.json",strJson, function(err) {
			    if(err) {
			        console.log(err);
			    } else {
			        console.log("The file was saved!");
			    }
			});
        }
	});
}

loadEmotionLExicon();
