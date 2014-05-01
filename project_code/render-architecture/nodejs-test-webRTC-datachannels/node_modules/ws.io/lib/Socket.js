var Socket = module.exports = function(manager, namespace, id, ws) {
	this.id = id;
	this.manager = manager;
	this.ws = ws;
	this.namespace = namespace;
	this.flags = {"allnotme":false,"inroom":false,"to":false};
	if(!this.manager.handlers[this.namespace.namespace]) {
		this.manager.handlers[this.namespace.namespace] = {};
		this.manager.handlers[this.namespace.namespace][id] = {};
	}
};

Socket.prototype.on = function(name, handler) {
	this.manager.handlers[this.namespace.namespace][this.id][name] = handler;
};

Socket.prototype.emit = function(name, data, opt) {
	var room = '';
	if(!this.flags.inroom) {
		room = 'all';
	} else {
		room = this.flags.inroom;
	}
	var targets = [];
	if(this.flags['allnotme']) {
		for(var i in this.namespace.rooms[room]) {
			if(this.flags.allnotme) {
				if(i.indexOf(this.id)<0) {
					targets.push(this._findSocket(room, i));
				}
			} else {
				targets.push(this._findSocket(room, i));
			}
		}
	} else {
		targets.push(this);
	}
	if(this.flags['to']) {
		targets = [];
		targets.push(this._findSocket(room, this.flags['to']));
	}
	var self = this;
	//data['name'] = name;
	var isblob = false;
	for(var i in data) {
		if(checkBinary(data[i])) {
			var blob = data[i];
			delete data[i];
			data['name'] = name;
			data['blobfield'] = i;
			isblob = true;
			break;
		}
	}
	targets.forEach(function(socket) {
		socket.manager.log('message reply to '+socket.id);
		socket.manager.log(data);
		if(isblob) {
			socket.ws.send(JSON.stringify({name:'blob',data:data}));
			socket.ws.send(blob, {binary:true,mask:false});
		} else {
			socket.ws.send(JSON.stringify({name:name,data:data}));
		}
	});
	this.flags['allnotme'] = false;
	this.flags['inroom'] = false;
	this.flags['to'] = false;
};

Socket.prototype.__defineGetter__('broadcast', function() {
	this.flags['allnotme'] = true;
	return this;
});

Socket.prototype.to = function(id) {
	this.flags.allnotme = false;
	this.flags.inroom = false;
	this.flags.to = id;
	return this;
}

Socket.prototype._findSocket = function(room, id) {
	if(!!this.namespace.rooms[room]) {
		if(!!this.namespace.rooms[room][id]) {
			return this.namespace.rooms[room][id];
		}
	}
};

Socket.prototype.join = function(room) {
	if(!!this.namespace.rooms[room]) {
		this.namespace.rooms[room][this.id] = this;
	} else {
		this.namespace.rooms[room] = {};
		this.namespace.rooms[room][this.id] = this;
	}
};

Socket.prototype.joined = function(room) {
	return (!!this.namespace.rooms[room] && !!this.namespace.rooms[room][this.id]);
}

Socket.prototype.leave = function(room) {
	if(!!this.namespace.rooms[room]) {
		if(!!this.namespace.rooms[room][this.id]) {
			delete this.namespace.rooms[room][this.id];
		}
	}
	var i = 0;
	for(var a in this.namespace.rooms[room]) {
		i++
	}
	if(i===0) {
		delete this.namespace.rooms[room];
	}
}

Socket.prototype.in = function(room) {
	var check = false;
	if(!!this.namespace.rooms[room]) {
		if(!!this.namespace.rooms[room][this.id]) {
			check = true;
		}
	}
	if(check) {
		this.flags['inroom'] = room;
	}
	return this;
}

Socket.prototype.set = function(name, value, cb) {
	if(!this.manager.store[this.id]) {
		this.manager.store[this.id] = {};
	}
	this.manager.store[this.id][name] = value;
	cb();
};

Socket.prototype.get = function(name, cb) {
	if(!!this.manager.store[this.id]) {
		if(!!this.manager.store[this.id][name]) {
			cb(false, this.manager.store[this.id][name]);
		} else {
			cb(true);
		}
	} else {
		this.manager.store[this.id] = {};
		cb(true);
	}
};

Socket.prototype.has = function(name, cb) {
	if(!!this.manager.store[this.id]) {
		if(!!this.manager.store[this.id][name]) {
			cb(false, true);
		} else {
			cb(true, true);
		}
	} else {
		this.manager.store[this.id] = {};
		cb(true, false);
	}
};

function checkBinary(obj) {
	if(Buffer.isBuffer(obj)) {
		if(!!obj.copy) {
			return true;
		}
	}
	return false;
}