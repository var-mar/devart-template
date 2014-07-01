var debug = false;
var ipServer = debug ? "127.0.0.1" : "192.168.15.112";
var ipForUDPListen = [
	{ip:debug ? "127.0.0.1" : "192.168.15.112",'port':3007}, // cocoon
	{ip:debug ? "127.0.0.1" : "192.168.15.111",'port':3008}, // flocking
	{ip:debug ? "127.0.0.1" : "192.168.15.111",'port':3009}, // flocking
	{ip:debug ? "127.0.0.1" : "192.168.15.112",'port':3011}  // server 
];

// show in html if is debug acticated
document.getElementById("debugFlag").innerHTML = debug ? "True":"False";

for(var i=0; i<ipForUDPListen.length;i++){
	document.getElementById("ips").innerHTML += ipForUDPListen[i].ip.toString()+":"+ipForUDPListen[i].port.toString()+"<br>" ;
}

var linesBlendingYAr = [ 200 , 550];