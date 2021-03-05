
function prepareMap() {
// this function reads the settings determining the looks of the map from the menus, and applies them

Projection = $("#Projection").val();

			if (Projection == "Albers") {
				projection = d3.geo.albers().center([ 10, 54 ]).rotate([ -3.5, 0 ]).parallels([ 50, 90 ]).scale(width * 1.45).translate([ width / 2, height / 2 ]);
			}; 
			if (Projection == "Lambert") {
//				projection = d3.geo.conicConformal().scale(1280).center([26, 60]).parallels([50, 90]);
//				projection = d3.geo.conicConformal().scale(1280).center([30, 60]).rotate([-0, 0]).parallels([50, 90]);
				projection = d3.geo.conicConformal().scale(1280).center([7, 60]).rotate([-10, 0]).parallels([50, 90]);
			};
			if (Projection == "Mercator") {
				projection = d3.geo.mercator().center([15, 58.5]).scale(1000);
			};
			
path = d3.geo.path().projection(projection);	
	
	
	// apply stored translation for map
	translate= $("#translate").val();
	//console.log("TRANSLATE STRING", typeof translate);
	if (typeof translate === 'string') {
		//console.log(d3.transform(translate));
	t = d3.transform(translate).translate;
	s = d3.transform(translate).scale;
	//console.log(s);
	zoommap.scale(s[0]);
	zoommap.translate(t);
	zoommap.event(mapg0);
	}


	// apply stored translation for positive legend
	translate= $("#poslegtranslate").val();
	//console.log("TRANSLATE STRING legend", typeof translate);
	if (typeof translate === 'string') {
	//console.log(d3.transform(translate));
	t = d3.transform(translate).translate;
	s = d3.transform(translate).scale;
	//console.log(s);
	zoomposlegend.scale(s[0]);
	zoomposlegend.translate(t);
	zoomposlegend.event(mapg0);
	}
	
	// apply stored translation for positive legend
	translate= $("#neglegtranslate").val();
	//console.log("TRANSLATE STRING legend", typeof translate);
	if (typeof translate === 'string') {
	//console.log(d3.transform(translate));
	t = d3.transform(translate).translate;
	s = d3.transform(translate).scale;
	//console.log(s);
	zoomneglegend.scale(s[0]);
	zoomneglegend.translate(t);
	zoomneglegend.event(mapg0);
	}
	
	
	
	
}






