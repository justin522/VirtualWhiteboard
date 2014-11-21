socket.on("msg",function(usr,msg){
	$("#chat-display").append("<p><span class='uname'>"+usr+": </span>"+msg+"</p>");
});