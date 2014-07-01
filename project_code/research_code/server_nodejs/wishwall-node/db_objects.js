var mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/wishwall');

var userSchema = new mongoose.Schema({
  email: String
, displayName: String
, token: String
, id:String
, profile: Object
, expires: Number
, hasCreditCookie: Boolean
, role:String
});

var wishSchema = new mongoose.Schema({
  text: String
, city: String
, lang: String
, active: Boolean
, ban: Boolean
, ip:String
, geoip:Object
, time: { type : Date, default: Date.now }
, sentiment:Object
, user:Object
, language:Object
});

var visitorSchema = new mongoose.Schema({
  page: String
, ip:String
, geoip:Object
, time: { type : Date, default: Date.now }
});

var users = mongoose.model('users_register', userSchema);
var wishes = mongoose.model('wishes', wishSchema);
var visitors = mongoose.model('visitors', visitorSchema);

// -----------------------------------------------------------------------------------------------
// WISHES
// -----------------------------------------------------------------------------------------------

function WishMongo(){
	
}

WishMongo.prototype.save = function (wishObj,callback){
	var newWish = new wishes(wishObj);
	newWish.save(function (err,data) {
		if (err){console.log('error');
			console.log('error');
		}else{
			console.log('save wish');
		}
		callback(err,data.id);
	});
	console.log('out');
}

WishMongo.prototype.findAll = function (callback){
	console.log('call findAll wishes');
	wishes.find({},function(err,wishes){
		callback(err,wishes);
	});
}

WishMongo.prototype.findAllNonBan = function (callback){
	wishes.find().sort({_id:'desc'}).find({"ban":false},function(err,wishes){
		callback(err,wishes);
	});
}

WishMongo.prototype.findAllBan = function (callback){
	//'date:1'
	wishes.find().sort({_id:'desc'}).find({"ban":true},function(err,wishes){
		callback(err,wishes);
	});
}

WishMongo.prototype.updateBanState = function (wish,callback){
	console.log('call update - '+wish.id);
	
	wishes.update(
		{_id: wish.id}, 
		{'ban': wish.ban},
		function () {
		}
  	)
}

// -----------------------------------------------------------------------------------------------
// USERS
// -----------------------------------------------------------------------------------------------

function UserMongo(){
	
}

UserMongo.prototype.save = function (userObj,callback){
	console.log("id:"+userObj.id);
	users.find({'id':userObj.id},function (err,docs) { 
		if(docs.length==0){ 
			var newUser = new users(userObj);
			newUser.save(function (errSave) {
				if (err){
					console.log('error');
				}else{
					console.log('save new user');
				}
			});
		}else{
			console.log("Already save it user!");
		}
		console.log(docs);
		callback(err);
	});
}

UserMongo.prototype.findAll = function (callback){
	users.find({},function(err,users){
		callback(err,users);
	});
}

UserMongo.prototype.findRole = function (userid,callback){
	users.find({id:userid},function(err,users){
		callback(err,users);
	});
}

UserMongo.prototype.updateRole = function (user,callback){
	users.update(
		{_id: user._id}, 
		{'role': user.role},
		function () {
		}
  	)
}





// -----------------------------------------------------------------------------------------------
// VISITORS
// -----------------------------------------------------------------------------------------------

function VisitorMongo(){
	
}

VisitorMongo.prototype.save = function (visitorObj,callback){
	var newVisitor = new visitors(visitorObj);
	
	newVisitor.save(function (err) {
		if (err){
			console.log('error');
			
		}else{
			console.log('save new visitor');
		}
		callback(err);
	});
}

VisitorMongo.prototype.findAll = function (callback){
	visitor.find({},function(err,visitors){
		callback(err,visitors);
	});
}

// -----------------------------------------------------------------------------------------------

exports.UserMongo = UserMongo;
exports.WishMongo = WishMongo;
exports.VisitorMongo = VisitorMongo;