function readposneg() {
	
	
	
	// read individual cells in table
userposcutoffs = $("#poscutoffs").val();
usernegcutoffs = $("#negcutoffs").val();
console.log("userposlength", userposcutoffs.length);
console.log("userneglength", usernegcutoffs.length);


// first things in general... make sure the input is positive/negative, values are unique, and sorted

	negsteps = usernegcutoffs.split(",").map(function(item) {
	return parseFloat(item);
	});
	console.log("original negsteps", negsteps);
	negsteps = negsteps.filter(function(el) {
	return !isNaN(parseFloat(el)) && isFinite(el);
	});
	console.log("negsteps", negsteps);
	// make sure they are negative and sorted
	negsteps = negsteps.map(function(x) {
	return parseFloat(Math.abs(x) * (-1));
	});
	console.log("negsteps", negsteps);
	negsteps.sort(function(a, b) {
        return a - b
    });
	console.log("negsteps", negsteps);
	// remove duplicates
	negsteps = negsteps.filter(function(item, pos) {
    return negsteps.indexOf(item) == pos;
	});
	console.log("AAAAAAAAA");
	console.log("CLEANED negsteps", negsteps);
	// CLEANING THE POSITIVE VALUES
	possteps = userposcutoffs.split(",").map(function(item) {
	return parseFloat(item);
	});
	
//	//console.log("AAAAAAAAA");
//	//console.log("original possteps", possteps);
	possteps = possteps.filter(function(el) {
	return !isNaN(parseFloat(el)) && isFinite(el);
	});
	// make sure they are positive
	//console.log("posstepssss",possteps);
//	dsfds
	possteps = possteps.map(function(x) {
	return Math.abs(x); 
	});
	// make sure they are sorted
	possteps.sort(function(a, b) {
        return a - b
    });
	// remove duplicates
	possteps = possteps.filter(function(item, pos) {
    return possteps.indexOf(item) == pos;
	});
	
	var element = document.getElementById("poscutoffs");
	element.value = possteps;
	var element = document.getElementById("negcutoffs");
	element.value = negsteps;
	
	
	// finished basic cleaning;
	
	// if both user entry fields for custom are empty, assume a single category, spanning min-max for both postive and negative
	if (negsteps.length == 0 && possteps.length == 0) {
	if (negdomain.length > 0) {
	var element = document.getElementById("negcutoffs");
	element.value = [d3.min(negdomain)].concat([0]);
	negsteps = element.value;
	}
	if (posdomain.length > 0) {
	var element = document.getElementById("poscutoffs");
	element.value = [0].concat([d3.max(posdomain)]);
	possteps = element.value;
	}
	}
	
	// if the user fills in only one cutoff, attach 0
	if (negsteps.length == 1) {
	console.log("adding 0 to -")
	negsteps = negsteps.concat([0]);
	var element = document.getElementById("negcutoffs");
	element.value =  negsteps;
	}
	if (possteps.length == 1) {
	console.log("adding 0 to +")
	possteps = [0].concat(possteps);
	var element = document.getElementById("poscutoffs");
	element.value = possteps;
	}
	
		
		
	// if only one domain is filled in, assume the other domain is the same.
	console.log("neglength", negsteps.length);
	if (negsteps.length == 0 && possteps.length > 0) {
	negsteps = possteps;
	var element = document.getElementById("negcutoffs");
	element.value = possteps;
	console.log("filling in negatives", element.value);
	}
	
	if (possteps.length == 0 && negsteps.length > 0) {
	possteps = negsteps;
	var element = document.getElementById("poscutoffs");
	element.value = negsteps;
	console.log("filling in positives", element.value);
	}
	
	

	console.log("in READPOSNEG");
	console.log("pos", possteps);
	console.log("pos", possteps.length);

	console.log("NEGlength", negsteps);
	console.log("NEGlength", negsteps.length);

	

	
console.log("BBBBBBBB");
console.log("original posstepttttts", possteps);

	
	// update menu showing number of colors. if we need to add to the cutoffs below or above, this increases the number of colours.
	
// 	NEW, to keep legends consistent accross multiple variables. We never add to the cutoffs, we only replace the extrema if the data lies beyond the ones provided.	
	addp = 0;
	
	
	
	
	if (d3.min(posdomain)<d3.min(possteps)) {
		console.log("ZZZ");
		console.log("beforeshift",possteps);
		possteps.shift();
		console.log("beforeshift",possteps);
		possteps = [d3.min(posdomain)].concat(possteps);
		console.log("beforeshift",possteps);
	var element = document.getElementById("poscutoffs");
	element.value = possteps;
		//console.log("added one first");
//	addp++;
	}	
	if (d3.max(posdomain)>d3.max(possteps)) {
				console.log("ZZZUUU");
		//console.log("added one second");
		possteps.splice(-1);
		possteps = possteps.concat([d3.max(posdomain)]);
	var element = document.getElementById("poscutoffs");
	element.value = possteps;
//	addp++;
	}	
		
	console.log("original posstepssss", possteps);
	
	// check whether there are not too many cutoffs, if not, show the map
	if (possteps.length - 1  + addp < 10) {
	var element = document.getElementById("PosQuant");
	element.value = possteps.length - 1  + addp;	
	console.log("changed posquant to, addp", addp);
	}
	else {
	alert("provide less positive cutoffs!");
	console.log("possteps before correction", possteps);
	console.log("possteps before correction", 9-(possteps.length - 1 + addp));
	possteps.splice(9-(possteps.length - 1 + addp));
	var element = document.getElementById("poscutoffs");
	element.value = possteps;
	console.log("possteps after correction", possteps);
	}
	
	
	
	
	
	// NEGATIVE VALUES
	
	
	// read neg values
	var element = document.getElementById("groupingstyle");
	element.value = "custom"
	

	
	
	// update menu showing number of colors. if we need to add to the cutoffs below or above, this increases the number of colours.

	
	addn = 0;
	if (d3.min(negdomain)<d3.min(negsteps)) {
		console.log("beforeshift neg",negsteps);
		negsteps.shift();
		console.log("beforeshift neg",negsteps);
		negsteps = [d3.min(negdomain)].concat(negsteps);
		console.log("beforeshift neg",negsteps);
	var element = document.getElementById("negcutoffs");
	element.value = negsteps;
		//console.log("added one first");
//	addp++;
	}	
	if (d3.max(negdomain)>d3.max(negsteps)) {
		//console.log("added one second");
		negsteps.splice(-1);
		negsteps = negsteps.concat([d3.max(negdomain)]);
	var element = document.getElementById("negcutoffs");
	element.value = negsteps;
//	addp++;
	}	
	

	
	if (negsteps.length - 1 + addn < 10) {
	var element = document.getElementById("NegQuant");
	element.value = negsteps.length - 1 + addn;
}
	else {
	alert("provide less negative cutoffs! map not updated");
	negsteps.splice(9-(negsteps.length - 1 + addn ))
		}
		
	console.log("original negsteps2", negsteps);

	console.log("end read pos neg... cleaned steps:", [possteps,negsteps]);
	return [possteps,negsteps];
}





