// Libraries
var express = require('express')
  , util = require('util')
  , passport = require('passport')
  , GoogleStrategy = require('passport-google-oauth').OAuth2Strategy
  , UserMongo = require('./db_objects').UserMongo
  , WishMongo = require('./db_objects').WishMongo
  , VisitorMongo = require('./db_objects').VisitorMongo
  , geoip = require('geoip') //https://github.com/kuno/GeoIP/
  , analyze = require('Sentimental').analyze
  , positivity = require('Sentimental').positivity
  , negativity = require('Sentimental').negativity
  , crypto = require('crypto')
  , fs = require("fs")
  , http = require("http")
  , nconf = require('nconf')
  , LanguageDetect = require('languagedetect')
  , MongoStore = require('connect-mongo')(express)
  //, user_role = require('connect-roles')
  ;

// Load config json file
nconf.file('./config.json');
console.log('server_port: ' + nconf.get('server_port'));
// Variable for https

// Certificates done at cheapssls.com for var-mar.info
var privateKey = fs.readFileSync(nconf.get('pathOfCertificate')+'server.key').toString();
var certificate = fs.readFileSync(nconf.get('pathOfCertificate')+'www_var-mar_info.crt').toString();
var certrequest = fs.readFileSync(nconf.get('pathOfCertificate')+'AddTrustExternalCARoot.crt').toString();

var options = {
  key: privateKey,
  cert: certificate,
  ca: certrequest
};

console.log('crypto done');

// API Access link for creating client ID and secret:
// https://code.google.com/apis/console/
var GOOGLE_CLIENT_ID = nconf.get('GOOGLE_CLIENT_ID');
var GOOGLE_CLIENT_SECRET = nconf.get('GOOGLE_CLIENT_SECRET');
var GOOGLE_refreshToken = "";

// Database objects
var wishDB = new WishMongo();
var userDB = new UserMongo();
var visitorDB = new VisitorMongo();
//var crypto = new cryptMethods();

var lngDetector = new LanguageDetect();

// geo IP
var City = geoip.City;
var city = new City(nconf.get('path_node_app')+'GeoLiteCity.dat');

// Create app 
var app = express.createServer(options);
// Configure Express
app.configure(function() {
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.logger());
  app.use(express.cookieParser());
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.session({ secret: nconf.get('sessionSecret') }));
  app.use(express.cookieParser());

  app.use(express.static(__dirname + '/public'));
  app.use(express.session({
    store: new MongoStore({
      url: nconf.get('url_mongo'),
      clear_interval:-1
    }),
    //cookie: { expires: new Date(Date.now() + 60 * 10000),maxAge: 60*10000 },
    secret: nconf.get('cookieParser')
  }));
  app.use(passport.initialize());
  app.use(passport.session());
  //app.use(user_role);
  app.use(app.router);

});
//

// parses json, x-www-form-urlencoded, and multipart/form-data
app.use(express.bodyParser());

// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.  However, since this example does not
//   have a database of user records, the complete Google profile is serialized
//   and deserialized.
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

// Use the GoogleStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and Google
//   profile), and invoke a callback with a user object.
passport.use(new GoogleStrategy({
      clientID: nconf.get('GoogleClientID')
    , clientSecret: nconf.get('GoogleClientSecret')
    , callbackURL: nconf.get('Google_callbackURL')
  },
  function(accessToken, refreshToken, params, profile, done) {
    
    // asynchronous verification, for effect...
    process.nextTick(function () {
      console.log("token:"+accessToken);
      console.log("profile.id:"+profile.id);
      console.log("params.expires_in:"+params.expires_in);
      GOOGLE_refreshToken = accessToken;

      userDB.save({
        token: accessToken
        , id: (profile.id).toString()
        , profile: profile
        , email: profile.emails[0].value
        , displayName: profile.displayName
        , expires: params.expires_in
        , hasCreditCookie: true
        , role:"guest"
      }, function( error, data) {
      });

      
      
        
        //req.sessions.role = emps[0].role;
      
            
      // To keep the example simple, the user's Google profile is returned to
      // represent the logged-in user.  In a typical application, you would want
      // to associate the Google account with a user record in your database,
      // and return that user instead.
      return done(null, profile);
    });
  }
));

