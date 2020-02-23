

/*
 * StackedAreaChart - Object constructor function
 * @param _parentElement 	-- the HTML element in which to draw the visualization
 * @param _data						-- the  
 */

GeoSquare = function(_parentElement, size, config){

	this.parentElement = _parentElement;
	this.size = size;
	this.config = config;

    this.num_row = config["newnum_a"];
    this.num_col = config["newnum_a"];

    this.multilevel = config["multilevel"];
    this.multinum = config["multinum"];

	this.initVis();
}


GeoSquare.prototype.setConfigs = function(config){
    var vis = this;

    vis.color_1 = config["color_1"];
    vis.color_2 = config["color_2"];
    vis.color_3 = config["color_3"];
    vis.color_4 = config["color_4"];
    vis.color_5 = config["color_5"];

    vis.triangle_bools = config["tbools"];
    vis.triangle_values = config["tvals"];

    vis.num_levels = config["numlevels"];
    vis.num_in_levels = config["num_in_levels"];

    vis.num_row = config["newnum_a"];
    vis.num_col = config["newnum_a"];
    vis.chaos_1 = config["chaos_1"];
    vis.chaos_2 = config["chaos_2"];

    vis.circle_spacing = config["circle_spacing"];
    vis.circle_frac = config["circle_frac"];

    vis.cboolmid = config["cboolmid"];
    vis.cboolintersect = config["cboolintersect"];
    vis.circle_schemes = config["circle_schemes"];

    vis.little_tbools = config["little_tbools"];
    vis.little_tvals = config["little_tvals"];

    vis.multilevel = config["multilevel"];
    vis.multinum = config["multinum"];

    vis.trans = config["translucency"];

    vis.config = config;

}

/*
 * Initialize visualization (static content, e.g. SVG area or axes)
 */

GeoSquare.prototype.initVis = function(){
	var vis = this;

    // SVG drawing area
    vis.svg_canvas = d3.select("#" + vis.parentElement).append("svg")
        .attr("id", "mysvg")
        .attr("width", vis.size)
        .attr("height", vis.size);

	// draw the shapes
	vis.updateShapes(vis.config);
}


GeoSquare.prototype.updateShapes = function(config){
	var vis = this;
	console.log("in updateshapes")

	// remove all previous squares
	vis.svg_canvas.selectAll(".design-squares").remove();
	// remove all previous triangles
    vis.svg_canvas.selectAll(".triangles").remove();
    //remove all previous circles
    vis.svg_canvas.selectAll(".circles").remove();
    // remove previous border
    vis.svg_canvas.selectAll(".border").remove();

    // remove the previous svg
    // d3.select("#mysvg").remove();

    // update the parameters
    vis.setConfigs(config);

    var margins_all = vis.size * 0.02;

    if (vis.multinum) {
        var design_space = (vis.multinum * vis.num_row)*(Math.floor(vis.size / (vis.multinum * vis.num_row)));
        margins_all = (vis.size - design_space) * 0.5;
    }
    else{
        var design_space = vis.num_row * (Math.floor(vis.size / vis.num_row));
        margins_all = (vis.size-design_space) * 0.5;
    }

    vis.margin = { top: margins_all, right: margins_all, bottom: margins_all, left: margins_all };

    vis.width = vis.size - vis.margin.left - vis.margin.right,
        vis.height = vis.size - vis.margin.top - vis.margin.bottom;

    // add colored border
    vis.svg_canvas.append("rect")
        .attr("width", vis.width + vis.margin.left + vis.margin.right)
        .attr("height", vis.height + vis.margin.top + vis.margin.left)
        .attr("class", "border")
        .attr("fill", vis.color_1);

    vis.svg = vis.svg_canvas.append("g")
        .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

	// if vis.multilevel, then do all of this for each megarow megacolumn (default 3)
    if (vis.multilevel){
        var square_width = Math.floor(vis.width / (vis.multinum * vis.num_col));
        var square_height = Math.floor(vis.width / (vis.multinum * vis.num_row));

        var bigsquare_width = square_width * vis.num_col;
        var bigsquare_height = square_width * vis.num_row;

        for (var bc=0; bc<vis.multinum; bc = bc+1){
            for (var br=0; br<vis.multinum; br = br+1){

                var count = 0;

                // iterate over rows and columns
                for (var c=0; c<vis.num_col; c=c+1){
                    for (var r=0; r<vis.num_row; r=r+1){
                        var xpos = c * square_width;
                        var ypos = r * square_height;

                        vis.drawSquare(xpos + (bc * bigsquare_height),
                            ypos + (br * bigsquare_width), square_width, square_height,
                            count, vis.num_levels, c, r);

                        count = count + 1;
                    }
                }
            }
        }
    }

    else{
        var square_width = Math.floor(vis.width / vis.num_col);
        var square_height = Math.floor(vis.height / vis.num_row);

        var count = 0;


        // iterate over rows and columns
        for (var c=0; c<vis.num_col; c=c+1){
            for (var r=0; r<vis.num_row; r=r+1){
                var xpos = c * square_width;
                var ypos = r * square_height;

                vis.drawSquare(xpos, ypos, square_width, square_height,
                    count, vis.num_levels, c, r);

                count = count + 1;
            }
        }
    }
}