// preparedata reads in the variable selected, reads in the choices regarding grouping of regions, and prepares the arrays defining the cutoff points for coloring the map and the legend
function prepareData() {
	
// defines coldata, an object with key-value pairs
// domain, cleaned values
// posdomain, negdomain

// now introduce settings, object with key-value pairs for settings 

//console.log("test");



//    $("#variableList").val();

	coldata = {};
	regionnames = {};

    // read more data (region names, region properties,...)  and merge into array of data
		
    //console.log("AAA");
    // read from the dropdown menus
    colSelected = $("#variableList").val();
    NegQuantSelected = $("#NegQuant").val();
    NegColorSelected = $("#NegColor").val();
    PosQuantSelected = $("#PosQuant").val();
    PosColorSelected = $("#PosColor").val();

	legendfontsize = $("#legendfontsize").val();
	legendfontweight = $("#legendfontweight").val();
	legendorientation = $("#legendorientation").val();

	
	posadd = ($("#PosColor").val() == "Add"); 
	negadd = ($("#NegColor").val() == "Add");
	
	
    // menus/choices which do not exist on server. check for existence of function 'histogram' which only exists locally
    if (typeof histogram == 'function') {
        TimeSelected = $("#time").val(); // does not exist on server
        colSelected2 = $("#scattervars").val()
        StyleSelected = $("#groupingstyle").val()
	} else { // when on server make assumptions
        StyleSelected = "linear";
    };
    //console.log("beforedata");
    // get the data for the selected column
	
//	dataarray = [];

	//console.log("AA");
	//console.log("afterdata", data);
	
	// READ IN SETTINGS
	data.forEach(function(d) {
		// if the ID is length 4, the row corresponds to a region and contains hard data
		if (d.id.length < 6   && d.id.length != 0) {
        coldata[d.id] = d[colSelected];
//		dataarray.push({"id": d.id , "data" : d[colSelected]});
		} // else, the row contains a setting... but these settings are applied only if we are explictly switching to a new variable.
    });
	

	//console.log("AA");
	//console.log("afterdata", data);
	//console.log("AA");

    
	
	// we need the domain of the data, but without the duplicates, sorted, and split between positive/negative values
    domain1 = d3.values(coldata);
    domain = [];
	
	
	// unique
    $.each(domain1, function(i, el) {
        if ($.inArray(el, domain) === -1) {
            domain.push(el);
        }
    });
	// whatever input, try to interpret as number
    for (var i = 0; i < domain.length; i++) {
        domain[i] = +domain[i];
    }
	// sort
    domain.sort();
	
	console.log("sorted unique domain", domain);
	console.log(domain.indexOf(0));
	
    // we split the domain in two sets, with strictly negative and positive values, excluding 0 from either of them.
    negdomain = domain.filter(function(d) {
        return d < 0
    });
    posdomain = domain.filter(function(d) {
        return d > 0
    });
    // IF there was a 0 in the initial domain, we include it the domain which has most values, in case of a draw,
    // include in the positive domain (also if there are only 0's)
    if (domain.indexOf(0) > -1) {
        if (posdomain.length >= negdomain.length) {
            posdomain = posdomain.concat([ 0 ])
        } else {
            negdomain = negdomain.concat([ 0 ])
        };
    };
	// sort again
    posdomain.sort(function(a, b) {
        return a - b
    });
    negdomain.sort(function(a, b) {
        return a - b
    });
	
	
	// If 0 selected in pos or neg grouping, add neg to pos or vice-versa
	
	console.log("NEWDOMAINS");
	
	console.log(posdomain);
	console.log(negdomain);
	
	
	if($("#PosColor").val() == "Add") {
	negdomain = domain;
	posdomain = [];
	}
	if($("#NegColor").val() == "Add") {
	posdomain = domain;
	negdomain = [];
	}
	//console.log(posdomain);
	//console.log(negdomain);
	
	
	// BIG CHANGE: TO MAKE MAPS COMPARABLE, DON'T TRY TO ADJUST THE LEGEND, GROUPING, TO DATA PROPERTIES
//    NegQuantSelected = Math.min(NegQuantSelected, negdomain.length);
//    PosQuantSelected = Math.min(PosQuantSelected, posdomain.length);
    // end preparedata function
	
	
	
	
	
		
	//console.log("STARTING TO CREATE SCALES AND COLORS FOR MAP");
	//console.log("STARTING TO CREATE SCALES AND COLORS FOR MAP");
	//console.log("STARTING TO CREATE SCALES AND COLORS FOR MAP");
		
		
	
    // group the regions, we might want to add more options...
	// - create SCALES posscale and negscale
	// - for custom scales, provided cutoffs points for the scale which EXCLUDE the smallest and largest cutoffs
	// - for drawing the legends create arrays poscuts, negcuts, which include the cutuffs, including the value closest to 0
	// - for drawing the legends create arrays poscutsplus, negcutsplus, which include the cutuffs, including the value closest to 0, and including the largest(abs) values.
	


	
	//console.log("in drawmap");
    /// DEFINING COLOR-GROUPS
    console.log("in drawmap");
    var colors = [];
    colors = d3.map(colorbrewer);
    poscolors = d3.map(colors.get(PosColorSelected));
    negcolors = d3.map(colors.get(NegColorSelected));
    // for negative values, reverse the order of the colors (such that darker colors correspond to more smaller, more negative, values)
    negcolors = negcolors.get(NegQuantSelected);
    negcolors2 = negcolors.slice();
    negcolors2 = negcolors2.reverse();
    //console.log('poscolors: ',poscolors);
    //console.log('negcolors2: ',negcolors2);
    //console.log("in drawmap");
	
//console.log("StyleSelected",StyleSelected);

//console.log("posdomainnnnnnnnn",posdomain);
//console.log("negdomainnnnnnnnn",negdomain);
//console.log("negdomainnnnnnnnn", negdomain.length );

/*
	if (posdomain.length == 1) {
		posdomain.push(0);
	}
	if (negdomain.length == 1) {
		//console.log("negdomaioooooooooo",negdomain);
		negdomain.push(0);
				//console.log("negdomaioooooooooo",negdomain);
	}
//console.log("negdomainwwwn",negdomain);
*/

 switch (StyleSelected) {
		
		
		
    case "quantile" : 
	//console.log("posdomain",posdomain);
	//console.log("negdomain",negdomain);
    posscale = d3.scale.quantile().domain(posdomain).range(poscolors.get(PosQuantSelected));
    negscale = d3.scale.quantile().domain(negdomain).range(negcolors2);
    poscuts = [d3.min(posdomain)].concat(posscale.quantiles());
    negcuts = negscale.quantiles().concat(d3.max(negdomain));
	poscutsplus = poscuts.concat(d3.max(posdomain));
	negcutsplus = [d3.min(negdomain)].concat(negcuts);
	if (posdomain.length == 0) {poscuts = []; poscutsplus = [];}
	if (negdomain.length == 0) {negcuts = []; negcutsplus = [];}
	console.log("results quantile scale and cutoffs:")
	console.log("posscale:", posscale);
    console.log("negscale:", negscale);
    console.log("poscuts:", poscuts);
	console.log("poscutsplus:", poscutsplus);
	console.log("negcuts:", negcuts);   
	console.log("negcutsplus:", negcutsplus);
    break;
	
	
    case "linear" : 
	myposdomain = posdomain;
	mynegdomain = negdomain;
	// these quantize scales seem to have a bug, they cannot handle domains with zero length, so in case the domain is a single value, add/subtract tiny values and add it to the domain
	if (posdomain.length == 1) {
		myposdomain = posdomain.concat(d3.max(posdomain)+0.000000001);
		//console.log("myposdomain",myposdomain);
	}
	if (negdomain.length == 1) {
		mynegdomain = [(d3.min(negdomain)-0.000000001)].concat(negdomain)
		//console.log("mynegdomain",mynegdomain);
		// mynegdomain = negdomain.concat([0]);
	}
    console.log("mynegdomain",mynegdomain);
	posscale = d3.scale.quantize().domain([d3.min(posdomain),d3.max(myposdomain)]).range(poscolors.get(PosQuantSelected));
    negscale = d3.scale.quantize().domain([d3.min(mynegdomain),d3.max(mynegdomain)]).range(negcolors2);
    poscuts = [d3.min(posdomain)];
    negcuts = [d3.max(negdomain)];
    for(var i=1; i<PosQuantSelected; i++) { 				
    poscuts.push(d3.min(posdomain)+(d3.max(posdomain)-d3.min(posdomain))/PosQuantSelected*i)};
	// if there is only one element, we rather go from the max to 0.
    for(var i=1; i<NegQuantSelected; i++) { negcuts.push(d3.max(negdomain)-Math.abs(d3.max(negdomain)-d3.min(negdomain))/NegQuantSelected*i)};
    negcuts.reverse();
	poscutsplus = poscuts.concat(d3.max(posdomain));
	/// check this changed max into min
	negcutsplus = [d3.min(negdomain)].concat(negcuts);
	if (posdomain.length == 0) {poscuts = []; poscutsplus = [];}
	if (negdomain.length == 0) {negcuts = []; negcutsplus = [];}
	console.log("results linear scale and cutoffs:")
	console.log("posscale:", posscale);
    console.log("negscale:", negscale);
    console.log("poscuts:", poscuts);
	console.log("poscutsplus:", poscutsplus);
	console.log("negcuts:", negcuts);   
	console.log("negcutsplus:", negcutsplus);
	console.log("return for 0",posscale(0));
	break;
	
	
	// new, user provided cutoff series
	// our aim is to 
	case "custom" : 
	
	[possteps,negsteps] = readposneg();
	
	console.log("CUSTOM SCALE");
	console.log("read in cleaned possteps",possteps);
	console.log("read in cleaned negsteps",negsteps);
	
	// readposneg might have changed menus
	colSelected = $("#variableList").val();
    NegQuantSelected = $("#NegQuant").val();
    NegColorSelected = $("#NegColor").val();
    PosQuantSelected = $("#PosQuant").val();
    PosColorSelected = $("#PosColor").val();

	legendfontsize = $("#legendfontsize").val();
	legendfontweight = $("#legendfontweight").val();
	legendorientation = $("#legendorientation").val();
	
	console.log("in drawmap");
    var colors = [];
    colors = d3.map(colorbrewer);
    poscolors = d3.map(colors.get(PosColorSelected));
    negcolors = d3.map(colors.get(NegColorSelected));
    // for negative values, reverse the order of the colors (such that darker colors correspond to more smaller, more negative, values)
    negcolors = negcolors.get(NegQuantSelected);
    negcolors2 = negcolors.slice();
    negcolors2 = negcolors2.reverse();
    //console.log('poscolors: ',poscolors);
    //console.log('negcolors2: ',negcolors2);
    //console.log("in drawmap");
	
	
	//console.log("original possteps",possteps);

	
	//console.log("minposdomain", d3.min(posdomain));
	//console.log("maxnegdomain: ", d3.max(negdomain));
	
	largeststeppos = d3.max(possteps);
	smalleststeppos = d3.min(possteps);
	smalleststepneg = d3.min(negsteps);
    largeststepneg = d3.max(negsteps);
	
	
	//console.log(largeststeppos);
	//console.log(d3.max(posdomain));
	// if smallest/largest steps are smaller/larger than domain, drop them from list of steps... they will be added back later.
	if (largeststeppos >= d3.max(posdomain)) {possteps.splice(-1);}
	//console.log("possteps drop 1",possteps);
	if (smalleststeppos <= d3.min(posdomain)) {possteps.shift();}
	//console.log("possteps drop 1",possteps);
	if (smalleststepneg  <= d3.min(negdomain)) {negsteps.shift();}
	//console.log("negsteps drop 1",negsteps);
	if (largeststepneg >= d3.max(negdomain)) {negsteps.splice(-1);}
	//console.log("negsteps drop 1",negsteps);
	
	/*
	//this code drop irrelevant parts of user provided cutoffs... but this may make it impossible to compare maps
	// keep only steps smaller than maximum of domain
	possteps = possteps.filter(function(d) {
	 return d < d3.max(posdomain);
	});
	//console.log("possteps drop 1",possteps);
	// keep only steps larger than minimum of domain
	possteps = possteps.filter(function(d) {
	 return d > d3.min(posdomain);
	});
	//console.log("possteps drop 2",possteps);

	//console.log("original negsteps",negsteps);
	// keep only the negative steps which are larger than the minimum in the negative domain
	negsteps = negsteps.filter(function(d) {
	return d > d3.min(negdomain);
	});
	//console.log("negsteps drop 1",negsteps);
	// keep only the negative steps which are smaller than the maximum in the negative domain
	negsteps = negsteps.filter(function(d) {
	return d < d3.max(negdomain);
	});
	//console.log("negsteps drop 1",negsteps);	
	*/
	

	posscale = d3.scale.threshold().domain(possteps).range(poscolors.get(PosQuantSelected));
    negscale = d3.scale.threshold().domain(negsteps).range(negcolors2);
	
	// add back elements to poscuts and poscutsplus
	
	
	
	poscuts = [d3.min([d3.min(posdomain),smalleststeppos])].concat(possteps);
	poscutsplus = poscuts.concat(d3.max([d3.max(posdomain),largeststeppos]));
	negcuts = negsteps.concat(d3.max([d3.max(negdomain),largeststepneg]));
	negcutsplus = [d3.min([d3.min(negdomain),smalleststepneg])].concat(negcuts);

	// think carefully: we do not want the colors to be data-dependent, or we will not be able to make comparable maps, independent from data
	// what we do is to insist that the last value provided is the limit of the last bar. If the data goes beyond, we change the limit.
	/*
	if (d3.max(posdomain) > d3.max(poscuts)) {
	poscuts.splice(-1);
	poscutsplus.splice(-2);
	poscutsplus =  poscuts.concat(d3.max(posdomain));
	}
	*/
	
	console.log("results custom scale and cutoffs:")
	console.log("poscolors",poscolors.get(PosQuantSelected));
	console.log("negcolors",negcolors2);
    console.log("posscale:", posscale);
    console.log("negscale:", negscale);
    console.log("poscuts:", poscuts);
	console.log("poscutsplus:", poscutsplus);
    console.log("negcuts:", negcuts);
	console.log("negcutsplus:", negcutsplus);
    break;
	
	
	default: 
	// new, series of fixed steps chosen from menu
	var possteps = d3.range(0,+StyleSelected*PosQuantSelected,StyleSelected);
	// exclude 0 from "steps"
	possteps = possteps.slice(1,PosQuantSelected);
	//console.log("possteps",possteps);
	var negsteps = d3.range(0,+StyleSelected*NegQuantSelected,StyleSelected);
	//console.log("negsteps",negsteps);
	negsteps = negsteps.slice(1,NegQuantSelected);
	negsteps = negsteps.map(function(x) {
	return	x * (-1);
	});
	negsteps = negsteps.reverse();
    //console.log("negsteps",negsteps);
	// notice: the STEPS used for the scale do NOT contain 0, and do NOT contain the maximum
    posscale = d3.scale.threshold().domain(possteps).range(poscolors.get(PosQuantSelected));
    negscale = d3.scale.threshold().domain(negsteps).range(negcolors2);
	// notice: for poscuts 0 is added to the left... NEW; IF because NEGADD may be selected, WE ADD THE MINIUM OF THE DOMAIN, rather than strictly 0.
	poscuts = [d3.min([d3.min(posdomain),0])].concat(possteps);
	// notice: for poscutsplus, 0 is added to the left and the maximum to the right
	poscutsplus = poscuts.concat(d3.max([d3.max(posdomain),+StyleSelected*PosQuantSelected]));
	// DONT WE NEED TO ADD THE MAXIMUM, MOST NEGATIVE VALUE, HERE?
	negcuts = negsteps.concat([d3.max([d3.max(negdomain),-0.00000])]);
	//negcuts = negsteps.concat([-0.00000000]);
	negcutsplus = [d3.min([d3.min(negdomain),(-1)*+StyleSelected*NegQuantSelected])].concat(negcuts);
	console.log("RESULT fixed-step scale and cutoffs:")
    console.log("posscale:", posscale);
    console.log("negscale:", negscale);
    console.log("poscuts:", poscuts);
	console.log("poscutsplus:", poscutsplus);
    console.log("negcuts:", negcuts);
	console.log("negcutsplus:", negcutsplus);
//	StyleSelected = "steps";
	break;
 }
    
    // whatever the chosen grouping
	// in case there are only as many different observations as the number of groups to be displayed, the colors should match the observations
	// HAS BEEN REMOVED TO ASSURE YOU CAN DRAW EXACTLY THE SAME COLORING FOR DIFFERENT MAPS
	/*
    if (posdomain.length == PosQuantSelected) {
    posscale = d3.scale.ordinal().domain(posdomain).range(poscolors.get(PosQuantSelected));
    poscuts = posdomain;             
    };
    if (negdomain.length == NegQuantSelected) {
    negscale = d3.scale.ordinal().domain(negdomain).range(negcolors2);
    negcuts = negdomain;
    };
    */
	
    colors = poscolors.get(PosQuantSelected);
    poscolors = poscolors.get(PosQuantSelected);
    
};

