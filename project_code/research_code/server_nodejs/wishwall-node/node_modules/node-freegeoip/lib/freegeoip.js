var request = require('request');

var serverUrl = "http://freegeoip.net/json/";

exports.setUrl = function(u) {
    serverUrl = u;
};

exports.getUrl = function() {
    return serverUrl;
};

exports.getLocation = function(ip, callback) {
    request.get({
        url: serverUrl + ip,
        json: true,
        timeout: 3000,
    }, function(err, r, loc) {
        if (err) {
            return callback(err);
        }
        if (r.statusCode != 200) {
            return callback("Likely throttled");
        }
        return callback(null, loc);
    });
};
