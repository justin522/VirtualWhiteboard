//socket.emit('room','userName','roomName');
socket.on('message',function(mess){
	//alert(mess);
	var message = JSON.parse(mess);
	var usr = message.user;
	var msg = message.msg;
	//alert('user ' + usr + ' mssg ' + msg);
	$("#chat-display").append("<p><span class='uname'>"+usr+": </span>"+msg+"</p>");
});
