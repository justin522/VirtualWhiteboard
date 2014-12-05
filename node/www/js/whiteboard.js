(function( $ ) {
	$.whiteboard={
		workspace:null,
		mode:null,
		roomName:"",
		layers:[],
		activeLayer:null,
		host:function(){return window.location.host.split(':')[0];},
		socket:function(){return io.connect('http://'+this.host());},
		userName:"",
		fillColor: null,
		strokeColor:"black",
		strokeWidth: 1,
		layercount: 0
	},
	$.whiteboard.canvasMode=function(tool){
		$.whiteboard.mode="canvas";
	},

	$.whiteboard.getMousePosition=function(e) {
		var rect = $.whiteboard.layers[0][0].getBoundingClientRect();
		return {
			x: e.clientX - rect.left,
			y: e.clientY - rect.top
		};
	},
	$.whiteboard.setTool=function(tool){
		var wb=$.whiteboard;
		var al=$.whiteboard.layers[0];
		var draw=false;
		var prevX = null;
		var prevY = null;
		var currX = 0;
		var currY = 0;
		al.off();
		switch(tool){
			case "realtime":
				$($.whiteboard.workspace).css('cursor','url(img/marker.png), auto');
				al.click(function(e){
					var point=wb.getMousePosition(e);
					wb.emitPoint(point.x,point.y);
				}).mousedown(function(e){
					draw=true;
				});
				al.mouseup(function(e){
					draw=false;
				}).mousemove(function(e){
					var point=wb.getMousePosition(e);
					prevX = currX;
					prevY = currY;
					currX = point.x;
					currY = point.y;
					if(draw){
						if(Math.sqrt(Math.pow((currX-prevX),2)+Math.pow((currY-prevY),2))>$.whiteboard.strokeWidth/2){
							wb.emitLine(prevX,prevY,currX,currY);
						}else wb.emitPoint(currX,currY);	
					}
				});
				break;
			case "erase_c":
				$($.whiteboard.workspace).css('cursor','url(img/eraser.png), auto');
				al.click(function(e){
					var point=wb.getMousePosition(e);
					wb.emitEraseCanvas(point.x,point.y);
				}).mousedown(function(e){
					draw=true;
				});
				al.mouseup(function(e){
					draw=false;
				}).mousemove(function(e){
					var point=wb.getMousePosition(e);
					prevX = currX;
					prevY = currY;
					currX = point.x;
					currY = point.y;
					if(draw){
						wb.emitEraseCanvas(currX,currY);	
					}
				});
				
				break;
			case "line":
				$($.whiteboard.workspace).css('cursor','url(img/line-marker.png), auto');
				var x=null;
				var y=null;
				al.mousedown(function(e){
					var point=wb.getMousePosition(e);
					x=point.x;
					y=point.y;
				});
				al.mouseup(function(e){
					if(null!==x){
						var point=wb.getMousePosition(e);
						$.whiteboard.emitLine(x,y,point.x,point.y);
						x=null;
						y=null;
					}
				}).mousemove(function(e){
				});
				break;
			case "polyline":
				$($.whiteboard.workspace).css('cursor','url(img/polyline-marker.png), auto');
				var x=null;
				var y=null;
				al.click(function(e){
					var point=wb.getMousePosition(e);
					if(null!==x){
						$.whiteboard.emitLine(x,y,point.x,point.y);
					}
					x=point.x;
					y=point.y;
				}).dblclick(function(e){
					x=null;
					y=null;
				}).mousemove(function(e){
				});
				break;
			case "rect":
				$($.whiteboard.workspace).css('cursor','url(img/rectangle-marker.png), auto');
				var x=null;
				var y=null;
				al.mousedown(function(e){
					var point=wb.getMousePosition(e);
					x=point.x;
					y=point.y;
				});
				al.mouseup(function(e){
					if(null!==x){
						var point=wb.getMousePosition(e);
						$.whiteboard.emitRect(x,y,point.x,point.y);
						x=null;
						y=null;
					}
				}).mousemove(function(e){
				});
				break;
			case "circle":
				$($.whiteboard.workspace).css('cursor','url(img/circle-marker.png), auto');
				var cx=null;
				var cy=null;
				al.mousedown(function(e){
					var point=wb.getMousePosition(e);
					cx=point.x;
					cy=point.y;
				});
				al.mouseup(function(e){
					if(null!==x){
						var point=wb.getMousePosition(e);
						r=Math.sqrt(Math.pow(point.x-cx,2)+Math.pow(point.y-cy,2));
						$.whiteboard.emitCircle(cx,cy,r);
						cx=null;
						cy=null;
					}
				}).mousemove(function(e){
				});
				break;
		}
	},
	$.whiteboard.emitPoint=function(x,y) {
		var data = JSON.stringify({user:userName,data:$.whiteboard.mode+'|'+$.whiteboard.activeLayer.attr('id')+'|point|'+x+'|'+y+'|'+$.whiteboard.strokeColor+'|'+$.whiteboard.strokeWidth});
		$.whiteboard.socket().emit('drawing',data);
	},
	$.whiteboard.drawCanvasPoint=function(layer,x,y,strokeColor,strokeWidth){
		canvas=$('#'+layer)[0];
		ctx=canvas.getContext("2d");
		ctx.beginPath();
		ctx.arc(x, y, strokeWidth/2, 0, 2 * Math.PI, false);
	    ctx.fillStyle = strokeColor;
		if("null"!==strokeColor){
	    	ctx.fill();
	    }
		ctx.closePath();
	},
	$.whiteboard.emitLine=function(x,y,x1,y1) {
		var data = JSON.stringify({user:userName,data:$.whiteboard.mode+'|'+$.whiteboard.activeLayer.attr('id')+'|line|'+x+'|'+y+'|'+x1+'|'+y1+'|'+$.whiteboard.strokeColor+'|'+$.whiteboard.strokeWidth});
		$.whiteboard.socket().emit('drawing',data);
	},
	$.whiteboard.drawCanvasLine=function(layer,x,y,x1,y1,strokeColor,strokeWidth){
		canvas=$('#'+layer)[0];
		ctx=canvas.getContext("2d");
		ctx.beginPath();
		ctx.arc(x, y, strokeWidth/20, 0, 2 * Math.PI, false);
	    ctx.fillStyle = strokeColor;
	    ctx.fill();
		ctx.moveTo(x, y);
		ctx.lineTo(x1, y1);
		ctx.strokeStyle = strokeColor;
		ctx.lineWidth = strokeWidth;
		ctx.lineCap = 'round';
		if("null"!==strokeColor){
			ctx.stroke();
		}
		ctx.closePath();
	},
	$.whiteboard.emitRect=function(x,y,x1,y1) {
		var data = JSON.stringify({user:userName,data:$.whiteboard.mode+'|'+$.whiteboard.activeLayer.attr('id')+'|rect|'+x+'|'+y+'|'+x1+'|'+y1+'|'+$.whiteboard.fillColor+'|'+$.whiteboard.strokeColor+'|'+$.whiteboard.strokeWidth});
		$.whiteboard.socket().emit('drawing',data);
	},
	$.whiteboard.drawRect=function(layer,x,y,x1,y1,fillColor,strokeColor,strokeWidth){
		canvas=$('#'+layer)[0];
		ctx=canvas.getContext("2d");
		ctx.beginPath();
		ctx.lineWidth = strokeWidth;
		if("null"!==fillColor){
	    	ctx.fillStyle = fillColor;
			ctx.fillRect(x, y, x1, y1);
		}
		if("null"!==strokeColor){
			ctx.strokeStyle = strokeColor;
			ctx.rect(x, y, x1, y1);
			ctx.stroke();
		}
		ctx.closePath();
	},
	$.whiteboard.emitCircle=function(x,y,r) {
		var data = JSON.stringify({user:userName,data:$.whiteboard.mode+'|'+$.whiteboard.activeLayer.attr('id')+'|circle|'+x+'|'+y+'|'+r+'|'+$.whiteboard.fillColor+'|'+$.whiteboard.strokeColor+'|'+$.whiteboard.strokeWidth});
		$.whiteboard.socket().emit('drawing',data);
	},
	$.whiteboard.drawCircle=function(layer,x,y,r,fillColor,strokeColor,strokeWidth){
		canvas=$('#'+layer)[0];
		ctx=canvas.getContext("2d");
		ctx.beginPath();
		ctx.lineWidth = strokeWidth;
		ctx.arc(x, y, r, 0, 2 * Math.PI, false);
		if("null"!==fillColor){
	    	ctx.fillStyle = fillColor;
			ctx.fill();
		}
		if("null"!==strokeColor){
			ctx.strokeStyle = strokeColor;
			ctx.stroke();
		}
		ctx.closePath();
	},
	$.whiteboard.emitEraseCanvas=function(x,y) {
		var data = JSON.stringify({user:userName,data:$.whiteboard.mode+'|'+$.whiteboard.activeLayer.attr('id')+'|erase|'+x+'|'+y+'|'+$.whiteboard.strokeWidth});
		$.whiteboard.socket().emit('drawing',data);
	},
	$.whiteboard.eraseCanvas=function(layer,x,y,strokeWidth){
		canvas=$('#'+layer)[0];
		ctx=canvas.getContext("2d");
		ctx.beginPath();
		ctx.arc(x, y, strokeWidth/2, 0, 2 * Math.PI, false);
	    ctx.fillStyle = "black";
	    ctx.globalCompositeOperation = "destination-out";
	    ctx.fill();
	    ctx.globalCompositeOperation = "source-over";
		ctx.closePath();
	},
	$.whiteboard.addStyle=function(rules){
		$("head").append("<style>"+rules+"</style>");
	},
	$.widget( "whiteboard.workspace", {
		options: {
			width: "700px",
			height: "500px",
			background: "white",
			initMode: "canvas"
		},
		_create: function() {
			$.whiteboard.workspace=this.element;
			$.whiteboard.mode=this.options.initMode;
			this.element.addClass( "whiteboard" );
			this.element.append('<div id="whiteboard-background" />').css({width:this.options.width,height:this.options.height,background:this.options.background});
			this._addActionLayer();
			$.whiteboard.layers[0].appendTo(this.element).css({width:this.options.width,height:this.options.height});
			switch(this.options.initMode){
				case "canvas": this.addCanvasLayer(); break;
				case "svg": this.addSVGLayer(); break;
	 		}
	 		$.whiteboard.activeLayer=$.whiteboard.layers[1];
		},
		_setOption: function( key, value ) {
			if ( key === "value" ) {
				value = this._constrain( value );
			}
			this._super( key, value );
		},
		_setOptions: function( options ) {
			this._super( options );
			this.refresh();
		},
		_addLayer: function(type) {
			var newLayer;
			switch(type){
				default: newLayer=$('<'+type+' class="layer" width="'+this.options.width+'" height="'+this.options.height+'"></canvas>');
			}
			$.whiteboard.layers.push(newLayer);
			newLayer.css("position","absolute").attr("id","l"+$.whiteboard.layercount);
			$.whiteboard.layers[0].before(newLayer);
			$.whiteboard.layercount++;
			if($.whiteboard.layercount===2)$("#layers").append('<p><input checked="checked" type="radio" name="drawing-layers" /></p>');
			else if($.whiteboard.layercount>2)$("#layers").append('<p><input type="radio" name="drawing-layers" /></p>');
			return newLayer;
		},
		_addActionLayer: function(type) {
			var actionlayer=this.addSVGLayer();
			$.whiteboard.setTool("realtime");
			return actionlayer;
		},
	 
		addSVGLayer: function() {
			return this._addLayer("svg");
		},
	 
		addCanvasLayer: function(type) {
			this._addLayer("canvas");
		},
	 
		setTool: function(toolMode) {
			switch(toolMode){
				case "realtime":
			}
		}
	});
})( jQuery );





