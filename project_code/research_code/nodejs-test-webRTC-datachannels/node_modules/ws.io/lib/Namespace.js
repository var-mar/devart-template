var Socket = require('./Socket'),
wss = require('ws').Server;

var Namespace = module.exports = function(server, manager, ns) {
	this.manager = manager;
	this.namespace = ns;
	this.manager.handlers[ns] = {};
	this.manager.namespaces[this.namespace] = {};
	this.manager.blobinfo[this.namespace] = {};
	this.rooms = {all:{}};
	this.wss = new wss({
		server: server,
		path: ns
	});
};

Namespace.prototype.on = function(conn, handler) {
	if(conn == 'connection') {
//---------------------
	var self = this;
	this.wss.on('connection', function(ws) {
		if(!!self.manager.namespaces[self.namespace]) {
			var id = Math.random()*10000 + '-' + new Date().getTime();
			var socket = self.createSocket(id, ws);
		} else {
			self.manager.log('namespace object not exists.');
			return;
		}
		ws.on('message', function(data, flags) {
			self.manager.log('message received by '+id);
			self.manager.log(data);
			if(typeof data === 'string') {
				var args = JSON.parse(data);
				var msg = true;
				var tmp = ['open', 'close', 'error', 'ping', 'pong'];
				tmp.forEach(function(n) {
					if(n===args.name) msg = false;
				});
				if(!msg) return;
				if(args.name==='blob') {
					if(!!self.manager.blobinfo[self.namespace]) {
						self.manager.blobinfo[self.namespace][id] = args.data;
					}
					return;
				}
				if(!!self.manager.handlers[self.namespace][id][args.name]) {
					self.manager.handlers[self.namespace][id][args.name].call(self, args.data);
					ev = null;
				} else {
					self.manager.log('no handler: ');
				}
			} else {
				if(!!self.manager.blobinfo[self.namespace][id]) {
					var name = self.manager.blobinfo[self.namespace][id].name;
					if(!!self.manager.handlers[self.namespace][id][name]) {
						var msg = self.manager.blobinfo[self.namespace][id];
						msg[msg.blobfield] = data;
						delete msg.blobfield;
						self.manager.handlers[self.namespace][id][name].call(self, msg);
						self.manager.blobinfo[self.namespace][id] = null;
					}
				}
			}
		});
		ws.on('open', function() {
			if(!!self.manager.handlers[self.namespace][id]['open']) {
				self.manager.handlers[self.namespace][id]['open'].call(self);
			}
		});
		ws.on('close', function(code, message) {
			if(!!self.manager.handlers[self.namespace][id]['close']) {
				self.manager.handlers[self.namespace][id]['close'].call(self, code, message);
			}
			delete self.manager.handlers[self.namespace][id];
			if(!!self.manager.store[id]) {
				delete self.manager.store[id];
			}
			if(!!self.manager.blobinfo[self.namespace][id]) {
				delete self.manager.blobinfo[self.namespace][id];
			}
			self.manager.namespaces[self.namespace].destroySocket(id);
		});
		ws.on('error', function(error) {
			if(!!self.manager.handlers[self.namespace][id]['error']) {
				self.manager.handlers[self.namespace][id]['error'].call(self, error);
			}
		});
		ws.on('ping', function(data, flags) {
			if(!!self.manager.handlers[self.namespace][id]['ping']) {
				self.manager.handlers[self.namespace][id]['ping'].call(self, data, flags);
			}
		});
		ws.on('pong', function(data, flags) {
			if(!!self.manager.handlers[self.namespace][id]['pong']) {
				self.manager.handlers[self.namespace][id]['pong'].call(self);
			}
		});
		handler.call(socket, socket);
	});
//---------------------	
	}
};

Namespace.prototype.createSocket = function(id, ws) {
	var socket = new Socket(this.manager, this, id, ws);
	if(!this.manager.handlers[this.namespace]) {
		this.manager.handlers[this.namespace] = {};
	}
	if(!this.manager.handlers[this.namespace][id]) {
		this.manager.handlers[this.namespace][id] = {};
	}
	if(!this.manager.blobinfo[this.namespace][id]) {
		this.manager.blobinfo[this.namespace][id] = null;
	}
	if(!this.rooms['all']) {
		this.rooms['all'] = {};
	}
	this.rooms['all'][id] = socket;
	return socket;
};

Namespace.prototype.destroySocket = function(id) {
	for(var i in this.rooms) {
		if(!!this.rooms[i][id]) {
			delete this.rooms[i][id];
		}
	}
	if(!!this.manager.handlers[this.namespace]) {
		if(!!this.manager.handlers[this.namespace][id]) {
			delete this.manager.handlers[this.namespace][id];
		}
	}
	if(!!this.manager.blobinfo[this.namespace]) {
		if(!!this.manager.blobinfo[this.namespace][id]) {
			delete this.manager.blobinfo[this.namespace][id];
		}
	}
};
