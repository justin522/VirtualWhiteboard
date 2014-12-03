var roomName = "";
var host = window.location.host.split(':')[0];
var socket = io.connect('http://'+host);
var userName;
$(document).ready(function(){
//alert(socket);
	$("#post-chat").click(function(){
		var msg = {type:'message',msg:$('#chat-input').val()};
		//socket.json.send(msg);
		socket.emit('msg',$('#input-usr').val(), $('#chat-input').val());
		//alert("hey");
		$('#chat-input').val('');
	});
	$("#fillcolor").spectrum({
		showAlpha: true,
		allowEmpty:true,
		showInitial: true,
		appendTo:"#color-tools",
		change: function(color) {
			if(!color){
				fillColor = "white";
				$("#sample").attr("fill","none");
			}
			else{
				fillColor = color.toRgbString();
				$("#sample").attr("fill",color.toRgbString());
			}
		}
	});
	$("#linecolor").spectrum({
		color: "#000",
		showAlpha: true,
		allowEmpty:true,
		showInitial: true,
		appendTo:"#color-tools",
		change: function(color) {
			if(!color){
				strokeColor = "white";
				$("#sample").attr("stroke","none");
			}
			else{
				strokeColor = color.toRgbString();
				$("#sample").attr("stroke",color.toRgbString());
			}
		}
	});
	$('.number').keypress(function (event) {
		if ((event.which != 46 || $(this).val().indexOf('.') != -1) && (event.which < 48 || event.which > 57)) {
			event.preventDefault();
		}
		if(event.which == 13)$(this).change();
		var text = $(this).val();
		if ((text.indexOf('.') != -1) && (text.substring(text.indexOf('.')).length > 2)) {
			event.preventDefault();
		}
	});
	$("#linesize").change(function(){
		strokeWidth = $(this).val();
		$("#sample").attr("stroke-width",$(this).val());
	});
	$("#tabs").tabs();
	$("#whiteboard").tabs();
	$("#drawing-tools>input").click(function(){
		if(!$(this).is(":checked")){
			$(this).prop('checked',true).button( "refresh" );
		}else $(this).siblings(":checked").removeAttr('checked').button( "refresh" );
	});
	$( "#freehand" ).button({
		text: false,
		icons: {
			primary: "draw-icon-free"
		}
	});
	$( "#path" ).button({
		text: false,
		icons: {
			primary: "draw-icon-path"
		},
		disabled: true
	});
	$( "#polyline" ).button({
		text: false,
		icons: {
			primary: "draw-icon-pline"
		},
		disabled: true
	});
	$( "#line" ).button({
		text: false,
		icons: {
			primary: "draw-icon-line"
		},
		disabled: true
	});
	$( "#rectangle" ).button({
		text: false,
		icons: {
			primary: "draw-icon-rect"
		},
		disabled: true
	});
	$( "#circle" ).button({
		text: false,
		icons: {
			primary: "draw-icon-circle"
		},
		disabled: true
	});
	$( "#oval" ).button({
		text: false,
		icons: {
			primary: "draw-icon-oval"
		},
		disabled: true
	});
	$( "#erase" ).button({
		text: false,
		icons: {
			primary: "draw-icon-erase"
		},
		disabled: true
	});
	$( "#select" ).button({
		text: false,
		icons: {
			primary: "draw-icon-select"
		},
		disabled: true
	});
	$( "#move" ).button({
		text: false,
		icons: {
			primary: "draw-icon-move"
		},
		disabled: true
	});
	$( "#rotate" ).button({
		text: false,
		icons: {
			primary: "draw-icon-rotate"
		},
		disabled: true
	});
	$( "#text" ).button({
		text: false,
		icons: {
			primary: "draw-icon-text"
		},
		disabled: true
	});
	$( "#image" ).button({
		text: false,
		icons: {
			primary: "draw-icon-img"
		},
		disabled: true
	});
	$( "#undo" ).button({
		text: false,
		icons: {
			primary: "draw-icon-undo"
		},
		disabled: true
	});
	
//replace "fakerooms.json" with rooms endpoint
	$.getJSON( "fakerooms.json", function( data ) {
		//var rooms=data.split(",");
		//for(var room in rooms)$("<option>"+rooms[room]+"</option>").appendTo("#room-select");
		var rooms=data.rooms;
		for(var room in rooms)$("<option>"+rooms[room].roomName+"</option>").appendTo("#room-select");
	});
	$( "#signin" ).dialog({
		closeOnEscape: false,
		modal: true,
		buttons: {
			Enter: function() {
				var password=$('#input-password').val();
				var user=$('#input-usr').val();
				var room=$('#room-input').val();
				if(room!==""&&user!==""){
					userName=$('#input-usr').val();
					socket.emit('room', user, room);
//replace "fakesignin.txt" with signin endpoint
					$.post( "fakesignin.txt", { username: user, pwd: password, room:room } );
					$( this ).dialog( "close" );
				}else if(room==="")alert("Room name cannot be blank");
				else alert("User name cannot be blank");
			}
		},
		open: function(event, ui) { $(".ui-dialog-titlebar-close", ui.dialog || ui).hide();}
	});
	$("#room-select").change(function(){
		if(this.value==="new"){
			$("#room-input").val("").show();
		}else{
			$("#room-input").val(this.value).hide();
		}
	});
	
	//replace later
	initCanvas();
});

socket.on("draw",function(drawData){
	var draw = JSON.parse(drawData);
	var data = draw.data.split("|");
	console.log(data);
	if(data[0]==="canvas")canvasDraw(data[1],data[2],data[3],data[4],data[5],data[6],data[7]);
});

function getMousePosition(object, e) {
	var rect = canvas.getBoundingClientRect();
	return {
		x: e.clientX - rect.left,
		y: e.clientY - rect.top
	};
}