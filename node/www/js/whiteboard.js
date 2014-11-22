var socket = io();
$(document).ready(function(){
	$("#post-chat").click(function(){
		socket.emit('msg',"Justin", $('#chat-input').val());
		alert("hey");
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
	
	//replace later
	initCanvas();
});
