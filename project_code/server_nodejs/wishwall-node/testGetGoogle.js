var request = require('request');

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