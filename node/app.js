/**NEW**/
var express = require('express')
    , routes = require('./routes')
    , http = require('http')
    , path = require('path')
    , redis = require('socket.io-redis')	
    , session = require('express-session')
    , cookieParser = require('cookie-parser')
    , Client = require('node-rest-client').Client;

client = new Client();
var drawinginstructions = {};
var clients = {};
var messages = {};

var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);
var args = {
headers:{"Content-Type":"application/json"}
};
var log = {};
log.users = [];
log.messages = [];
log.drawings = [];
log.links = [];

app.use(express.static(__dirname + '/www')); 


/*SOCKET DATA*/
io.adapter(redis({host:'cs597-VirtualWhiteboardDB',port:6379}));
//io.adapter(redis({host:'localhost',port:6379}));
io.sockets.on('connection',function(socket){
	clients[socket.id]=socket;	
	console.log("log in");

	socket.on('room',function(userName,room){
	socket.join(room);
	console.log('socektid ' +socket.id);

	console.log(userName + " has joined " + room); 
	client.get("http://cs597-VirtualWhiteboardLB/whiteboard-api/room/getrooms",function(data,response)
		{
			console.log(data);
		});
	client.get("http://cs597-VirtualWhiteboardLB/whiteboard-api/room/"+room,function(data,response)
		{
			console.log(data);
		});
		/*if(typeof drawinginstructions[room] !== 'undefined'){
			for (var key in drawinginstructions[room])
			{
				socket.emit('draw',drawinginstructions[room][key]);
			}
				 
		}
		if(typeof messages[room] !== 'undefined'){
			for (var key in messages[room])
			{
				socket.emit('message',messages[room][key]);
			}	
		}*/
	});
	socket.on("msg",function(usr,m){
		var room = socket.rooms[1];
		//console.log("user");
		var msg={};
		msg.usr=usr;
		msg.m=m;
		log.messages.push(msg);
		var reply = JSON.stringify({action:'message',user:usr,msg:m});
		if(typeof messages[room] == 'undefined'){
			messages[room] = [];
		}
		client.post("http://cs597-VirtualWhiteboardLB/whiteboard-api/room/updateboard/"+room+"/user/"+usr,args,function(data,response){
			console.log(data);
		});
		//messages[room].push(reply);
			//console.log('room: ' + room + ' instruct ' + reply);
		io.to(room).emit('message',reply);
		//console.log('room '+ room + ' reply ', reply);
	});
	socket.on('drawing',function(data){
		var drawing = JSON.parse(data);
		var room = socket.rooms[1];
		//var reply = JSON.stringify({action:'draw',user:drawing.user,type:drawing.type,layer:drawing.layer,prevX:drawing.prevX,prevY:drawing.prevY,currX:drawing.currX,currY:drawing.currY,strokeColor:drawing.strokeColor,strokeWidth:drawing.strokeWidth});
		var reply = JSON.stringify({action:'draw',user:drawing.user,data:drawing.data});
		if(typeof drawinginstructions[room] == 'undefined'){
			drawinginstructions[room] = [];
		}
		drawinginstructions[room].push(reply);
			console.log('room: ' + room + ' instruct ' + reply);
		io.to(room).emit('draw',reply);
		//pub.publish('draw',reply);
	});
});

server.listen(3000, function(){
	console.log('listening on *:3000');
});

function autherized(usernname,token){
	//add real authentication
	return true;
}
