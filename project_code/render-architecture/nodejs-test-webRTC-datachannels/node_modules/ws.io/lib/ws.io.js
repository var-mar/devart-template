var server = require('http').createServer();
var Manager = require('./Manager');

exports.listen = function(arg) {
	if(typeof arg === 'number') {
		server.listen(arg);
		return new Manager(server);
	} else {
		return new Manager(arg);
	}
};