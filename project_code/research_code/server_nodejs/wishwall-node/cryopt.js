var crypt = require('crypto');

var key = "dIek2mfpahr5nQ6WO7NYasdIWE82640yh";

function cryptMethods(){
	
}

cryptMethods.prototype.encrypt= function (text){
	var cipher = crypt.createCipher('aes-256-cbc',key)
	var crypted = cipher.update(text,'utf8','hex')
	crypted += cipher.final('hex');
	return crypted;
}
 
cryptMethods.prototype.decrypt = function (text){
	var decipher = crypt.createDecipher('aes-256-cbc',key)
	var dec = decipher.update(text,'hex','utf8')
	dec += decipher.final('utf8');
	return dec;
}
 
exports.cryptMethods = cryptMethods;

/*
var hw = encrypt("hello world");
console.log(hw);
console.log(decrypt(hw));
*/