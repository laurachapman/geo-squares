

/*
 * StackedAreaChart - Object constructor function
 * @param _parentElement 	-- the HTML element in which to draw the visualization
 * @param _data						-- the  
 */

GeoSquare = function(_parentElement, color_1, color_2, color_3, numrowcol_a, chaos){
	this.parentElement = _parentElement;
	this.color_1 = color_1;
	this.color_2 = color_2;
	this.color_3 = color_3;
	this.num_levels = 2;

	this.num_row = numrowcol_a;
	this.num_col = numrowcol_a;
	this.chaos = chaos;

    this.initVis();
}



/*
 * Initialize visualization (static content, e.g. SVG area or axes)
 */

GeoSquare.prototype.initVis = function(){
	var vis = this;

	vis.margin = { top: 20, right: 20, bottom: 20, left: 20 };

	vis.width = 600 - vis.margin.left - vis.margin.right,
    vis.height = 600 - vis.margin.top - vis.margin.bottom;


  // SVG drawing area
	vis.svg = d3.select("#" + vis.parentElement).append("svg")
	    .attr("width", vis.width + vis.margin.left + vis.margin.right)
	    .attr("height", vis.height + vis.margin.top + vis.margin.bottom);

	// add black border
    vis.svg.append("rect")
        .attr("width", vis.width + vis.margin.left + vis.margin.right)
        .attr("height", vis.height + vis.margin.top + vis.margin.left)
        .attr("fill", "black");

	vis.svg = vis.svg.append("g")
	    .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

	// draw the shapes
	vis.updateShapes(vis.color_1, vis.color_2, vis.color_3,
        vis.num_row, vis.num_col);
}


/*
 * The drawing function - should use the D3 update sequence (enter, update, exit)
 * Function parameters only needed if different kinds of updates are needed
 */

GeoSquare.prototype.updateShapes = function(newcolor1, newcolor2, newcolor3,
                                            numrow, numcol, newchaos){
	var vis = this;

	vis.svg.selectAll(".design-squares").remove();

	vis.color_1 = newcolor1;
	vis.color_2 = newcolor2;
	vis.color_3 = newcolor3;
	vis.num_row = numrow;
	vis.num_col = numcol;
	vis.chaos = newchaos;

	console.log("num col:", vis.num_col, "num row:", vis.num_row);

    vis.squarewidth = vis.width / vis.num_col;
	vis.squareheight = vis.height / vis.num_row;

	var count = 0;

	//if num_row is even then we have a lineup problem

	// iterate over rows and columns
    for (var c=0; c<vis.num_col; c++){
        for (var r=0; r<vis.num_row; r++){
            var xpos = c*vis.squarewidth;
            var ypos = r*vis.squareheight;

            //pass in level parameters
            vis.drawSquare(xpos, ypos, count);

            count = count + 1;
        }
    }
}

GeoSquare.prototype.drawSquare = function(x, y, count){
    var vis = this;

    vis.svg.append("rect")
        .attr("height", vis.squareheight)
        .attr("width", vis.squarewidth)
        .attr("x", x)
        .attr("y", y)
        .attr("class", "design-squares")
        .attr("fill", function(){
            if (count % vis.chaos === 0){
                return vis.color_3;
            }
            else if (count % 2 === 0){
                return vis.color_1;
            }
            else{
                return vis.color_2;
            }
        });
}