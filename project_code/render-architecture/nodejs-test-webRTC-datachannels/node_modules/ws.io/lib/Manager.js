var fs = require('fs'),
url = require('url'),
Namespace = require('./Namespace');

var Manager = module.exports = function(server) {
	this.server = server;
	this.namespaces = {};
	this.store = {};
	this.handlers = {};
	this.blobinfo = {};
	this.clientjs = '';
	var self = this;
	fs.readFile(__dirname+'/../ws.io.js', function(error, data) {
		if(!error) {
			self.clientjs = data.toString('utf8');
		} else {
			this.log('read file error.');
		}
	});
	this.oldHandlers = server.listeners('request').splice(0);
	this.server.removeAllListeners('request');
	this.server.on('request', function(req, res) {
		self.log(req.method);
		self._handleRequest(req, res);
	});
	this.configs = {
		production: false
	};
};

Manager.prototype.of = function(ns) {
	var namespace = new Namespace(this.server, this, ns);
	this.namespaces[ns] = namespace;
	return namespace;
};

Manager.prototype.__defineGetter__('sockets', function() {
	return this.of('/');
});

Manager.prototype._handleRequest = function(req, res) {
	var resource = url.parse(req.url).pathname;
	this.log('request to '+resource);
	if(resource === '/ws.io/ws.io.js' && this.clientjs.length>0) {
		res.setHeader('Content-Type', 'text/javascript');
		res.writeHead(200);
		res.end(this.clientjs);
	} else {
		for(var i=0; i<this.oldHandlers.length; i++) {
			this.oldHandlers[i].call(this.server, req, res);
		}
	}
};

Manager.prototype.config = function(config) {
	for(var i in config) {
		if(config.hasOwnProperty(i)) {
			this.configs[i] = config[i]; 
		}
	}
}

Manager.prototype.log = function(msg) {
	if(!this.configs.production) {
		console.log(msg);
	}
}