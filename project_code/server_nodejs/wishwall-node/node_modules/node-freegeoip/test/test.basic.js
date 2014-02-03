var assert = require('assert');
var freegeoip = require('../lib/freegeoip.js');

suite('Basic', function() {
    test('fetch localhost', function(done) {
        var ip = '127.0.0.1';
        freegeoip.getLocation(ip, function(err, location) {
            assert(err == null, "Error " + err);
            assert(location.ip === ip, "Wrong ip received");
            done();
        });
    });

    test('fetch invalid', function(done) {
        var ip = '127.';
        freegeoip.getLocation(ip, function(err, location) {
            assert(err != null, "We were expecting an error");
            done();
        });
    });

    test('set server', function(done) {
        var testUrl = "http://meh";
        freegeoip.setUrl(testUrl);
        assert(freegeoip.getUrl() === testUrl, "Return invalid url");
        done();
    });

});