// Since this is the last non-error-handling
// middleware use()d, we assume 404, as nothing else
// responded.

// $ curl http://localhost:3000/notfound
// $ curl http://localhost:3000/notfound -H "Accept: application/json"
// $ curl http://localhost:3000/notfound -H "Accept: text/plain"

app.use(function(req, res, next){
  res.status(404);

  // respond with html page
  if (req.accepts('html')) {
    res.render('404', { url: req.url, layout: false });
    return;
  }

  // respond with json
  if (req.accepts('json')) {
    res.send({ error: 'Not found' });
    return;
  }

  // default to plain-text. send()
  res.type('txt').send('Not found');
});
  
function getUserInfo(access_token, callback){
	var request = require('request');
	console.log('https://www.googleapis.com/oauth2/v2/userinfo?access_token=' + access_token);
	request('https://www.googleapis.com/oauth2/v2/userinfo?access_token=' + access_token, function(err, res, body) {
	  if (err) return callback(err);

	  if (res.statusCode != 200) {
	    return callback(new Error('Invalid access token: ' + body));
	  }
	  else {
	    var me;
	    try { me = JSON.parse(body);}
	    catch (e) {
	      return callback(new Error('Unable to parse user data: ' + e.toString()));
	    }
	    console.log('user profile:', me);
	  }
	});	
}

function requireRole(role) {
    return function(req, res, next) {
        if(req.session.user && req.session.user.role === role){
            next();
        }else{
            console.log("denied here >>"+req.session.user.role);
            res.render('403', { layout: false });
        }
    }
}

function getRole(req){
  var role = "guest";
  try{
    if(req.session.user.role!=undefined){
      console.log("req.session.user.role:"+req.session.user.role);
      role = req.session.user.role;
    }
  }catch(err){
  //Handle errors here
  }
  return role;
}

//
// URL methods

app.get('/',  function(req, res){
  console.log("req.isAuthenticated:"+req.isAuthenticated());
  console.log("req.user:"+JSON.stringify(req.user));
	res.render('index', { user: req.user, role: getRole(req) });
});
//

app.get('/account', ensureAuthenticated,  function(req, res){
  res.render('account', { user: req.user, role:getRole(req) });
});

app.get('/wish/stats', ensureAuthenticated,requireRole("admin"), function(req, res){
    res.render('wishStats', { user: req.user, role:getRole(req) });
});

app.get('/wish/list', ensureAuthenticated, requireRole("admin"), function(req, res){
    res.render('tableWish', { user: req.user, role:getRole(req) });
});

app.get('/wish/list/nonban', ensureAuthenticated, requireRole("admin"), function(req, res){
    res.render('tableNonBanWish', { user: req.user, role:getRole(req) });
});

app.get('/wish/list/ban', ensureAuthenticated, requireRole("admin"), function(req, res){
    res.render('tableBanWish', { user: req.user, role:getRole(req) });
});

app.get('/wish/list/json', ensureAuthenticated,requireRole("admin"), function(req, res){
  wishDB.findAll(function(error, emps){
	res.writeHead(200, {"Content-Type": "application/json"});
	res.end(JSON.stringify(emps));
  });
});

app.get('/wish/list/json/ban', ensureAuthenticated,requireRole("admin"), function(req, res){
  wishDB.findAllBan(function(error, emps){
  res.writeHead(200, {"Content-Type": "application/json"});
  res.end(JSON.stringify(emps));
  });
});

app.get('/wish/list/json/nonban', ensureAuthenticated,requireRole("admin"), function(req, res){
  wishDB.findAllNonBan(function(error, emps){
  res.writeHead(200, {"Content-Type": "application/json"});
  res.end(JSON.stringify(emps));
  });
});


// no using still
app.get('/wish/stats/json', ensureAuthenticated,requireRole("admin"), function(req, res){
  wishDB.findAll(function(error, emps){
	res.writeHead(200, {"Content-Type": "application/json"});
	res.end(JSON.stringify({"total_wishes":emps.length,"total_wishes_last_24":emps.length,"total_by_each_hours":emps.length}));
  });
});

