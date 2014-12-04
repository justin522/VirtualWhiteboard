//socket.emit('room','userName','roomName');
$.whiteboard.socket().on('message',function(m){
	//alert(mess);
	var message = JSON.parse(m);
	var usr = message.user;
	var msg = message.msg;
	$("#chat-display").append("<p><span class='"+usr+"'>"+usr+": </span>"+msg+"</p>");
});

$.whiteboard.socket().on('join',function(m){
	//alert(mess);
	var message = JSON.parse(m);
	var usr = message.user;
	var msg = message.msg;
	$("#chat-display").append("<p><span class='"+usr+"'>"+usr+": </span>"+msg+"</p>");
	$.whiteboard.addStyle("."+usr+"{color:rgb("+Math.floor(Math.random()*128)+","+Math.floor(Math.random()*128)+","+Math.floor(Math.random()*128)+");}");
	$('#users').append("<p id='"+usr+"' class='"+usr+"'>"+usr+"</p>");
});

$.whiteboard.socket().on('leave',function(m){
	//alert(mess);
	var message = JSON.parse(m);
	var usr = message.user;
	var msg = message.msg;
	$("#chat-display").append("<p><span class='"+usr+"'>"+usr+": </span>"+msg+"</p>");
});


$.whiteboard.socket().on('link',function(m){
	var message = JSON.parse(m);
	var usr = message.user;
	var link = message.user;
	var desc = message.user;
	$("#chat-display").append("<p><span class='"+usr+"'>"+usr+": </span>posted a link: <a href='"+link+"'>"+desc+"</a>");
});
