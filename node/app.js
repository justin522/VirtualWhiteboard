var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendfile('index.html');
});

io.on('connection', function(socket){
  socket.on('drawing',function(prevX,prevY,currX,currY)
	{
		console.log("prevx: "+ prevX+" prevy: "  + prevY + currX + currY);
		//We could do fancy database collection here and possibly add undo function
		io.emit("returnDraw",prevX,prevY,currX,currY);
	});
   
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
