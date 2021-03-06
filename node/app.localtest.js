/**NEW**/
var express = require('express')
    , routes = require('./routes')
    , http = require('http')
    , path = require('path')
    , redis = require('socket.io-redis')	
    , session = require('express-session')
    , cookieParser = require('cookie-parser')
    , Client = require('node-rest-client').Client
    //, cors = require('cors');

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
//app.use(cors());
app.use(express.static(__dirname + '/www')); 


/*SOCKET DATA*/
//io.adapter(redis({host:'cs597-VirtualWhiteboardDB',port:6379}));
io.adapter(redis({host:'localhost',port:6379}));
io.sockets.on('connection',function(socket){
	clients[socket.id]=socket;
	socket.on('room',function(userName,room)
	{
		socket.join(room);
		console.log('socektid ' +socket.id);
	
		console.log(userName + " has joined " + room);
		args.data = room;
		// client.post("http://cs597-VirtualWhiteboardLB/whiteboard-api/room/create/"+room,args,function(data,response)
		// {
			// console.log(data);
			// if(data)
			// {
				// args.data = userName;
				// client.post("http://cs597-VirtualWhiteboardLB/whiteboard-api/users/create/"+userName,args,function(data2,response2)
				// {
					// console.log('user: '+ data2); 
					// if(data2)
					// {
						// client.get("http://cs597-VirtualWhiteboardLB/whiteboard-api/room/"+room,function(data3,response3)
						// {
							// console.log(data3);
							// for(var key in data3.chat)
							// {
								// console.log(key+ ": " +data3.chat[key].msg);
// var reply = JSON.stringify({action:'message',user:data3.chat[key].user,msg:data3.chat[key].msg});
								// //io.to(room).emit('message',reply);
// socket.emit('message',reply);
							// }
							// for(var obj in data3.whiteboard)
// {
	// var drawing =JSON.stringify({action:'draw',user:data3.whiteboard[obj].user,data:data3.whiteboard[obj].data})
// socket.emit('draw',drawing);
// }
						// });
						// //console.log(data);
					// }
				// });
			// }
		// });
		if(typeof drawinginstructions[room] !== 'undefined'){
			for (var key in drawinginstructions[room])
			{
				socket.emit('draw',drawinginstructions[room][key]);
			}
				 
		}
		if(room&&typeof drawinginstructions[room] == 'undefined')drawinginstructions[room] = [];
		if(typeof messages[room] !== 'undefined'){
			for (var key in messages[room])
			{
				socket.emit('message',messages[room][key]);
			}	
		}
		if(room&&typeof messages[room] == 'undefined')messages[room] = [];
		if(userName){
			var loginMessage = JSON.stringify({action:'join',user:userName,msg:userName+" has joined the room."});	
			args.data=loginMessage;
			// client.post("http://cs597-VirtualWhiteboardLB/whiteboard-api/room/updatechat/"+room+"/user/"+userName,args,function(data,response){
				// //console.log(data);
			// });
			 messages[room].push(loginMessage);
			io.to(room).emit('message',loginMessage);
			socket.username=userName;
			socket.room=room;
		}
	});
	socket.on('disconnect', function(){
		if(socket.username){
			console.log(socket.username+' has disconnected');
			var logoutMessage = JSON.stringify({action:'leave',user:socket.username,msg:socket.username+" has left the room."});
			args.data=logoutMessage;
			// client.post("http://cs597-VirtualWhiteboardLB/whiteboard-api/room/updatechat/"+socket.room+"/user/"+socket.username,args,function(data,response){
				// //console.log(data);
			// });
			messages[socket.room].push(logoutMessage);
			io.to(socket.room).emit('message',logoutMessage);
		}
	});
	socket.on("msg",function(usr,m){
		var reply = JSON.stringify({action:'message',user:usr,msg:m});
		args.data=reply;
		// client.post("http://cs597-VirtualWhiteboardLB/whiteboard-api/room/updatechat/"+socket.room+"/user/"+usr,args,function(data,response){
			// console.log('insert response: ' +data);
		// });
		messages[socket.room].push(reply);
		console.log('reply: '+  reply);
		io.to(socket.room).emit('message',reply);
	});
	socket.on("link",function(usr,m){
		var reply = JSON.stringify({action:'link',user:usr,msg:m});
		args.data=reply;
		// client.post("http://cs597-VirtualWhiteboardLB/whiteboard-api/room/updatechat/"+socket.room+"/user/"+usr,args,function(data,response){
			// console.log('insert response: ' +data);
		// });
		messages[socket.room].push(reply);
		console.log('reply: '+  reply);
		io.to(socket.room).emit('message',reply);
	});
	socket.on('drawing',function(data){
		var drawing = JSON.parse(data);
		var reply = JSON.stringify({action:'draw',user:drawing.user,data:drawing.data});
		args.data=reply;
		// client.post("http://cs597-VirtualWhiteboardLB/whiteboard-api/room/updateboard/"+socket.room+"/user/"+drawing.user,args,function(data,response){
			// console.log(data);
		// });
		drawinginstructions[socket.room].push(reply);
		io.to(socket.room).emit('draw',reply);
	});
	socket.on('water',function(x,y){io.to(socket.room).emit('water',socket.username,x,y);});
});

server.listen(3000, function(){
	console.log('listening on *:3000');
});

function autherized(usernname,token){
	//add real authentication
	return true;
}