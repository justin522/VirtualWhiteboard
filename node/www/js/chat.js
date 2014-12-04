//socket.emit('room','userName','roomName');
$.whiteboard.socket().on('message',function(m){
	var message = JSON.parse(m);
	var usr = message.user;
	switch(message.msg.type){
		case "message":
			var msg = message.msg.data;
			$("#chat-display").append("<p><span class='"+usr+"'>"+usr+": </span>"+msg+"</p>");
			break;
		case "link":
			var link = message.msg.url;
			var desc = message.msg.desc;
			var message=$("<p><span class='"+usr+"'>"+usr+": </span>posted a link: <a href='"+link+" target='_blank'>"+desc+"</a></p>");
			$("#links").append("<a href='"+link+" target='_blank'>"+desc+"</a>");
			$("#chat-display").append(message);
			break;
	}
});

$.whiteboard.socket().on('join',function(m){
	var message = JSON.parse(m);
	var usr = message.user;
	var msg = message.msg;
	$("#chat-display").append("<p><span class='"+usr+"'>"+usr+": </span>"+msg+"</p>");
	$.whiteboard.addStyle("."+usr+"{color:rgb("+Math.floor(Math.random()*128)+","+Math.floor(Math.random()*128)+","+Math.floor(Math.random()*128)+");}");
	$('#users').append("<p id='"+usr+"' class='"+usr+"'>"+usr+"</p>");
});

$.whiteboard.socket().on('leave',function(m){
	var message = JSON.parse(m);
	var usr = message.user;
});


$.whiteboard.socket().on('link',function(m){
	var message = JSON.parse(m);
	var usr = message.user;
	var link = message.link;
	var desc = message.desc;
	$("#chat-display").append("<p><span class='"+usr+"'>"+usr+": </span>posted a link: <a href='"+link+"'>"+desc+"</a>");
});
