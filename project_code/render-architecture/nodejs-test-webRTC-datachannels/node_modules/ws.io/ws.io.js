(function(window, undefined) {

var io = window.io = {
	connect: function(addr) {
		if(addr.indexOf('http')==0) addr = addr.replace('http','ws');
		return new Socket(new WebSocket(addr));
	}
};

function Socket(ws) {
	var handlers = {};
	var blobinfo = null;
	this.on = function(name, handler) {
		if(!!handlers[name]) {
			handlers[name].push(handler);
		} else {
			handlers[name] = [];
			handlers[name].push(handler);
		}
	};
	this.emit = function(name, data) {
		var isblob = false;
		for(var i in data) {
			if(checkBinary(data[i])) {
				isblob=true;
				var blob = data[i];
				delete data[i];
				data['name'] = name;
				data['blobfield'] = i;
				break;
			}
		}
		if(isblob) {
			var tosent = {name:'blob',data:data};
			ws.send(JSON.stringify(tosent));
			ws.send(blob);
		} else {
			ws.send(JSON.stringify({name:name,data:data}));
		}
	};
	ws.onmessage = function(msg) {
		switch(typeof msg.data) {
			case 'object':
				if(!!blobinfo) {
					if(!!handlers[blobinfo.name]) {
						var name = blobinfo.name;
						delete blobinfo.name;
						blobinfo[blobinfo.blobfield] = msg.data;
						delete blobinfo.blobfield;
						handlers[name].forEach(function(fn) {
							fn.call(this, blobinfo);
						});
					}
					blobinfo = null;
				}
				break;
			case 'string':
				if(!!msg.data) {
					var data = JSON.parse(msg.data);
					switch(data.name) {
						case 'blob':
							blobinfo = data.data;
							break;
						default:
							if(!!handlers[data.name]) {
								handlers[data.name].forEach(function(fn) {
									fn.call(this, data.data);
								});
							}
							break;
					}
				}
				break;
		}
	}
	function checkBinary(obj) {
		return (checkBlob(obj) || checkArrayBuffer(obj));
		function checkBlob(obj) {
			return (typeof obj==='object' && 
				!!obj.slice && typeof obj.slice==='function' && !obj.concat);
		}
		function checkArrayBuffer(obj) {
			return (typeof obj==='object' && !!obj.byteLength && obj.byteLength>0);
		}
	}
}

})(window);
