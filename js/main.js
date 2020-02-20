
//
var geosquares = [];
// var elements = [];
var numsquares = 15;

var masterparent = document.getElementById("square-parent");

for (var i=1; i<(numsquares + 1); i=i+1){
	var newsquare = document.createElement("div");
	newsquare.setAttribute("id", "square-" + i);

	masterparent.appendChild(newsquare);

	var newgeo = createVis("square-" + i);
	// newsquare.setAttribute("onclick", "refreshOneVis(newgeo)")


	geosquares.push(newgeo);
	// elements.push(newsquare);
}

function createVis(parent) {
	// generate parameters- numbers colors etc
	var color_1 = randColor();
	var color_2 = randColor();
	var color_3 = randColor();
	var color_4 = randColor();

	var numrowcol_a = randBetween(3,15);
	var chaos_1 = randBetween(3, 8);
	var chaos_2 = randBetween(3,8);

	// var numlevels = randBetween(0, 3);
	var numlevels = 0
	var numinlevels = [];

	//make the triangle arrays
	var tbools = [];
	var tvals = [];
	for (var i=0; i<4; i=i+1){
		tbools.push(randBool());
		tvals.push(randBetween(2, 10));
	}

	for (var i=0; i<numlevels; i=i+1){
		numinlevels.push(randBetween(3,8));
	}

	return new GeoSquare(parent, color_1, color_2, color_3, color_4,
		numrowcol_a, chaos_1, chaos_2, 200, numlevels, numinlevels,
		tbools, tvals);
}

//refreshes all
function refreshVis() {
	for (var i=0; i<geosquares.length; i=i+1){
		refreshOneVis(geosquares[i]);
	}
}

//gets a geosquare object as input
function refreshOneVis(square) {
    var newcolor_1 = randColor();
    var newcolor_2 = randColor();
    var newcolor_3 = randColor();
    var newcolor_4 = randColor();

    var newnum_a = randBetween(3,15);
    var newnum_b = randBetween(3,15);

    var newchaos_1 = randBetween(3, 8);
    var newchaos_2 = randBetween(3,8);

    // var numlevels = randBetween(0,3);
	var numlevels = 0;
    var numinlevels = [];

    for (var i=0; i<numlevels; i=i+1){
        numinlevels.push(randBetween(3,8));
    }
    //make the triangle arrays
    var tbools = [];
    var tvals = [];
    for (var i=0; i<4; i=i+1){
        tbools.push(randBool());
        tvals.push(randBetween(2, 10));
    }

    for (var i=0; i<numlevels; i=i+1) {
        numinlevels.push(randBetween(3, 8));
    }

	square.updateShapes(newcolor_1, newcolor_2, newcolor_3, newcolor_4,
		newnum_a, newnum_a,
		newchaos_1, newchaos_2, numlevels, numinlevels,
		tbools, tvals);
}

function randBetween(x, y) {
	var diff = y-x;
	return (Math.floor(Math.random() * diff) + x)
}

function randBool(){
	return (Math.random() < 0.6);
}

function randColor(){
	return '#'+(Math.random()*0xFFFFFF<<0).toString(16);
}