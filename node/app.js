var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var log = {};
log.users = [];
log.messages = [];
log.drawings = [];
log.links = [];

app.use(express.static(__dirname + '/www')); //commment out this line and uncomment the next 3 for the origional implementation 
// app.get('/', function(req, res){
	// res.sendFile('index.html');
// });

io.on('connection', function(socket){
	socket.on('drawing',function(prevX,prevY,currX,currY){
		console.log("prevx: "+ prevX+" prevy: "	+ prevY + currX + currY);
		//We could do fancy database collection here and possibly add undo function
		io.emit("returnDraw",prevX,prevY,currX,currY);
	});
	socket.on("msg",function(usr,m){
		var msg={};
		msg.usr=usr;
		msg.m=m;
		log.messages.push(msg);
		io.emit("msg",usr,m);
	});
	socket.on("link",function(usr,type,linkname,url){
		var link={};
		link.usr=usr;
		link.type=type;
		link.name=linkname;
		link.url=url;
		log.links.push(link);
		io.emit("msg",usr,usr+" shared a"+type+": <a href='"+url+"'>"+linkname+"</a>.");
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
		io.emit("draw",prevX,prevY,currX,currY);
	});
});

http.listen(3000, function(){
	console.log('listening on *:3000');
});

function autherized(usernname,token){
	//add real authentication
	return true;
}