poschecked =  document.getElementById('poscheck').checked;
negchecked =  document.getElementById('negcheck').checked;

function getcolor(m){
//	//console.log("mmmm", m);
	
	//console.log(m);
    // return colors depending on value
    // zero gets its color from positive or negative colorset, depending on which has the most values
    // display gray-ish in case of missing data
    if (m === '') { return "none" }
    if (m == 'NA') { return "none" }
    if (+m == 0) { 
    if (negdomain.length>posdomain.length) {if (negchecked == true) {return negscale(+m)} else {return "white"}};
    if (negdomain.length<posdomain.length) {if (poschecked == true) {return posscale(+m)} else {return "white"}};
    if (negdomain.length==posdomain.length) {return "white"};
    }
    // for other numbers, look up the value in positive or negative colorset, depending on the value
    if ((+m > 0 && m != "" && !posadd) || (negadd && +m < 0 )) { if (poschecked == true) {return posscale(+m)} else {return "white"} }
    if ((+m < 0 && m != "" && !negadd) || (posadd && +m > 0 )) { if (negchecked == true) {return negscale(+m)} else {return "white"} }
	// if you end up here, display black, something went wrong
    if (typeof m == 'undefined') { return "none" }
    return "none";
};


// populate drop down menu for variable selection
function populateVariablesList(data) {
    $("#variableList").empty();
	
	// exclude empty data from menu
	
	bla = [];
	data.forEach(function(d) {
		bla += d;
	});
	console.log("test",data);
	
    variables = d3.keys(data[1]);
    variables.shift();
    var items = "";
    $.each(variables, function() {
        items += "<option value=" + "'" + this + "'" + ">" + this + "</option>";
    });
    $("#variableList").html(items);
}

