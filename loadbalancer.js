//http://goldfirestudios.com/blog/136/Horizontally-Scaling-Node.js-and-WebSockets-with-Redis
var http = require('http');
var proxy = require('http-proxy');
//var request = require('request');
 
http.globalAgent.maxSockets = 10240;
 
// Define the servers to load balance.
var servers = [
{host: 'cs597-VirtualWhiteboardNodeOne', port: 3000},
{host: 'cs597-VirtualWhiteboardNodeTwo', port: 3000}
];
var failoverTimer = [];
 

// Create a proxy object for each target.
var proxies = servers.map(function (target) 
{
	return new proxy.createProxyServer({
	target: target//,
	//ws: true
	});
});
 
/**
* Select a random server to proxy to. If a 'server' cookie is set, use that
* as the sticky session so the user stays on the same server (good for ws fallbacks).
* @param {Object} req HTTP request data
* @param {Object} res HTTP response
* @return {Number} Index of the proxy to use.
*/
var selectServer = function(req, res) {
var index = -1;
var i = 0;
 
// Check if there are any cookies.
if (req.headers && req.headers.cookie && req.headers.cookie.length > 1) 
{
	var cookies = req.headers.cookie.split('; ');
	 
	for (i=0; i<cookies.length; i++) 
	{
		if (cookies[i].indexOf('server=') === 0) 
		{
			var value = cookies[i].substring(7, cookies[i].length);
			if (value && value !== '') {
			index = value;
			break;
			}
		}
	}
}
 
// Select a random server if they don't have a sticky session.
if (index < 0 || !proxies[index]) {
index = Math.floor(Math.random() * proxies.length);
}
 
// If the selected server is down, select one that isn't down.
if (proxies[index].options.down) 
{
	index = -1;
	 
	var tries = 0;
	while (tries < 5 && index < 0) {
	var randIndex = Math.floor(Math.random() * proxies.length);
	if (!proxies[randIndex].options.down) {
	index = randIndex;
	}
	 
	tries++;
	}
}
 
index = index >= 0 ? index : 0;
 
// Store the server index as a sticky session.
if (res) {
res.setHeader('Set-Cookie', 'server=' + index + '; path=/');
}
 
return index;
};

var server = http.createServer(function(req,res)
{
	var proxyIndex = selectServer(req, res);
	var proxy = proxies[proxyIndex];
	//console.log('blancing request to: ',proxy);
	proxy.web(req, res);
	proxy.on('error', function(err) 
	{
		Console.log('proxy error',err); 
	});
server.on('error',function(err){
	Console.log('server error');
})
});
 
// Get the next server and send the upgrade request.
server.on('upgrade', function(req, socket, head) 
{
	var proxyIndex = selectServer(req);
	var proxy = proxies[proxyIndex];
	proxy.ws(req, socket, head);
	 
	proxy.on('error', function(err, req, socket) 
	{
	console.log(err);
		socket.end();
	//startFailoverTimer(proxyIndex);
	});
});
server.listen(8001);
