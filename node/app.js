/**NEW**/
var express = require('express')
    , routes = require('./routes')
    , http = require('http')
    , path = require('path')
    , redis = require('redis')
    , session = require('express-session')
    , cookieParser = require('cookie-parser');





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

/**NEW**/
//io.on('connection',function(socket){
	//console.log('wrong logged in');
//});
var RedisStore = require('connect-redis')(session),
	rClient = redis.createClient(6379,'cs597-VirtualWhiteboardDB'),
	sessionStore = new RedisStore({client:rClient});

//app.set('port',process.env.PORT || 3000);
//app.set('views',__dirname + '/www');
//app.set('view engine','ejs');
app.use(cookieParser('your secret here'));
app.use(session({store:sessionStore, key:'server', secret:'your secret here',resave:true,saveUninitialized:true}));

//app.get('/',routes.index);

app.use(express.static(__dirname + '/www')); 
var SessionSockets = require('session.socket.io');
var sessionSockets = new SessionSockets(io, sessionStore, cookieParser, 'server');
//console.log('io ',io);
//console.log('cookie ', cookieParser);

/**NEW REDIS CLIENTS**/
var sub = redis.createClient(6379,'cs597-VirtualWhiteboardDB');
var pub = redis.createClient(6379,'cs597-VirtualWhiteboardDB');
sub.subscribe('msg');

/*app.get('/',function(req,res){
	console.log('im here');
	req.session.foo = req.session.foo || 'bar';
});*/
/*SOCKET DATA*/
io.on('connection',function(socket){
//sessionSockets.on('connection', function (err, socket, session) {
	console.log("log in");
   // if(!session.user) return;
	socket.on("msg",function(usr,m){
		//console.log("user");
		var msg={};
		msg.usr=usr;
		msg.m=m;
		log.messages.push(msg);
		//io.emit("msg",usr,m); Now use pub.publish so all instances across servrs recieve
		var reply = JSON.stringify({action:'message',user:usr,msg:m});
		console.log(reply);
		pub.publish('msg',reply);
	});
	socket.on("link",function(usr,type,linkname,url){
		var link={};
		link.usr=usr;
		link.type=type;
		link.name=linkname;
		link.url=url;
		log.links.push(link);
		//io.emit("msg",usr,usr+" shared a"+type+": <a href='"+url+"'>"+linkname+"</a>.");
		pub.publish('msg',usr,usr+" shared a"+type+": <a href='"+url+"'>"+linkname+"</a>.");
	});
	socket.on('draw',function(usr,type,layer,data){
		console.log("prevx: "+ prevX+" prevy: "	+ prevY + currX + currY);
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
		pub.publish('draw',prevX,prevY,currX,currY);
	});

	sub.on('message', function (channel, message) {
		socket.emit(channel, message);
	});
});

server.listen(3000, function(){
	console.log('listening on *:3000');
});

function autherized(usernname,token){
	//add real authentication
	return true;
}
