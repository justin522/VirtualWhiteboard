(function( $ ) {
	$.widget( "effects.water", {
		options: {
			QUALITY:4
		},
		_create: function() {
			var QUALITY=this.options.QUALITY;
			var WIDTH = Math.floor(
				$(chat).width() / QUALITY
			),
			HEIGHT = Math.floor($(chat).height() / QUALITY),
			SIZE = WIDTH * HEIGHT;
			var context, image, data, buffer1, buffer2, tempbuffer, isUserInteracting;
			container=this.element;
			canvas=$("<canvas />");
			$(container).append(canvas).addClass("ui-corner-all");
			canvas.addClass("ui-corner-all");
			$(chat).css("background","none").mousedown(function(event){
				//event.preventDefault();
				//$(chat).children().trigger(event);
				isUserInteracting = true;
				pointers = [[(event.clientX-$(container).offset().left)/ QUALITY, (event.clientY-$(container).offset().top)/ QUALITY]];
				$.whiteboard.socket().emit('water', (event.clientX-$(container).offset().left)/ QUALITY, (event.clientY-$(container).offset().top)/ QUALITY);
			}).mousemove(function(event){
				isUserInteracting = true;
				pointers = [[(event.clientX-$(container).offset().left)/ QUALITY, (event.clientY-$(container).offset().top) / QUALITY]];
				$.whiteboard.socket().emit('water', (event.clientX-$(container).offset().left)/ QUALITY, (event.clientY-$(container).offset().top)/ QUALITY);
			}).mouseup(function(event){
				isUserInteracting = false;
			}).mouseout(function(event){
				isUserInteracting = false;
			});
			$(document).keyup(function(e){
				buffer1[ Math.floor(Math.random() * WIDTH) + (Math.floor(Math.random() * HEIGHT) * WIDTH)] = 255;
			});
			$("#chat-display").css({background:"none",color:"white"});
			$("#chat-input").css({color:"black"});
			//canvas.css("position","absolute");
			context=canvas[0].getContext("2d");
			$(this.element).offset($(chat).offset());
			canvas[0].width = WIDTH;
			canvas[0].height = HEIGHT;
			canvas[0].style.width = $(chat).width() + "px";
			canvas[0].style.height = $(chat).height() + "px";
			context.fillStyle = "rgb(0, 0, 0)";
			context.fillRect (0, 0, WIDTH, HEIGHT);
			image = context.getImageData(0, 0, WIDTH, HEIGHT);
			data = image.data;
			buffer1 = [];
			buffer2 = [];
			setInterval(function(){
			if (isUserInteracting) {
				for (var i = 0; i < pointers.length; i++) {
					buffer1[ Math.floor(pointers[i][0]) + (Math.floor(pointers[i][1]) * WIDTH)] = 255;
				}
			}
			if($.effects.socketpointers){
				for (var i = 0; i < $.effects.socketpointers.length; i++) {
					buffer1[ Math.floor($.effects.socketpointers[i][0]) + (Math.floor($.effects.socketpointers[i][1]) * WIDTH)] = 255;
				}
			}
			var pixel;
			var iMax = (WIDTH * HEIGHT) - WIDTH;
			for (var i = WIDTH; i < iMax; i ++) {
				pixel = ((buffer1[i - 1] + buffer1[i + 1] + buffer1[i - WIDTH] + buffer1[i + WIDTH]) >> 1) - buffer2[i];
				pixel -= pixel >> 20;
				buffer2[i] = pixel;
				pixel = pixel > 255 ? 255 : pixel < 0 ? 0 : pixel;
				data[ (i * 4) + 1 ] = pixel;
				data[ ((i + 1) * 4) + 2 ] = pixel;
			}
			tempbuffer = buffer1;
			buffer1 = buffer2;
			buffer2 = tempbuffer;
			context.putImageData(image, 0, 0);
			}, 1000 / 60);
			for (var i = 0; i < SIZE; i ++) {
				buffer1[i] = 0;
				buffer2[i] = i > WIDTH && i < SIZE - WIDTH && Math.random() > 0.995 ? 255 : 0;
			}
		},
		_setOption: function( key, value ) {
			if ( key === "value" ) {
				value = _constrain( value );
			}
			_super( key, value );
		},
		_setOptions: function( options ) {
			_super( options );
			refresh();
		}
	});
})( jQuery );
$.whiteboard.socket().on("water",function(user,x,y){
	if(user!==$.whiteboard.userName)console.log(user);
	if(user!==$.whiteboard.userName)$.effects.socketpointers = [[x, y]];
});