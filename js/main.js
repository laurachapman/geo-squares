
//
var geosquare;

createVis();

function createVis() {
	// generate parameters- numbers colors etc
	var color_1 = randColor();
	var color_2 = randColor();
	var color_3 = randColor();

	var numrowcol_a = randBetween(3,50);
	var chaos = randBetween(3, 10);

	geosquare = new GeoSquare("square-area", color_1, color_2, color_3,
		numrowcol_a, numrowcol_a, chaos);
}

function refreshVis() {
    var newcolor_1 = randColor();
    var newcolor_2 = randColor();
    var newcolor_3 = randColor();

    var newnum_a = randBetween(3,50);
    var newnum_b = randBetween(3,50);

    var newchaos = randBetween(3, 10);

	geosquare.updateShapes(newcolor_1, newcolor_2, newcolor_3, newnum_a, newnum_a,
		newchaos);
}

function randBetween(x, y) {
	var diff = y-x;
	return (Math.floor(Math.random() * diff) + x)
}

function randColor(){
	return '#'+(Math.random()*0xFFFFFF<<0).toString(16);
}