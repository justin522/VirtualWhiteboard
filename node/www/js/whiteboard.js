(function( $ ) {
	$.whiteboard={
		workspace:null,
		mode:null,
		roomName:"",
		layers:[],
		activeLayer:null,
		indicators:[],
		host:function(){return window.location.host.split(':')[0];},
		socket:function(){return io.connect('http://'+this.host());},
		userName:"",
		fillColor: "none",
		strokeColor:"black",
		strokeWidth: 1,
		layercount: 0,
		imgUrl:"/img/noimage.png"
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
				$(wb.workspace).css('cursor','url(img/marker.png), auto');
				al.click(function(e){
					var point=wb.getMousePosition(e);
					wb.emitPoint(point.x,point.y);
				}).mousedown(function(e){
					draw=true;
				});
				al.mouseup(function(e){
					draw=false;
				}).mouseover(function(e){
					$(wb.indicators["point"]).appendTo(wb.layers[0]);
					svg(wb.indicators["point"],{r:wb.strokeWidth/2,fill:wb.strokeColor},"update-attributes");
				}).mousemove(function(e){
					var point=wb.getMousePosition(e);
					prevX = currX;
					prevY = currY;
					currX = point.x;
					currY = point.y;
					var change={};
					if(point.x!==prevX){
						change.cx=point.x;
					}
					if(point.y!==prevY){
						change.cy=point.y;
					}
					if(draw){
						if(Math.sqrt(Math.pow((currX-prevX),2)+Math.pow((currY-prevY),2))>wb.strokeWidth/2){
							wb.emitLine(prevX,prevY,currX,currY);
						}else wb.emitPoint(currX,currY);	
					}
					svg(wb.indicators["point"],change,"update-attributes");
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
				}).mouseover(function(e){
					$(wb.indicators["erase"]).appendTo(wb.layers[0]);
					svg(wb.indicators["erase"],{r:wb.strokeWidth/2},"update-attributes");
				}).mousemove(function(e){
					var point=wb.getMousePosition(e);
					var change={};
					var prevX,prevY;
					if(point.x!==prevX){
						change.cx=prevX=point.x;
					}
					if(point.y!==prevY){
						change.cy=prevY=point.y;
					}
					if(draw){
						wb.emitEraseCanvas(point.x,point.y);	
					}
					svg(wb.indicators["erase"],change,"update-attributes");
				});
				
				break;
			case "line":
				$(wb.workspace).css('cursor','url(img/line-marker.png), auto');
				var x=null;
				var y=null;
				var preview=false;
				al.mousedown(function(e){
					var point=wb.getMousePosition(e);
					x=point.x;
					y=point.y;
					$(wb.indicators["line"]).appendTo(wb.layers[0]);
					svg(wb.indicators["line"],{x1:x,y1:y,x2:x,y2:y,stroke:wb.strokeColor,"stroke-width":wb.strokeWidth},"update-attributes");
					preview=true;
				});
				al.mouseup(function(e){
					if(null!==x){
						var point=wb.getMousePosition(e);
						wb.emitLine(x,y,point.x,point.y);
						x=null;
						y=null;
					}
					svg(wb.indicators["line"],{},"remove");
					perview=false;
				}).mousemove(function(e){
					var point=wb.getMousePosition(e);
					var change={};
					if(preview){
						svg(wb.indicators["line"],{x2:point.x,y2:point.y},"update-attributes");
					}
				});
				break;
			case "polyline":
				$(wb.workspace).css('cursor','url(img/polyline-marker.png), auto');
				var x=null;
				var y=null;
				var preview=false;
				al.click(function(e){
					var point=wb.getMousePosition(e);
					if(null!==x){
						wb.emitLine(x,y,point.x,point.y);
					}
					x=point.x;
					y=point.y;
					$(wb.indicators["line"]).appendTo(wb.layers[0]);
					svg(wb.indicators["line"],{x1:x,y1:y,x2:x,y2:y,stroke:wb.strokeColor,"stroke-width":wb.strokeWidth},"update-attributes");
					preview=true;
				}).dblclick(function(e){
					x=null;
					y=null;
					$(wb.indicators["line"]).appendTo(wb.layers[0]);
					svg(wb.indicators["line"],{},"remove");
					preview=false;
				}).mousemove(function(e){
					var point=wb.getMousePosition(e);
					var change={};
					if(preview){
						svg(wb.indicators["line"],{x2:point.x,y2:point.y},"update-attributes");
					}
				});
				break;
			case "rect":
				$(wb.workspace).css('cursor','url(img/rectangle-marker.png), auto');
				var x=null;
				var y=null;
				var preview=false;
				al.mousedown(function(e){
					var point=wb.getMousePosition(e);
					x=point.x;
					y=point.y;
					$(wb.indicators["rect"]).appendTo(wb.layers[0]);
					svg(wb.indicators["rect"],{x:x,y:y,width:0,height:0,fill:wb.fillColor,stroke:wb.strokeColor,"stroke-width":wb.strokeWidth},"update-attributes");
					preview=true;
				});
				al.mouseup(function(e){
					if(null!==x){
						var point=wb.getMousePosition(e);
						var w=point.x-x;
						var h=point.y-y;
						wb.emitRect(x,y,w,h);
						x=null;
						y=null;
						svg(wb.indicators["rect"],{},"remove");
						preview=false;
					}
				}).mousemove(function(e){
					if(preview){
						var point=wb.getMousePosition(e);
						var w=Math.abs(point.x-x);
						var h=Math.abs(point.y-y);
						var xloc=Math.min(x,point.x);
						var yloc=Math.min(y,point.y);
						svg(wb.indicators["rect"],{x:xloc,y:yloc,width:w,height:h},"update-attributes");
					}
				});
				break;
			case "image":
				$(wb.workspace).css('cursor','url(img/imageicon.png), auto');
				var x=null;
				var y=null;
				var preview=false;
				al.mousedown(function(e){
					var point=wb.getMousePosition(e);
					x=point.x;
					y=point.y;
					$(wb.indicators["image"]).appendTo(wb.layers[0]);
					svg(wb.indicators["image"],{"xlink:href":wb.imgUrl,x:x,y:y,width:0,height:0},"update-attributes");
					preview=true;
				});
				al.mouseup(function(e){
					if(null!==x){
						var point=wb.getMousePosition(e);
						var w=point.x-x;
						var h=point.y-y;
						wb.emitImage(x,y,w,h);
						x=null;
						y=null;
						svg(wb.indicators["image"],{},"remove");
						preview=false;
					}
				}).mousemove(function(e){
					if(preview){
						var point=wb.getMousePosition(e);
						var w=Math.abs(point.x-x);
						var h=Math.abs(point.y-y);
						var xloc=Math.min(x,point.x);
						var yloc=Math.min(y,point.y);
						svg(wb.indicators["image"],{x:xloc,y:yloc,width:w,height:h},"update-attributes");
					}
				});
				break;
			case "circle":
				$(wb.workspace).css('cursor','url(img/circle-marker.png), auto');
				var cx=null;
				var cy=null;
				var preview=false;
				al.mousedown(function(e){
					var point=wb.getMousePosition(e);
					cx=point.x;
					cy=point.y;
					$(wb.indicators["circle"]).appendTo(wb.layers[0]);
					svg(wb.indicators["circle"],{cx:cx,cy:cy,r:0,fill:wb.fillColor,stroke:wb.strokeColor,"stroke-width":wb.strokeWidth},"update-attributes");
					preview=true;
				});
				al.mouseup(function(e){
					if(null!==x){
						var point=wb.getMousePosition(e);
						var r=Math.sqrt(Math.pow(point.x-cx,2)+Math.pow(point.y-cy,2));
						wb.emitCircle(cx,cy,r);
						cx=null;
						cy=null;
					}
					svg(wb.indicators["circle"],{},"remove");
					perview=false;
				}).mousemove(function(e){
					if(preview){
						var point=wb.getMousePosition(e);
						var r=Math.sqrt(Math.pow(point.x-cx,2)+Math.pow(point.y-cy,2));
						svg(wb.indicators["circle"],{r:r},"update-attributes");
					}
				});
				break;
		}
	},
	$.whiteboard.emitPoint=function(x,y) {
		var data = JSON.stringify({user:userName,data:$.whiteboard.mode+'|'+wb.activeLayer.attr('id')+'|point|'+x+'|'+y+'|'+$.whiteboard.strokeColor+'|'+$.whiteboard.strokeWidth});
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
		if("none"!==fillColor){
	    	ctx.fillStyle = fillColor;
			ctx.fillRect(x, y, x1, y1);
		}
		if("none"!==strokeColor){
			ctx.strokeStyle = strokeColor;
			ctx.rect(x, y, x1, y1);
			ctx.stroke();
		}
		ctx.closePath();
	},
	$.whiteboard.emitImage=function(x,y,w,h) {
		var data = JSON.stringify({user:userName,data:$.whiteboard.mode+'|'+$.whiteboard.activeLayer.attr('id')+'|image|'+$.whiteboard.imgUrl+'|'+x+'|'+y+'|'+w+'|'+h});
		$.whiteboard.socket().emit('drawing',data);
	},
	$.whiteboard.drawImage=function(layer,url,x,y,w,h){
		var img=$("<img />").addClass("tmp").attr("src",url).width(w).height(h).appendTo("body")[0];
		canvas=$('#'+layer)[0];
		ctx=canvas.getContext("2d");
		ctx.drawImage(img,x,y,w,h);
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
		if("none"!==fillColor){
	    	ctx.fillStyle = fillColor;
			ctx.fill();
		}
		if("none"!==strokeColor){
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
			wb=$.whiteboard;
			var actionlayer=this.addSVGLayer();
			var defs=svg("defs",{cx:"100",cy:"100",r:"50",fill:"red"});
			var grad=svg("radialGradient",{id:"eraser-grad"});
			$(grad).append(svg("stop",{offset:"0%", "stop-opacity":".5", "stop-color":"lightgray"}),svg("stop",{offset:"100%", "stop-opacity":"0"}));
			$(defs).append(grad);
			var indicator;
			indicator=wb.indicators["erase"]=svg("circle",{class:"strokeWidth",cx:"100",cy:"100",r:"1",fill:"url(#eraser-grad)"});
			actionlayer.append(defs,indicator);
			svg(indicator,{},"remove");
			$(indicator).on("resize",function(e,d){
				svg(this,{r:d/3},"update-attributes");
			}).mousemove(function(e){
				var point=wb.getMousePosition(e);
				var change={};
				var prevX,prevY;
				if(point.x!==prevX){
					change.cx=prevX=point.x;
				}
				if(point.y!==prevY){
					change.cy=prevY=point.y;
				}
				svg(this,change,"update-attributes");
			});

			indicator=wb.indicators["point"]=svg("circle",{class:"strokeWidth strokeColor",cx:"100",cy:"100",r:"1",fill:wb.strokeColor,opacity:".5"});
			actionlayer.append(defs,indicator);
			svg(indicator,{},"remove");
			$(indicator).on("resize",function(e,d){
				svg(this,{r:d/3},"update-attributes");
			}).on("changeStrokeColor",function(e,color){
				svg(this,{fill:color},"update-attributes");
			}).mousemove(function(e){
				var point=wb.getMousePosition(e);
				var change={};
				var prevX,prevY;
				if(point.x!==prevX){
					change.cx=prevX=point.x;
				}
				if(point.y!==prevY){
					change.cy=prevY=point.y;
				}
				svg(this,change,"update-attributes");
			});
			
			indicator=wb.indicators["line"]=svg("line",{class:"strokeWidth strokeColor",x1:"0",y1:"0",x2:"0",y2:"0",stroke:wb.strokeColor,"stroke-width":"1"});
			actionlayer.append(defs,indicator);
			svg(indicator,{},"remove");
			$(indicator).on("resize",function(e,d){
				svg(this,{r:d/3},"update-attributes");
			}).on("changeStrokeColor",function(e,color){
				svg(this,{fill:color},"update-attributes");
			});
			wb.setTool("realtime");
			
			indicator=wb.indicators["rect"]=svg("rect",{class:"strokeWidth strokeColor fillColor",x:"0",y:"0",width:"0",height:"0",fill:wb.fillColor,stroke:wb.strokeColor,"stroke-width":"1"});
			actionlayer.append(defs,indicator);
			svg(indicator,{},"remove");
			$(indicator).on("resize",function(e,d){
				svg(this,{r:d/3},"update-attributes");
			}).on("changeStrokeColor",function(e,color){
				svg(this,{fill:color},"update-attributes");
			}).on("changeFillColor",function(e,color){
				svg(this,{fill:color},"update-attributes");
			});
			
			indicator=wb.indicators["image"]=svg("image",{class:"imagePreview","xlink:href":"img/noimage.png",x:"0",y:"0",width:"0",height:"0"});
			actionlayer.append(defs,indicator);
			svg(indicator,{},"remove");

			indicator=wb.indicators["circle"]=svg("circle",{class:"strokeWidth strokeColor fillColor",cx:"0",cy:"0",r:"0",fill:wb.fillColor,stroke:wb.strokeColor,opacity:".5"});
			actionlayer.append(defs,indicator);
			svg(indicator,{},"remove");
			$(indicator).on("resize",function(e,d){
				svg(this,{r:d/3},"update-attributes");
			}).on("changeStrokeColor",function(e,color){
				svg(this,{fill:color},"update-attributes");
			}).on("changeFillColor",function(e,color){
				svg(this,{fill:color},"update-attributes");
			});
			wb.setTool("realtime");
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
		$.whiteboard.socket().emit('msg',$.whiteboard.userName, m);
		$('#chat-input').val('');
	});
	$('#link-dialog').dialog({
		width: 360,
		buttons: [
			{
				text: "OK",
				click: function() {
					var url=$('#link-url').val();
					if(url.indexOf("http")!==0)url="http://"+url;
					var m = {type:'link',url:url,desc:$('#link-desc').val()};
					$.whiteboard.socket().emit('msg',$.whiteboard.userName, m);
					$('#link-url,#link-desc').val('');
					$( this ).dialog( "close" );
					
				}
			}
		]
	}).dialog("close");
	$('#image-dialog').dialog({
		width: 360,
		buttons: [
			{
				text: "OK",
				click: function() {
					var url=$('#img-url').val();
					if(url==="")url=window.location.host+"/img/noimage.png";
					if(url.indexOf("http")!==0)url="http://"+url;
					$.whiteboard.imgUrl=url;//.replace("Microsoft", "W3Schools");
					$('#img-url').val('');
					$( this ).dialog( "close" );
				}
			}
		]
	}).keypress(function(e) {
		if ( e.which == 13 ) {
			var url=$('#img-url').val();
			if(url==="")url=window.location.host+"/img/noimage.png";
			if(url.indexOf("http")!==0)url="http://"+url;
			$.whiteboard.imgUrl=url;//.replace("Microsoft", "W3Schools");
			$('#img-url').val('');
			$( this ).dialog( "close" );
		}
	}).dialog("close");
	$('#link-button').click(function(){$('#link-dialog').dialog("open");});
	$('#chat-input').keypress(function(e) {
		if ( e.which == 13 ) {
			$("#post-chat").click();
		}
	});
	$("#chat-display").mousedown(function(e){
		e.preventDefault();
	});
	$("#fillcolor").spectrum({
		showAlpha: true,
		allowEmpty:true,
		showInitial: true,
		appendTo:"#color-tools",
		clickoutFiresChange: true,
		change: function(color) {
			var c;
			if(color)c=color.toRgbString();
			else c="none";
			$.whiteboard.fillColor = c;
			$("#sample").attr("fill",c);
			$(".fillColor").trigger("changeFillColor",[c]);
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
			var c;
			if(color)c=color.toRgbString();
			else c="none";
			$.whiteboard.strokeColor = c;
			$("#sample").attr("stroke",c);
			$(".strokeColor").trigger("changeStrokeColor",[c]);
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
	$("#linesize").spinner({
		min: 1,
		stop: function() {
			$(".strokeWidth").trigger("resize",[$(this).val()]);
			$.whiteboard.strokeWidth = $(this).val();
			$("#sample").attr("stroke-width",$(this).val());
			
		}
	});
	$("#tabs").tabs().tabs( "disable", 1 );
	$("#drawing-tools>input").click(function(){
		for(var i in $.whiteboard.indicators){
			svg($.whiteboard.indicators[i],{},"remove");
		}
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
		}
	}).click(function(){
		$.whiteboard.setTool("image");
		$('#image-dialog').dialog("open");
	});
	$( "#undo" ).button({
		text: false,
		icons: {
			primary: "draw-icon-undo"
		},
		disabled: true
	});
	$( "#polygon" ).button({
		text: false,
		icons: {
			primary: "draw-icon-polygon"
		},
		disabled: true
	});
	$( "#rl-button" ).button().click(function(){$.whiteboard.addCanvasLayer();});
	$( "#rl-button" ).button().click(function(){$.whiteboard.addSVGLayer();});
//Connection: the next four lines handle the cet request to list existing rooms.
	$.getJSON( "http://cs597-VirtualWhiteboardLB/whiteboard-api/room/getrooms", function( data ) {
	// $.getJSON( "fakerooms.json", function( data ) {
		var rooms=data.rooms;
		for(var room in rooms)$("<option>"+rooms[room].roomName+"</option>").appendTo("#room-select");
	});
	$( "#signin" ).dialog({
		width: 235,
		closeOnEscape: false,
		modal: true,
		buttons: {
			Enter: function() {
				var password=$('#input-password').val();
				var user=$('#input-usr').val();
				var room=$('#room-input').val();
				if(room!==""&&user!==""){
					userName=$('#input-usr').val();
//Connection: the next four lines handle the post request to join the room
					//$.post( "http://cs597-VirtualWhiteboardLB/whiteboard-api/room/create/"+room, function() {
						$.whiteboard.socket().emit('room', user, room);
					//	$( this ).dialog( "close" );
					//});
					// $.post( "fakesignin.txt", { username: user, pwd: password, room:room } );
					// $.whiteboard.socket().emit('room', user, room);
					// $.whiteboard.userName=user;
					// $( this ).dialog( "close" );
				}else if(room==="")alert("Room name cannot be blank");
				else alert("User name cannot be blank");
				$("#water").water();
				$('body').keydown(function(e) {
					switch(e.which){
						case 38:
							if(eggcount<2)eggcount++;
							else eggcount=0;
							break;
						case 40:
							if(eggcount<4&&eggcount>1)eggcount++;
							else eggcount=0;
							break;
						case 37:
							if(eggcount==4||eggcount==6)eggcount++;
							else eggcount=0;
							break;
						case 39:
							if(eggcount==5||eggcount==7)eggcount++;
							else eggcount=0;
							break;
						case 66:
							if(eggcount==8)eggcount++;
							else eggcount=0;
							break;
						case 65:
							if(eggcount==9){
								$.whiteboard.imgUrl="/img/konami.png";
								$.whiteboard.emitImage(20,20,100,100);
								setTimeout(function(){
									$.whiteboard.imgUrl="/img/konami.png";
									$.whiteboard.emitImage(20,20,100,100);
								}, 2000);
							}
							eggcount=0;
							break;
					}
				});
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
			case "image":$.whiteboard.drawImage(data[1],data[3],data[4],data[5],data[6],data[7]); break;
			case "erase":$.whiteboard.eraseCanvas(data[1],data[3],data[4],data[5]); break;
		}
	}
});
eggcount=0;
