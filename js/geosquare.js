

/*
 * StackedAreaChart - Object constructor function
 * @param _parentElement 	-- the HTML element in which to draw the visualization
 * @param _data						-- the  
 */

GeoSquare = function(_parentElement,
                     color_1, color_2, color_3, color_4,
                     numrowcol_a,
                     chaos_1, chaos_2,
                     size,
                     numlevels, numinlevels,
                     triangle_bools = [true, true, true, true],
                     triangle_values = [2, 4, 7, 5]){

	this.parentElement = _parentElement;
	this.color_1 = color_1;
	this.color_2 = color_2;
	this.color_3 = color_3;
	this.color_4 = color_4;

	this.size = size;

	this.triangle_bools = triangle_bools;
	this.triangle_values = triangle_values;

	this.num_levels = numlevels;
	this.num_in_levels = numinlevels;

	this.num_row = numrowcol_a;
	this.num_col = numrowcol_a;
	this.chaos_1 = chaos_1;
	this.chaos_2 = chaos_2;

    this.initVis();
}



/*
 * Initialize visualization (static content, e.g. SVG area or axes)
 */

GeoSquare.prototype.initVis = function(){
	var vis = this;

	var margins_all = vis.size * 0.02
	vis.margin = { top: margins_all, right: margins_all, bottom: margins_all, left: margins_all };

	vis.width = this.size - vis.margin.left - vis.margin.right,
    vis.height = this.size - vis.margin.top - vis.margin.bottom;


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
	vis.updateShapes(vis.color_1, vis.color_2, vis.color_3, vis.color_4,
        vis.num_row, vis.num_col, vis.chaos_1, vis.chaos_2, vis.num_levels, vis.num_in_levels,
        vis.triangle_bools, vis.triangle_values);
}


GeoSquare.prototype.updateShapes = function(newcolor1, newcolor2, newcolor3, newcolor4,
                                            numrow, numcol, newchaos_1, newchaos_2, numlevels,
                                            numinlevels, tbools, tvals){
	var vis = this;

	// remove all previous squares
	vis.svg.selectAll(".design-squares").remove();
	// remove all previous triangles
    vis.svg.selectAll(".triangles").remove();

	// update the parameters
	vis.color_1 = newcolor1;
	vis.color_2 = newcolor2;
	vis.color_3 = newcolor3;
	vis.num_row = numrow;
	vis.num_col = numcol;
	vis.chaos_1 = newchaos_1;
	vis.chaos_2 = newchaos_2;
	vis.num_levels = numlevels;
	vis.num_in_levels = numinlevels;
	vis.triangle_bools = tbools;
	vis.triangle_values = tvals;

    // console.log("vis:", vis);

    var square_width = vis.width / vis.num_col;
	var square_height = vis.height / vis.num_row;

	var count = 0;

	//if num_row is even then we have a lineup problem

	// iterate over rows and columns
    for (var c=0; c<vis.num_col; c=c+1){
        for (var r=0; r<vis.num_row; r=r+1){
            var xpos = c * square_width;
            var ypos = r * square_height;

            //pass in level parameters
            // console.log("about to call drawSquare with level:", vis.num_levels);

            vis.drawSquare(xpos, ypos, square_width, square_height,
                count, vis.num_levels);

            count = count + 1;
        }
    }
}

GeoSquare.prototype.drawSquare = function(x, y, w, h, count, level){
    var vis = this;

    // console.log("drawsquare called with level:", level);
    // console.log("vis.num_in_levels:", vis.num_in_levels);
    // console.log("vis:", vis);

    // if we are at the bottom level, go ahead and draw the square
    // ACCORDING to the rules
    if (level === 0){
        // console.log("here, level was 0");

        vis.svg.append("rect")
            .attr("height", w)
            .attr("width", h)
            .attr("x", x)
            .attr("y", y)
            .attr("class", "design-squares")
            .attr("fill", function(){
                if (count % vis.chaos_1 === 0){
                    return vis.color_3;
                }
                else if (count % vis.chaos_2 === 0){
                    return vis.color_4;
                }
                else if (count % 2 === 0){
                    return vis.color_1;
                }
                else{
                    return vis.color_2;
                }
            });

    //    append triangles if relevant
        for (var i=0; i<4; i=i+1){
            if (vis.triangle_bools[i]){
                vis.drawTriangle(i, x, y, w, h, count);
            }
        }

    }

    else{
        var new_width = w / vis.num_in_levels[level];
        var new_height = h / vis.num_in_levels[level];
    //    iterate through inner rows and columns and draw a square for each
        var count_again = 0;

        // console.log("vis.num_in_levels:", vis.num_in_levels, "level:", level,
        //     "vis.num_in_levels[level]:", vis.num_in_levels[level-1])

        for (var c=0; c<4; c=c+1){
            // console.log("in first for")
            for (var r=0; r<4; r=r+1){
                // console.log("in second for")
                var xpos = x + (c * new_width);
                var ypos = y + (r * new_height);

                //pass in level parameters
                vis.drawSquare(xpos, ypos, new_width, new_height,
                    count_again, level-1);

                count_again = count_again + 1;
            }
        }
    }

}


GeoSquare.prototype.drawTriangle = function(num, x, y, w, h, count){
    var vis = this;

    //    append a triangle each way
    var mypath = "";
    var mycolor = "";

    if (num===0){
        mypath = "M " + x + " " + y +
            " L " + x + " " + (y+h) +
            " L " + (x+h) + " " + (y+h) +
            " L " + x + " " + y;
        mycolor = vis.color_1;
    }
    else if (num===1){
        mypath = "M " + x + " " + y +
            " L " + (x+h) + " " + y +
            " L " + (x+h) + " " + (y+h) +
            " L " + x + " " + y;
        mycolor = vis.color_2;
    }
    else if (num===2){
        mypath = "M " + x + " " + y +
            " L " + (x+h) + " " + y +
            " L " + (x+h) + " " + (y+h) +
            " L " + x + " " + y;
        mycolor = vis.color_3;
    }
    else{
        mypath = "M " + (x+h) + " " + y +
            " L " + x + " " + y +
            " L " + x + " " + (y+h) +
            " L " + (x+h) + " " + y
        mycolor = vis.color_4
    }

    if (count % vis.triangle_values[num] === 0){
        vis.svg.append("path").attr("d", mypath)
            .attr("class", "triangles")
            .attr("fill", mycolor);
    }

    // if (count % 3 == 0){
    //     vis.svg.append("path")
    //         .attr("d",
    //             "M " + x + " " + y +
    //             " L " + x + " " + (y+h) +
    //             " L " + (x+h) + " " + (y+h) +
    //             " L " + x + " " + y
    //         )
    //         .attr("fill", vis.color_4)
    //
    // }
    //
    // //
    // if (count % 3 == 1){
    //     vis.svg.append("path")
    //         .attr("d",
    //             "M " + x + " " + y +
    //             " L " + (x+h) + " " + y +
    //             " L " + (x+h) + " " + (y+h) +
    //             " L " + x + " " + y
    //         )
    //         .attr("fill", vis.color_3)
    //
    // }
    // //    append a triangle every 3
    // if (count % 3 == 2){
    //     vis.svg.append("path")
    //         .attr("d",
    //             "M " + (x+h) + " " + y +
    //             " L " + (x+h) + " " + (y+h) +
    //             " L " + x + " " + (y+h) +
    //             " L " + (x+h) + " " + y
    //         )
    //         .attr("fill", vis.color_1)
    //
    // }
}