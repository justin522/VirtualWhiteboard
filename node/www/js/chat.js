//socket.emit('room','userName','roomName');
$.whiteboard.socket().on('message',function(m){
console.log("message" + m);
	var message = JSON.parse(m);
	var usr = message.user;
	switch(message.action){
		case "message":
			var msg = message.msg;
			console.log('got message: ' + msg);
			$("#chat-display").append("<span class='"+usr+"'>"+usr+": </span>"+msg+"<br />");
			break;
		case "link":
			var link = message.msg.url;
			var desc = message.msg.desc;
			var message=$("<span class='"+usr+"'>"+usr+": </span>posted a link: <a href='"+link+"' target='_blank'>"+desc+"</a><br />");
			$("#links").append("<a href='"+link+"' target='_blank'>"+desc+"</a><br />");
			$("#chat-display").append(message);
			break;
	}
});

$.whiteboard.socket().on('join',function(m){

	console.log("joined" + m);
	var message = JSON.parse(m);
	var usr = message.user;
	var msg = message.msg;
	var p=$("<span class='"+usr+"'>"+usr+": </span>"+msg+"<br />");
	$("#chat-display").append(p);
	$.whiteboard.addStyle("."+usr+"{color:rgb("+Math.floor(Math.random()*128)+","+Math.floor(Math.random()*128)+","+Math.floor(Math.random()*128)+");}");
	$('#users').append("<p id='"+usr+"' class='"+usr+"'>"+usr+"</p>");
});

$.whiteboard.socket().on('leave',function(m){
	var message = JSON.parse(m);
	var usr = message.user;
	$('#'+usr).remove();
});


$.whiteboard.socket().on('link',function(m){
	var message = JSON.parse(m);
	var usr = message.user;
	var link = message.link;
	var desc = message.desc;
	var p=$("<span class='"+usr+"'>"+usr+": </span>posted a link: <a href='"+link+"'>"+desc+"</a><br />").mousemove(function(e){
		e.preventDefault();
	});

	$("#chat-display").append(p);
});