GeoSquare.prototype.drawSquare = function(x, y, w, h, count, level, c, r){
    var vis = this;

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

        for (var i=0; i<4; i=i+1){
            if (vis.little_tbools[i]){
                vis.drawLittleTriangle(i, x, y, w, h, count);
            }
        }

        // these circles look shitty
        // if(vis.cboolmid) {
        //     //    append circle if count mod spacing is 2
        //     if (count % vis.circle_spacing === 2){
        //         vis.drawMidCircle(x, y, w/2, count);
        //     }
        // }

        // console.log("c:", c, "r:", r, "circle_spacing:", vis.circle_spacing);
        if(vis.cboolintersect) {
            if (vis.circle_schemes[0]){
                if ((c*r-r) % vis.circle_spacing === 0){
                    if (c > 0 && r > 0){
                        vis.drawXCircle(x, y, w/2, vis.color_3);
                    }
                }
            }
            if (vis.circle_schemes[1]){
                if (c+r % vis.circle_spacing === 0){
                    if (c > 0 && r > 0){
                        vis.drawXCircle(x, y, w/2, vis.color_5);
                    }
                }
            }
            if (vis.circle_schemes[2]) {
                if (count % vis.circle_spacing === 0){
                    if (c > 0 && r > 0){
                        vis.drawXCircle(x, y, w/2, vis.color_4);
                    }
                }
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


GeoSquare.prototype.drawLittleTriangle = function(num, x, y, w, h, count){
    var vis = this;

    //    append a triangle each way
    var mypath = "";
    var mycolor = "";

    // four different orientations of triangles
    if (num===0){
        //top
        mypath = "M " + x + " " + y +
            " L " + (x+(h/2)) + " " + (y+(h/2)) +
            " L " + (x+h) + " " + y +
            " L " + x + " " + y;
        mycolor = vis.color_5;
    }
    else if (num===1){
        // left
        mypath = "M " + x + " " + y +
            " L " + (x+(h/2)) + " " + (y+(h/2)) +
            " L " + (x+h) + " " + y +
            " L " + x + " " + y;
        mycolor = vis.color_3;
    }
    else if (num===2){
        //bottom
        mypath = "M " + x + " " + (y+h) +
            " L " + (x+(h/2)) + " " + (y+(h/2)) +
            " L " + (x+h) + " " + (y+h) +
            " L " + x + " " + (y+h);
        mycolor = vis.color_1;
    }
    else{
        //right
        mypath = "M " + (x+h) + " " + y +
            " L " + (x+h) + " " + (y+h) +
            " L " + (x+(h/2)) + " " + (y+(h/2)) +
            " L " + (x+h) + " " + y
        mycolor = vis.color_4;
    }

    if (count % vis.little_tvals[num] === 0){
        vis.svg.append("path").attr("d", mypath)
            .attr("class", "triangles")
            .attr("fill", mycolor)
            .attr("opacity", vis.trans);
    }

}

// x and y should be the top left corner where the circle is to be drawn
// r is the radius (half width of surrounding square)
GeoSquare.prototype.drawXCircle = function(x, y, r, color){
    var vis = this;

    vis.svg.append("circle")
        .attr("r", r * vis.circle_frac)
        .attr("cx", x)
        .attr("cy", y)
        .attr("class", "circles")
        .attr("fill", color)
        .attr("opacity", vis.trans);
}

// x and y should be the top left corner where the circle is to be drawn
// r is the radius (half width of surrounding square)
GeoSquare.prototype.drawMidCircle = function(x, y, r, count){
    var vis = this;

    vis.svg.append("circle")
        .attr("r", r * vis.circle_frac)
        .attr("cx", x+r)
        .attr("cy", y+r)
        .attr("class", "circles")
        .attr("fill", function(count){
            //make this more sophistocated and randomized
            if (count % 3 === 0){
                return vis.color_4;
            }
            else{
                return vis.color_5;
            }
        });
}


GeoSquare.prototype.drawTriangle = function(num, x, y, w, h, count){
    var vis = this;

    //    append a triangle each way
    var mypath = "";
    var mycolor = "";

    // four different orientations of triangles
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
        mycolor = vis.color_5;
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
            .attr("fill", mycolor)
            .attr("opacity", vis.trans);
    }
}