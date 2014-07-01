
function fpsGraph(){
	this.createGraph = function(){
		var w = 10;
		var h = 30;
		var data = new Array();
		data.length = 10;
		for(var i=0;i<10;i++){
			data[i] = {value:Math.random()*10};
		}
		var chart = d3.select("body").append("svg")
			.attr("class", "chart")
		    .attr("width", w * data.length - 1)
		    .attr("height", h);
		chart.selectAll("rect")
		    .data(data)
		    .enter().append("rect")
		    	.attr("x", function(d, i) { return x(i) - .5; })
		    	.attr("y", function(d) { return h - y(d.value) - .5; })
		    	.attr("width", w)
		    	.attr("height", function(d) { return y(d.value); });
	}
	//this.createGraph();
}