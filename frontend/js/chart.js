
function drawPieSlice(ctx,centerX, centerY, radius, startAngle, endAngle, fillColor, strokeColor) {
    ctx.save();
    ctx.fillStyle = fillColor;
    ctx.strokeStyle = strokeColor;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, radius, startAngle, endAngle, strokeColor);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
}

function drawArc(ctx, centerX, centerY, radius, startAngle, endAngle, color) {
	ctx.save();
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, startAngle, endAngle);
    ctx.stroke();
    ctx.restore();
}

function drawLine(ctx, startX, startY, endX, endY, color) {
	ctx.save();
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.moveTo(startX,startY);
    ctx.lineTo(endX,endY);
    ctx.stroke();
    ctx.restore();
}

function drawLegend(data, colors) {
    var pIndex = 0;
    var legend = document.querySelector("div[for='pie-chart']");
    var ul = document.createElement("ul");
    legend.append(ul);
    for (var ctg of Object.keys(data)) {
		var li = document.createElement("li");
		li.style.listStyle = "none";
		li.style.borderLeft = "20px solid " + colors[pIndex % colors.length];
		li.style.borderRadius = "5px";
		li.style.padding = "5px";
		li.style.margin = "15px";
		li.textContent = ctg;
		ul.append(li);
		pIndex++;
    }
}

function displayPieChart() {
	var pieCanvas = document.getElementById('pie-chart');
	
	pieCanvas.width = 200;
	pieCanvas.height = 200;

	var ctx = pieCanvas.getContext("2d");
	var data = {
		"Wins": 0,
		"Loses": 0
	};
	var colors = ["#80DEEA", "#FFE082", "#FFAB91", "#CE93D8"];
	var totalValue = [...Object.values(data)].reduce((a, b) => a + b, 0);
	var radius = Math.min(pieCanvas.width / 2, pieCanvas.height / 2);
	var colorIndex = 0;
	var startAngle = -Math.PI / 2;
	for (var categ in data) {
		var val = data[categ];
		var sliceAngle = (2 * Math.PI * val) / totalValue;
		drawPieSlice(ctx, pieCanvas.width / 2, pieCanvas.height / 2, radius, startAngle, startAngle + sliceAngle, colors[colorIndex % colors.length]);
		drawLine(ctx, pieCanvas.width / 2, pieCanvas.height / 2, pieCanvas.width / 2 + (radius * Math.cos(startAngle)), pieCanvas.height / 2 + (radius * Math.sin(startAngle)), "#000");
		startAngle += sliceAngle;
		colorIndex++;
	}
	drawArc(ctx, pieCanvas.width / 2, pieCanvas.height / 2, radius, 0, (Math.PI * 2), "#000");
	drawLegend(data, colors);
}