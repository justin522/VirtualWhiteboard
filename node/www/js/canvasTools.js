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
	//ctx.scale(.425,.3);
	w = canvas.width;
	h = canvas.height;

	canvas.addEventListener("mousemove", function (e) {
		canvasDraw('move', e);
	}, false);
	canvas.addEventListener("mousedown", function (e) {
		canvasDraw('down', e);
	}, false);
	canvas.addEventListener("mouseup", function (e) {
		canvasDraw('up', e);
	}, false);
	canvas.addEventListener("mouseout", function (e) {
		canvasDraw('out', e);
	}, false);
}

function emitCanvasPoint(x,y) {
	var layer=$(canvas).attr("id");
	var data = JSON.stringify({user:userName,data:'canvas|'+layer+'|point|'+x+'|'+y+'|'+strokeColor+'|'+strokeWidth});
	socket.emit('drawing',data);
}
function canvasDrawPoint(layer,x,y,strokeColor,strokeWidth){
	canvas=$('#'+layer)[0];
	ctx=canvas.getContext("2d");
	ctx.beginPath();
	ctx.arc(x, y, strokeWidth/2, 0, 2 * Math.PI, false);
    ctx.fillStyle = strokeColor;
    ctx.fill();
	ctx.closePath();

}
function emitCanvasLine(x,y,x1,y1) {
	var layer=$(canvas).attr("id");
	var data = JSON.stringify({user:userName,data:'canvas|'+layer+'|line|'+x+'|'+y+'|'+x1+'|'+y1+'|'+strokeColor+'|'+strokeWidth});
	socket.emit('drawing',data);
}
function canvasDrawLine(layer,x,y,x1,y1,strokeColor,strokeWidth){
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
	ctx.stroke();
	ctx.closePath();
}
function canvasErase(x,y) {
	var layer=$(canvas).attr("id");
	var data = JSON.stringify({user:userName,data:'canvas|'+layer+'|point|'+x+'|'+y+'|white|'+strokeWidth});
	socket.emit('drawing',data);
}
function canvasClear() {
	var m = confirm("Want to clear");
	if (m) {
		ctx.clearRect(0, 0, w, h);
		document.getElementById("canvasimg").style.display = "none";
	}
}
function save() {
	document.getElementById("canvasimg").style.border = "2px solid";
	var dataURL = canvas.toDataURL();
	document.getElementById("canvasimg").src = dataURL;
	document.getElementById("canvasimg").style.display = "inline";
}

function canvasDraw(res, e) {
	var mousePos = getMousePosition(canvas, e);
	if (res == 'down') {
		flag = true;
		dot_flag = true;
		if (dot_flag) {
			prevX = currX;
			prevY = currY;
			currX = mousePos.x;
			currY = mousePos.y;
			emitCanvasPoint(currX,currY);
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
			if(Math.sqrt(Math.pow((currX-prevX),2)+Math.pow((currY-prevY),2))>strokeWidth/2){
				emitCanvasLine(prevX,prevY,currX,currY);
			}else emitCanvasPoint(currX,currY);
		}
	}
}
