//socket.emit('room','userName','roomName');
$.whiteboard.socket().on('message',function(m){
	var message = JSON.parse(m);
	var usr = message.user;
	switch(message.action){
		case "message":
			var msg = message.msg.data;
			$("#chat-display").append("<span class='"+usr+"'>"+usr+": </span>"+msg+"<br />");
			break;
		case "link":
			var link = message.msg.url;
			var desc = message.msg.desc;
			var message=$("<span class='"+usr+"'>"+usr+": </span>posted a link: <a href='"+link+"' target='_blank'>"+desc+"</a><br />");
			$("#links").append("<a href='"+link+"' target='_blank'>"+desc+"</a><br />");
			$("#chat-display").append(message);
			break;
		case "join":
			var usr = message.user;
			var msg = message.msg;
			var p=$("<span class='"+usr+"'>"+usr+": </span>"+msg+"<br />");
			$("#chat-display").append(p);
			$.whiteboard.addStyle("."+usr+"{color:rgb("+Math.floor(Math.random()*128)+","+Math.floor(Math.random()*128)+","+Math.floor(Math.random()*128)+");}");
			$('#users').append("<p id='"+usr+"' class='"+usr+"'>"+usr+"</p>");
			break;
		case "leave":
			var usr = message.user;
			var msg = message.msg;
			var p=$("<span class='"+usr+"'>"+usr+": </span>"+msg+"<br />");
			$("#chat-display").append(p);
			$.whiteboard.addStyle("."+usr+"{color:rgb("+Math.floor(Math.random()*128)+","+Math.floor(Math.random()*128)+","+Math.floor(Math.random()*128)+");}");
			$('#'+usr).remove();
			break;
	}
});