/**NEW**/
var express = require('express')
    , routes = require('./routes')
    , http = require('http')
    , path = require('path')
    //, redis = require('redis')
    , redis = require('socket.io-redis')	
    , session = require('express-session')
    , cookieParser = require('cookie-parser');

var drawinginstructions = {};
var clients = {};
var messages = {};

//var express = require('express');
var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);
//var http = require('http').Server(app);
//var io = require('socket.io')(http);
var log = {};
log.users = [];
log.messages = [];
log.drawings = [];
log.links = [];

/*var RedisStore = require('connect-redis')(session),
	rClient = redis.createClient(6379,'cs597-VirtualWhiteboardDB'),
	sessionStore = new RedisStore({client:rClient});*/
//app.set('port',process.env.PORT || 3000);
//app.set('views',__dirname + '/www');
//app.set('view engine','ejs');
app.use(cookieParser('your secret here'));
//app.use(session({store:sessionStore, key:'server', secret:'your secret here',resave:true,saveUninitialized:true}));


app.use(express.static(__dirname + '/www')); 
//var SessionSockets = require('session.socket.io');
//var sessionSockets = new SessionSockets(io, sessionStore, cookieParser, 'server');

/**NEW REDIS CLIENTS**/
//var sub = redis.createClient(6379,'cs597-VirtualWhiteboardDB');
//var pub = redis.createClient(6379,'cs597-VirtualWhiteboardDB');
var channel = "";
//sub.subscribe('msg');
//sub.subscribe('link');
//sub.subscribe('draw');

/*SOCKET DATA*/
io.adapter(redis({host:'cs597-VirtualWhiteboardDB',port:6379}));
io.sockets.on('connection',function(socket){
//sessionSockets.on('connection', function (err, socket, session) {
	clients[socket.id]=socket;
	
	console.log("log in");
   // if(!session.user) return;
	socket.on('room',function(userName,room){
	//sub.subscribe(room);

	socket.room = room;
	socket.join(room);
	//channel = room;
	console.log('socektid ' +socket.id);
	
	//socket.join(room);
	console.log(userName + " has joined this " + room); 
	
	if(typeof drawinginstructions[room] !== 'undefined'){
			drawinginstructions[room].foreach(function(intruction){
				//pub.publish(channel,instruction);			
			}); 
		}
	});
	/*sub.on('message',function (channel,message){
		console.log('socketid ' + socket.id + ' room ' +socket.room);
		console.log('channel '+ channel + "  " + 'msg '+message);
		io.sockets.in(channel).emit('message',message);
		//socket.send(message);
	});*/
	socket.on("message",function(usr,m){
		//console.log("user");
		var msg={};
		msg.usr=usr;
		msg.m=m;
		log.messages.push(msg);
		var reply = JSON.stringify({action:'message',user:usr,msg:m});
		io.emit("message",reply); //Now use pub.publish so all instances across servrs recieve
		
		//console.log('reply ', reply);
		console.log(channel);
		//pub.publish(channel,reply);
	});
	socket.on("link",function(usr,type,linkname,url){
		var link={};
		link.usr=usr;
		link.type=type;
		link.name=linkname;
		link.url=url;
		log.links.push(link);
		var reply = JSON.stringify({action:'link',user:usr,link:type+": <a href='"+url+"'>"+linkname+"</a>."})
		//io.emit("msg",usr,usr+" shared a"+type+": <a href='"+url+"'>"+linkname+"</a>.");
		pub.publish('msg',reply);
	});
	socket.on('draw',function(usr,type,layer,data){
				var room = socket.rooms[1];
		//console.log("prevx: "+ prevX+" prevy: "	+ prevY + currX + currY);
		//We could do fancy database collection here and possibly add undo function
		var draw = {};
		draw.usr = usr;
		draw.layer = layer;
		draw.data = data;
		if(!objectID){
			objectID="d"+"";
		}
		drawings[objectID]=draw;
		drawings.push(draw);
		//io.emit("draw",prevX,prevY,currX,currY);
		var reply = JSON.stringify({action:'draw',prevX:prevX,prevY:prevY,currX:currX,currY:currY,strokeColor:strokeColor,strokeWidth:strokeWidth})
		if(typeof drawinginstructions[room] == 'undefined'){
			drawinginstructions[room] = [];
		}
		drawinginstructions[room].push(reply);
		pub.publish('draw',reply);
	});

	/*sub.on('message', function (channel, message) {
		socket.emit(channel, message);
	});*/
});

server.listen(3000, function(){
	console.log('listening on *:3000');
});

function autherized(usernname,token){
	//add real authentication
	return true;
}