$(document).ready(function(){
	$("#whiteboard").workspace();
	$("#post-chat").click(function(){
		var m = {type:'message',data:$('#chat-input').val()};
		$.whiteboard.socket().emit('msg',$('#input-usr').val(), m);
		$('#chat-input').val('');
	});
	$('#link-dialog').dialog({
		buttons: [
			{
				text: "OK",
				click: function() {
					var m = {type:'link',url:$('#link-url').val(),desc:$('#link-desc').val()};
					$.whiteboard.socket().emit('msg',$('#input-usr').val(), m);
					$('#link-url,#link-desct').val('');
					$( this ).dialog( "close" );
				}
			}
		]
	}).dialog("close");
	$('#link-button').click(function(){$('#link-dialog').dialog("open");});
	$('#chat-input').keypress(function(e) {
		if ( e.which == 13 ) {
			$("#post-chat").click();
		}
	});
	$('#signin').keypress(function(e) {
		if ( e.which == 13 ) {
			$("#post-chat").click();
		}
	});
	$("#fillcolor").spectrum({
		showAlpha: true,
		allowEmpty:true,
		showInitial: true,
		appendTo:"#color-tools",
		clickoutFiresChange: true,
		change: function(color) {
			if(!color){
				$.whiteboard.fillColor = null;
				$("#sample").attr("fill","none");
			}
			else{
				$.whiteboard.fillColor = color.toRgbString();
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
		clickoutFiresChange: true,
		change: function(color) {
			if(!color){
				$.whiteboard.strokeColor = null;
				$("#sample").attr("stroke","none");
			}
			else{
				$.whiteboard.strokeColor = color.toRgbString();
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
		$.whiteboard.strokeWidth = $(this).val();
		$("#sample").attr("stroke-width",$(this).val());
	});
	$("#tabs").tabs();
	$("#drawing-tools>input").click(function(){
		if(!$(this).is(":checked")){
			$(this).prop('checked',true).button( "refresh" );
		}else $(this).siblings(":checked").removeAttr('checked').button( "refresh" );
	});
	$( "#realtime" ).button({
		text: false,
		icons: {
			primary: "draw-icon-realtime"
		}
	}).click(function(){$.whiteboard.setTool("realtime");});
	$( "#freehand" ).button({
		text: false,
		icons: {
			primary: "draw-icon-free"
		},
		disabled: true
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
		}
	}).click(function(){$.whiteboard.setTool("polyline");});
	$( "#line" ).button({
		text: false,
		icons: {
			primary: "draw-icon-line"
		}
	}).click(function(){$.whiteboard.setTool("line");});
	$( "#rectangle" ).button({
		text: false,
		icons: {
			primary: "draw-icon-rect"
		}
	}).click(function(){$.whiteboard.setTool("rect");});
	$( "#circle" ).button({
		text: false,
		icons: {
			primary: "draw-icon-circle"
		}
	}).click(function(){$.whiteboard.setTool("circle");});
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
		}
	}).click(function(){
		$.whiteboard.setTool("erase_c");
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
	$( "#rl-button" ).button().click(function(){$.whiteboard.addCanvasLayer();});
	$( "#rl-button" ).button().click(function(){$.whiteboard.addSVGLayer();});
//replace "fakerooms.json" with rooms endpoint
	$.getJSON( "http://cs597-VirtualWhiteboardLB/whiteboard-api/room/getrooms", function( data ) {
	//$.getJSON( "fakerooms.json", function( data ) {
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
//replace "fakesignin.txt" with signin endpoint
					$.post( "http://cs597-VirtualWhiteboardLB/whiteboard-api/room/create/"+room, function() {
						$.whiteboard.socket().emit('room', user, room);
						$( this ).dialog( "close" );
					});
					// $.post( "fakesignin.txt", { username: user, pwd: password, room:room } );
					// $.whiteboard.socket().emit('room', user, room);
					// $( this ).dialog( "close" );
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
});

$.whiteboard.socket().on("draw",function(drawData){
	var draw = JSON.parse(drawData);
	var data = draw.data.split("|");
	if(data[0]==="canvas"){
		switch(data[2]){
			case "point":$.whiteboard.drawCanvasPoint(data[1],data[3],data[4],data[5],data[6]); break;
			case "line":$.whiteboard.drawCanvasLine(data[1],data[3],data[4],data[5],data[6],data[7],data[8]); break;
			case "rect":$.whiteboard.drawRect(data[1],data[3],data[4],data[5],data[6],data[7],data[8],data[9]); break;
			case "circle":$.whiteboard.drawCircle(data[1],data[3],data[4],data[5],data[6],data[7],data[8]); break;
			case "erase":$.whiteboard.eraseCanvas(data[1],data[3],data[4],data[5]); break;
		}
	}
});
