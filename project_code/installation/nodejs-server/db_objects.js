var mongoose = require('mongoose');
var nconf = require('nconf');
nconf.file('./config.json');

mongoose.connect('mongodb://'+nconf.get("mongodb-host"));

var wishSchema = new mongoose.Schema({
  text: String
, filterText: String
, microphoneID: String
, exhibition_id: String
, status: String
, lang: String
, active: Boolean
, ban: Boolean
, ip:String
, geoip:Object
, time_closeMicrophone:Date 
, time_openMicrophone:Date 
, time_handPickButterfly:Date 
, time_butterflyGoFlying:Date 
, analyze:Object
, user:Object
, language:Object
});

var wishes = mongoose.model('wishes', wishSchema);

var butterflyPackageSchema = new mongoose.Schema({
	packageButterfly:  Buffer
});

var butterflyPackage = mongoose.model('butterflyPackage', butterflyPackageSchema);

var logSchema = new mongoose.Schema({
	data: Object
	, time_openMicrophone:Date 
});
var log = mongoose.model('log', logSchema);
// -----------------------------------------------------------------------------------------------
// WISHES
// -----------------------------------------------------------------------------------------------

function WishMongo(){
}
/*
// log

WishMongo.prototype.saveLog = function (inputObj,_callback){
	var newLog = new log(inputObj);
	var callback = _callback;
	newLog.save(function (err,data) {
		if (err){console.log('error');
			console.log('error');
		}else{
			console.log('save new log inside Mongo');
		}
		callback(err,data);
	});
	console.log('out');
};

*/


// Butterfly packages

WishMongo.prototype.saveButterfliesPackages = function (inputObj,_callback){
	var newButterflyPackage = new butterflyPackage(inputObj);
	var callback = _callback;
	newButterflyPackage.save(function (err,data) {
		if (err){console.log('error');
			console.log('error');
		}else{
			console.log('save package butterfly inside Mongo');
		}
		callback(err,data);
	});
	console.log('out');
};

WishMongo.prototype.updateButterfliesPackages = function (obj_input,callback){
	butterflyPackage.update(
		{_id: obj_input.id}, 
		{'packageButterfly': obj_input.package},
		function (err,obj_return) {
			callback(err, obj_return);
			console.log("Updated-Butterflies-Package");
		}
  	)
};	

WishMongo.prototype.findAllButterfliesPackages = function (callback){
	butterflyPackage.find({},function(err,butterflyPackages){
		callback(err,butterflyPackages);
	});
};

// WISHES methods

WishMongo.prototype.saveNewWish = function (wishObj,_callback){
	var newWish = new wishes(wishObj);
	var callback = _callback;
	newWish.save(function (err,data) {
		if (err){console.log('error');
			console.log('error');
		}else{
			console.log('save wish');
		}
		console.log(wishObj.microphoneID);
		console.log(data.id);
		callback(err,data.id,wishObj.microphoneID);
	});
	console.log('out');
};

WishMongo.prototype.findAll = function (callback){
	console.log('call findAll wishes');
	wishes.find({},function(err,wishes){
		callback(err,wishes);
	});
};

WishMongo.prototype.updateDataById = function (id,callback){
	console.log("findOne: "+id);
	wishes.findOne({_id: id},function(err,wish){
		callback(err,wish);
	});
};

WishMongo.prototype.updateText = function (obj_input,callback){
	console.log('call update text - '+obj_input.id);
	console.log(obj_input);

	wishes.update(
		{_id: obj_input.id}, 
		{'text': obj_input.text,'filterText': obj_input.filterText},
		function (err,obj_return) {
			callback(err, obj_return);
			console.log("updated-text");
		}
  	)
};

WishMongo.prototype.updateCloseAnalyze = function (obj_input,callback){
	console.log('call update analyze - '+obj_input.id)
	console.log(obj_input);

	wishes.update(
		{_id: obj_input.id}, 
		{'status': obj_input.status,'text': obj_input.text,'filterText': obj_input.filterText,'analyze': obj_input.analyze},
		function (err,obj_return) {
			callback(err,obj_return);
			console.log("updated-analyze");
		}
  	)
};

exports.WishMongo = WishMongo;