app.post('/wish/ban', ensureAuthenticated,requireRole("admin"), function(req, res){
  console.log("called wish ban");
  wishDB.updateBanState({id: req.param('id'),ban:true}, function() {});
  res.writeHead(200, {"Content-Type": "application/json"});
});

app.post('/wish/unban', ensureAuthenticated,requireRole("admin"), function(req, res){
  console.log("called wish ban");
  wishDB.updateBanState({id: req.param('id'),ban:false}, function() {});
  res.writeHead(200, {"Content-Type": "application/json"});
});

//save new wish
app.get('/wish/send', ensureAuthenticated, function(req, res){
    res.render('sendWish_audio', { user: req.user, role:getRole(req) });
});

//save new wish
app.post('/wish/new', ensureAuthenticated, function(req, res){
    var ip = req.headers['x-forwarded-for'] || 
     req.connection.remoteAddress || 
     req.socket.remoteAddress ||
     req.connection.socket.remoteAddress;
    var city_obj = city.lookupSync(ip);
    var myDate = new Date();
    myDate.setHours(myDate.getHours() + 2);
    // Not save empty wishes
    if(req.param('txt')!=""){
      wishDB.save({
        text: req.param('txt'),
        user: req.user.emails[0].value,
        ip:ip,
        geoip:city_obj,
        ban:false,
        sentiment:analyze(req.param('txt')),
        time:myDate,
        user:req.user,
        language: lngDetector.detect(req.param('txt'))
      }, function( error, data) {
        res.redirect('/');
      });
    }
});

app.get('/users/admin', ensureAuthenticated,requireRole("admin"), function(req, res){
    res.render('users_admin', { user: req.user, role:getRole(req) });
});

// this data should be only admins
app.get('/users/list/json', ensureAuthenticated,requireRole("admin"), function(req, res){
  userDB.findAll(function(error, emps){
  res.writeHead(200, {"Content-Type": "application/json"});
  res.end(JSON.stringify(emps));
  });
});

// this data should be only admins
app.post('/user/newrole', ensureAuthenticated,requireRole("admin"), function(req, res){
  userDB.updateRole({role: req.param('role'),_id:req.param('_id')}, function() {});
  res.writeHead(200, {"Content-Type": "application/json"});
});

app.get('/login', function(req, res){
  res.render('login', { user: req.user });
});

// GET /auth/google
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in Google authentication will involve
//   redirecting the user to google.com.  After authorization, Google
//   will redirect the user back to this application at /auth/google/callback
app.get('/auth/google',
  passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/userinfo.profile',
                                            'https://www.googleapis.com/auth/userinfo.email'] }),
  function(req, res){
    // The request will be redirected to Google for authentication, so this
    // function will not be called.
  }
);

// GET /auth/google/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    console.log("User>");
    console.log(req.user);
    // Save roles from database
    userDB.findRole((req.user.id).toString(),function(error, emps){
      req.session.user = {'role':emps[0].role};
      res.redirect('/');
    });
  }
);

app.get('/logout', function(req, res){
  res.clearCookie('remember');
  req.logout();
  res.redirect('/');
});

// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.
function ensureAuthenticated(req, res, next) {
  
  if (req.isAuthenticated()) { 
    return next(); 
  }
  res.redirect('/login')
}

app.listen(nconf.get('server_port'));

//  websockets
var io = require('socket.io').listen(app);//, { log: false }
 count = 0;
 io.set('log level', 1);
  io.sockets.on('connection', function(socket) {
    count++;
    ip = socket.handshake.address.address;
    var city_obj = city.lookupSync(ip);
    var myDate = new Date();
    myDate.setHours(myDate.getHours() + 2);
    visitorDB.save({
        page: "home",
        ip:ip,
        geoip:city_obj,
        time:myDate,
    }, function( error, data) {
    });

    io.sockets.emit('count', {
      number: count
    });
    setInterval(function() {
      return io.sockets.emit('count', {
        number: count
      });
    }, 1200);
    return socket.on('disconnect', function() {
      count--;
      return io.sockets.emit('count', {
        number: count
      });
    });
  });