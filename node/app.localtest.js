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
	data:"",
	headers:{"Content-Type":"application/json"}
};
var log = {};
log.users = [];
log.messages = [];
log.drawings = [];
log.links = [];

app.use(express.static(__dirname + '/www')); 


/*SOCKET DATA*/
//io.adapter(redis({host:'cs597-VirtualWhiteboardDB',port:6379}));
io.adapter(redis({host:'localhost',port:6379}));
io.sockets.on('connection',function(socket){
	clients[socket.id]=socket;
	socket.on('room',function(userName,room){
		socket.join(room);
		console.log('socektid ' +socket.id);
	
		console.log(userName + " has joined " + room);
		// client.get("http://cs597-VirtualWhiteboardLB/whiteboard-api/room/"+room,function(data,response){
			// console.log(data);
			// //Parse data to get drawing instructions and chat messages then uncomment lines below to send to client
			// var drawReply = data.data;
			// io.to(room).emit('draw',reply);
			// var drawReply = data.data;
			// io.to(room).emit('message',reply);
		// });
		if(typeof drawinginstructions[room] !== 'undefined'){
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
		}else if(room)messages[room] = [];
		if(userName){
			var loginMessage = JSON.stringify({action:'join',user:userName,msg:userName+" has joined the room."});	
			// args.data=loginMessage;
			// client.post("http://cs597-VirtualWhiteboardLB/whiteboard-api/room/updatechat/"+room+"/user/"+usr,args,function(data,response){
				// console.log(data);
			// });
			messages[room].push(loginMessage);
			io.to(room).emit('join',loginMessage);
			socket.username=userName;
			socket.room=room;
		}
	});
	socket.on('disconnect', function(){
		if(socket.username){
			console.log(socket.username+' has disconnected');
			var logoutMessage = JSON.stringify({action:'leave',user:socket.username,msg:socket.username+" has left the room."});
			// args.data=logoutMessage;
			// client.post("http://cs597-VirtualWhiteboardLB/whiteboard-api/room/updatechat/"+socket.room+"/user/"+usr,args,function(data,response){
				// console.log(data);
			// });
			messages[socket.room].push(logoutMessage);
			io.to(socket.room).emit('join',logoutMessage);
		}
	});
	socket.on("msg",function(usr,m){
		var msg={};
		msg.usr=usr;
		msg.m=m;
		log.messages.push(msg);
		var reply = JSON.stringify({action:'message',user:usr,msg:m});
		if(typeof messages[socket.room] == 'undefined'){
			messages[socket.room] = [];
		}
		// args.data=reply;
		// client.post("http://cs597-VirtualWhiteboardLB/whiteboard-api/room/updatechat/"+socket.room+"/user/"+usr,args,function(data,response){
			// console.log(data);
		// });
		messages[socket.room].push(reply);
		io.to(socket.room).emit('message',reply);
	});
	socket.on('drawing',function(data){
		var drawing = JSON.parse(data);
		var reply = JSON.stringify({action:'draw',user:drawing.user,data:drawing.data});
		if(typeof drawinginstructions[socket.room] == 'undefined'){
			drawinginstructions[socket.room] = [];
		}
		// args.data=reply;
		// client.post("http://cs597-VirtualWhiteboardLB/whiteboard-api/room/updateboard/"+socket.room+"/user/"+usr,args,function(data,response){
			// console.log(data);
		// });
		drawinginstructions[socket.room].push(reply);
		io.to(socket.room).emit('draw',reply);
	});
});

server.listen(3000, function(){
	console.log('listening on *:3000');
});

function autherized(usernname,token){
	//add real authentication
	return true;
}