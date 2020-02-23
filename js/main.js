
//
var geosquares = [];
// var elements = [];
var numsquares = 15;
var squaresize = 200;

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
	var config = generateConfig();
	return new GeoSquare(parent, squaresize, config);
}

//refreshes all
function refreshVis() {
	for (var i=0; i<geosquares.length; i=i+1){
		refreshOneVis(geosquares[i]);
	}
}

//gets a geosquare object as input
function refreshOneVis(square) {
    var config = generateConfig();
	square.updateShapes(config);
}

function randBetween(x, y) {
	var diff = y-x;
	return (Math.floor(Math.random() * diff) + x)
}

function randBool(){
	return (Math.random() < 0.5);
}

function randColor(){
	return '#'+(Math.random()*0xFFFFFF<<0).toString(16);
}

function generateConfig(){
    var newcolor_1 = randColor();
    var newcolor_2 = randColor();
    var newcolor_3 = randColor();

    var newcolor_4 = "";
    var newcolor_5 = "";

    if (randBool()){
    	newcolor_5 = randColor();
	}
	else{
		newcolor_5 = newcolor_3;
	}
	if (randBool()){
		newcolor_4 = randColor();
	}
	else{
		newcolor_4 = newcolor_2;
	}

    var newnum_a = randBetween(3,20);
    // var newnum_b = randBetween(3,15);

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

    //make the triangle arrays
    var ltbools = [];
    var ltvals = [];
    for (var i=0; i<4; i=i+1){
        ltbools.push(randBool());
        ltvals.push(randBetween(2, 10));
    }


    for (var i=0; i<numlevels; i=i+1) {
        numinlevels.push(randBetween(3, 8));
    }

    var circle_spacing = randBetween(2, 8);
    var circle_frac = (Math.random()/2)+0.5;
    var cboolmid = randBool();
    var cboolintersect = randBool();
    // var circle_scheme = randBetween(1, 4);

	var circle_schemes = []
	for (var i=0; i<4; i=i+1){
		circle_schemes.push(randBool());
	}

	var multilevel = true;
	if (newnum_a > 10){
		multilevel = false;
	}
	else if (newnum_a < 5){
		multilevel = true;
	}
	else {
		multilevel = randBool();
	}

	var multinum = randBetween(3,6);

	var transluce = 1;
	if (randBool()){
		transluce = (Math.random()/2)+ 0.25;
	}

    var config = {"color_1": newcolor_1,
	"color_2": newcolor_2,
	"color_3": newcolor_3,
	"color_4": newcolor_4,
		"color_5": newcolor_5,
	"newnum_a": newnum_a,
	"chaos_1": newchaos_1,
		"chaos_2": newchaos_2,
		"numlevels": numlevels,
		"numinlevels": numinlevels,
		"tbools": tbools,
		"tvals": tvals,
		"circle_spacing": circle_spacing,
		"circle_frac": circle_frac,
		"cboolmid": cboolmid,
		"cboolintersect": cboolintersect,
		"little_tvals": ltvals,
		"little_tbools": ltbools,
		"circle_schemes": circle_schemes,
		"multilevel": multilevel,
		"multinum": multinum,
		"translucency": transluce

	}

	return config;
}