function myround(num) {
	
	if (document.getElementById('legend100').checked == true & document.getElementById('legendpercentage').checked == false )
	{
	num = 100*num;
	}		
	
	if (legenddecimals=="auto") {
	if (document.getElementById('legendpercentage').checked == false ) {
    var round0 = d3.format(".0f"), round1 = d3.format(".1f"), round2 = d3.format(".2f"), round3 = d3.format(".3f");	
	} else {
	if (document.getElementById('legend100').checked == false) {
	num=num/100;
	}
	var round0 = d3.format(".0%"), round1 = d3.format(".0%"), round2 = d3.format(".0%"), round3 = d3.format(".1%");
	}
	} else {
	if (document.getElementById('legendpercentage').checked == false ) {
    var round0 = d3.format("." + legenddecimals + "f"), round1 = d3.format("." + legenddecimals + "f"), round2 = d3.format("." + legenddecimals + "f"), round3 = d3.format("." + legenddecimals + "f");	
	} else {
	if (document.getElementById('legend100').checked == false) {
	num=num/100;
	}
	var round0 = d3.format("." + legenddecimals + "%"), round1 = d3.format("." + legenddecimals + "%"), round2 =  d3.format("." + legenddecimals + "%"), round3 =  d3.format("." + legenddecimals + "%");
	}			
	}
	
	
	//,  round4 = d3.format(".3f"),  round00 = d3.format(".0f");
	if (Math.abs(num) >= 1000) {
        return round0(num)
    };
    if ((Math.abs(num) < 1000) * (Math.abs(num) >= 100)) {
        return round1(num)
    };
    if ((Math.abs(num) < 100) * (Math.abs(num) >= 10)) {
        return round2(num)
    };
	if ((Math.abs(num) < 10) * (Math.abs(num) >= 0.01)) {
        return round3(num)
    };
    if ((Math.abs(num) < 0.01) * (Math.abs(num) >= 0.001)){
        return round3(num)
    };
	
	if ((Math.abs(num) < 0.001) * (Math.abs(num) > 0)) {
		
		if (document.getElementById('legendpercentage').checked == false ) {
		var number = parseFloat(num);
        return number.toExponential(1); 
		} else 
	    {
		return round3(num);
		};
		//round0(num)
	};
	
	
	if (Math.abs(num) === 0) {
	    return round3(num); 
	};
 };



function nodecimals(num) {
    var round3 = d3.format(".0f");
        return round3(num)
};




	
