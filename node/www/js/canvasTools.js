var canvas, ctx, flag = false,
	prevX = 0,
	currX = 0,
	prevY = 0,
	currY = 0,
	dot_flag = false;

var strokeColor = "black",fillColor="black",strokeWidth = 1;

function initCanvas() {
	canvas = document.getElementById('canvas0');
	ctx = canvas.getContext("2d");
	ctx.scale(.425,.3);
	w = canvas.width;
	h = canvas.height;

	canvas.addEventListener("mousemove", function (e) {
		findxy('move', e);
	}, false);
	canvas.addEventListener("mousedown", function (e) {
		findxy('down', e);
	}, false);
	canvas.addEventListener("mouseup", function (e) {
		findxy('up', e);
	}, false);
	canvas.addEventListener("mouseout", function (e) {
		findxy('out', e);
	}, false);
}

function emitCanvasDraw() {
	//alert('draw');
	//var data = JSON.stringify({user:'user',type:'type',layer:'layer',prevX:prevX,prevY:prevY,currX:currX,currY:currY,strokeColor:strokeColor,strokeWidth:strokeWidth});
	var layer=$(canvas).attr("id");
	var data = JSON.stringify({user:userName,data:'canvas|'+layer+'|'+prevX+'|'+prevY+'|'+currX+'|'+currY+'|'+strokeColor+'|'+strokeWidth});
	socket.emit('drawing',data);
	/*ctx.beginPath();
	ctx.moveTo(prevX, prevY);
	ctx.lineTo(currX, currY);
	ctx.strokeStyle = strokeColor;
	ctx.lineWidth = strokeWidth;
	ctx.stroke();
	ctx.closePath();*/
}

function erase() {
	var m = confirm("Want to clear");
	if (m) {
		ctx.clearRect(0, 0, w, h);
		document.getElementById("canvasimg").style.display = "none";
	}
}
function canvasDraw(layer,prevX,prevY,currX,currY,strokeColor,strokeWidth){
	console.log(strokeColor);
	canvas=$('#'+layer)[0];
	ctx=canvas.getContext("2d");
	ctx.beginPath();
	ctx.moveTo(prevX, prevY);
	ctx.lineTo(currX, currY);
	ctx.strokeStyle = strokeColor;
	ctx.lineWidth = strokeWidth;
	ctx.stroke();
	ctx.closePath();

}
function save() {
	document.getElementById("canvasimg").style.border = "2px solid";
	var dataURL = canvas.toDataURL();
	document.getElementById("canvasimg").src = dataURL;
	document.getElementById("canvasimg").style.display = "inline";
}


      function getMousePos(canvas, e) {
        var rect = canvas.getBoundingClientRect();
        return {
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        };
      }

function findxy(res, e) {
	var mousePos = getMousePos(canvas, e);
	if (res == 'down') {
		console.log(mousePos.x);
		prevX = currX;
		prevY = currY;
		currX = mousePos.x;
		currY = mousePos.y;

		flag = true;
		dot_flag = true;
		if (dot_flag) {
			ctx.beginPath();
			ctx.fillStyle = fillColor;
			ctx.fillRect(currX, currY, 2, 2);
			ctx.closePath();
			dot_flag = false;
		}
	}
	if (res == 'up' || res == "out") {
		flag = false;
	}
	if (res == 'move') {
		if (flag) {
			prevX = currX;
			prevY = currY;
			currX = mousePos.x;
			currY = mousePos.y;
			emitCanvasDraw();
		}
	}
}
