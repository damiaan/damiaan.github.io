

// Create Base64 Object for encoding the png images in IE 9 and below
var Base64 = {
    _keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
    encode : function(e) {
        var t = "";
        var n, r, i, s, o, u, a;
        var f = 0;
        e = Base64._utf8_encode(e);
        while (f < e.length) {
            n = e.charCodeAt(f++);
            r = e.charCodeAt(f++);
            i = e.charCodeAt(f++);
            s = n >> 2;
            o = (n & 3) << 4 | r >> 4;
            u = (r & 15) << 2 | i >> 6;
            a = i & 63;
            if (isNaN(r)) {
                u = a = 64;
            } else if (isNaN(i)) {
                a = 64;
            }
            t = t + this._keyStr.charAt(s) + this._keyStr.charAt(o) + this._keyStr.charAt(u) + this._keyStr.charAt(a);
        }
        return t;
    },
    decode : function(e) {
        var t = "";
        var n, r, i;
        var s, o, u, a;
        var f = 0;
        e = e.replace(/[^A-Za-z0-9\+\/\=]/g, "");
        while (f < e.length) {
            s = this._keyStr.indexOf(e.charAt(f++));
            o = this._keyStr.indexOf(e.charAt(f++));
            u = this._keyStr.indexOf(e.charAt(f++));
            a = this._keyStr.indexOf(e.charAt(f++));
            n = s << 2 | o >> 4;
            r = (o & 15) << 4 | u >> 2;
            i = (u & 3) << 6 | a;
            t = t + String.fromCharCode(n);
            if (u != 64) {
                t = t + String.fromCharCode(r);
            }
            if (a != 64) {
                t = t + String.fromCharCode(i);
            }
        }
        t = Base64._utf8_decode(t);
        return t;
    },
    _utf8_encode : function(e) {
        e = e.replace(/\r\n/g, "\n");
        var t = "";
        for (var n = 0; n < e.length; n++) {
            var r = e.charCodeAt(n);
            if (r < 128) {
                t += String.fromCharCode(r);
            } else if (r > 127 && r < 2048) {
                t += String.fromCharCode(r >> 6 | 192);
                t += String.fromCharCode(r & 63 | 128);
            } else {
                t += String.fromCharCode(r >> 12 | 224);
                t += String.fromCharCode(r >> 6 & 63 | 128);
                t += String.fromCharCode(r & 63 | 128);
            }
        }
        return t;
    },
    _utf8_decode : function(e) {
        var t = "";
        var n = 0;
        var r = c1 = c2 = 0;
        while (n < e.length) {
            r = e.charCodeAt(n);
            if (r < 128) {
                t += String.fromCharCode(r);
                n++;
            } else if (r > 191 && r < 224) {
                c2 = e.charCodeAt(n + 1);
                t += String.fromCharCode((r & 31) << 6 | c2 & 63);
                n += 2;
            } else {
                c2 = e.charCodeAt(n + 1);
                c3 = e.charCodeAt(n + 2);
                t += String.fromCharCode((r & 15) << 12 | (c2 & 63) << 6 | c3 & 63);
                n += 3;
            }
        }
        return t;
    }
};




function createMap(downloadUrl, nutsUrl, nutsUrl2) {
	
if (typeof delimiter == "undefined") {delimiter = ","};
//console.log("delimiter", delimiter);
var dsv = d3.dsv(delimiter, "text/plain");
queue().defer(dsv, downloadUrl).await(ready);
	
function ready(error,  _data) {
	
     data = _data;

	// try to guess delimiter from what is found in _data
	//console.log("TESTDATA",data);
	//console.log("TESTDATA",Object.keys(data[1]));
	//console.log("TESTDATA",Object.keys(data[1]).length);
	//console.log("TESTDATA",Object.keys(data[1])[0]);
	//console.log("TESTDATA",Object.keys(data[1])[0].toLowerCase());
		
	// if first key is undefined, probably the delimter was something else... try semicolon.
	if (Object.keys(data[1])[0].length > 10) {
	//console.log("STRANGE DATA TRYING SEMICOLON");
	delim_attempt = delim_attempt + 1;
	switch (delim_attempt) {
	case 1 : delimiter = ";"; break;
	case 2 : delimiter = "\t"; break;
	case 3 : delimiter = "|"; break;
	case 4 : alert("Cannot make sense of datafile. The first column should contain NUTS codes. The first row should contain variable names. The name of the variable containing NUTS codes can be anything < 10 characters, but not empty. Avoid using ; and , in variable names."); 
			 throw new Error("Something went badly wrong!"); 
	break;
	}
	createMap(downloadUrl, nutsUrl, nutsUrl2);
	}
	else {
		//console.log("voor");
		createMap2(nutsUrl, nutsUrl2);
	}
	

}

}



function createMap2(nutsUrl, nutsUrl2) {
	
	
	
 	//console.log("hmmmm");

	

	
    // read map file and data, asynchronously
    queue().defer(d3.json, nutsUrl).defer(d3.json, nutsUrl2).await(ready2);
    // when ready, put the data into global variables "data" and "nuts", put the available variables from the dataset in
    // the dropdown menu, and call the function draw() to draw the map
	
	

    function ready2(error, _nuts, _nuts2) {
	console.log("READING IN DATA FOR FIRST TIME");

        nuts = _nuts;
//		storedsettings = ["PosColor","NegColor"];

		console.log("data",data);



		// make data contain only numerical data
		
		//data = {};
		//settings = {};
		populateVariablesList(data);
		colSelected = $("#variableList").val();
		eurostat = 0;
		nuts2006 = 0;
		UA=0;
		MD=0;
		RS=0;
		
		
		
		
		data.forEach(function(d) {
		
		// we will use whather is in the first column as the region nuts code, and give it the key "id"
		d["id"] = d[Object.keys(data[1])[0]];
				
		d.id = d.id.replace(/\s+/g, '');	
        d.id = d.id.replace("Dec-00","DEC0");
		d.id = d.id.replace("dec-00","DEC0");
		console.log("SUBSTRING", d.id.substring(0,3));
		
		if (  d.id == "DE41" |  d.id == "DE42" |  d.id == "DED1" |  d.id == "DED3" | d.id.substring(0,3) == "ITD" | d.id.substring(0,3) == "ITE"  | d.id == "FI13" |  d.id == "FI18" |  d.id == "FI1A" | d.id.substring(0,2) == "GR" ) {nuts2006=1}
		
		
		// if the row in the csv dataset contains a setting, adjust the menus, overwriting default settings
		// has to be deleted, better simulate click on dropdown (which loads settings) before drawing the map.
		// actually, allow for empty setting and apply it
//		if (d.id.length != 4 && d.id.length != 0 && d[colSelected].length != 0) {
		if (d.id.length > 5 && d.id.length != 0) {
			//console.log("TTTTTEST",d.id)
			if (document.getElementById(d.id) != null)  {
			var element = document.getElementById(d.id);
			if (checkboxes.indexOf(d.id) > -1) {
				console.log("SPECIAL reading",d[colSelected].toLowerCase());				
				if (typeof(d[colSelected]) === 'boolean') {
				element.checked = d[colSelected];
				}
				else {
				element.checked = (d[colSelected].toLowerCase() == 'true');
				}
				}
			else {
				element.value = d[colSelected];	
			}
			console.log("changing variable-specific setting of", d.id);
			console.log("changing to value of", d[colSelected]);
		}}
        });
		
		if (nuts2006)
		{nuts = _nuts2;}
		
		
		
		// add all non-present settings to the data-array... but only the id's so far.
		
console.log("NOTNEWESTDATA",data);
	
var allmenus = document.getElementsByClassName("form-inline");
for(var i = 0; i < allmenus.length; i++)
{
//	//console.log("it",allmenus.item(i));
	var item = allmenus.item(i).getAttribute("id");
//	//console.log("WWWW",item);
	var resultSet = $.grep(data, function (e) {
//	//console.log("returnset",e);
//  if menu-item from index-local.html not found in data from csv, add to data array
    return e.id.indexOf(item) == 0;});
	
	if (resultSet.length == 0) {
	// construct element to be added.
	el = {};
	el["id"] = allmenus.item(i).getAttribute("id");
	Object.keys(data[0]).forEach(function(key){ 
	if (key != "id") {el[key] = ""};
	});
	//console.log("added setting element to data ",el);
	data.push(el);
	}
}

//console.log("NEWESTDATA",data);

    colSelected = $("#variableList").val();
coldata = {};
		
		
		// fill data array with default settings where empty
		
		data.forEach(function(datapoint,index) {	
		if (datapoint.id.length > 5) {
//		//console.log("outerloopdatapoint",datapoint);
		
		defaultsettings.forEach(function(setting) {			
						if (setting.Setting == datapoint.id) {
						
//						//console.log("innerloopdatapoint",datapoint);
					
						Object.keys(datapoint).forEach(function(key){ 
//						//console.log("index",index);
//						//console.log("data[index]",data[index]);
//						//console.log("data[index][key]",data[index][key]);
//						//console.log("setting.Value",setting.Value);
						
						if (data[index][key] === "") { data[index][key] = setting.Value; } 
//						if (data[index][key] === "") { data[index][key] = setting.Value; } 
						
						})
						}
				});
		}
		else {
        coldata[datapoint.id] = datapoint[colSelected];
		};
		});
		
	
	legenddecimals = $("#legenddecimals").val();
	legendpercentage = $("#legendpercentage").val();
//	legend100 = $("#legend100").val();
	
	//	apply stored projection
	Projection = $("#Projection").val();

			if (Projection == "Albers") {
				projection = d3.geo.albers().center([ 10, 54 ]).rotate([ -3.5, 0 ]).parallels([ 50, 90 ]).scale(width * 1.45).translate([ width / 2, height / 2 ]);
			}; 
			if (Projection == "Lambert") {
//				projection = d3.geo.conicConformal().scale(1280).center([26, 60]).parallels([50, 90]);
//				projection = d3.geo.conicConformal().scale(1280).rotate([-30, 0]).parallels([85, 90]);
//				projection = d3.geo.mercator().center([15, 58.5]).scale(1000);
				projection = d3.geo.conicConformal().scale(1280).center([10, 60]).rotate([-10, 0]).parallels([50, 90]);
			};
			if (Projection == "Mercator") {
				projection = d3.geo.mercator().center([15, 58.5]).scale(1000);
			};
			
//	projection = d3.geo.mercator().center([15, 58.5]).scale(1000);

	//projection = d3.geo.conicConformal().scale(1250).center([24, 60]).parallels([50, 90]);
	
    	
    path = d3.geo.path().projection(projection);
	graticule = d3.geo.graticule()
.extent([[-30, 20], [70 - 0.000001, 80 + 0.000001 ]])
.step([10, 10]);	
	//only keep those features (region geographies) for which data exists
//console.log()
nuts.objects.subunits.geometries = nuts.objects.subunits.geometries.filter(function(d) {return (d.id in coldata)});	




	
		
//console.log(newpp);
		
		
		//console.log("eurostat", eurostat);
		
		//console.log("NUTS");
		//console.log(nuts);
		
		//console.log("data");
		//console.log(data);
		
		
		// if there are 268, the data is in nuts 2010 classification
		// if there are 267  the data is in nuts 2006 classification
		//console.log("Number of regions in dataset provided by user:");
		//console.log(data.length);
		

		_data = null; _nuts = null; _nuts2 = null; 
		

        // not used on server
        if (typeof prepare_locally == 'function') {
            prepare_locally();
        }
		
        //redrawEverything();
		// we simulate click on variable list, to read in settings associate with that variable
		// READ IN stored SETTINGS for newly selected variable, if any
		

		
	/*
old function: read in settings 	

    });
	
	*/
if (document.getElementById('bysize').checked == true) {

carto = d3.cartogram()
            .projection(projection)
            .properties(function (geom, topo) {return geom.properties;})
			.value(get_id_length);

function get_id_length (d) {
//         return Math.abs(coldata[d.id]);
return 10;
}

	    }
	else {
        redrawEverything();
        
bla2 = nuts.objects.subunits.geometries;
bla = [];
bla2.forEach(function(d,i) {
if (coldata[d.id] != null ) {bla.push(d)};
});

function get_id_length (d) {
          return Math.abs(coldata[d.id]);
}

carto = d3.cartogram()
              .projection(projection)
                .properties(function (geom, topo) {
                    return geom.properties;
                })
.value(get_id_length);
// features = carto(nuts, bla).features;



	}
	

		
    };

	

	
	
	
    
	
	
	
	
	

	// what to do if user chooses to save all data-settings
    d3.select("#savesettingsbutton").on("click", function() {
		
// we do not read from menu whether settings appply to all, we assume not, and only apply to all if button is pressed
//		settingsapplyto = $("#settingsapplyto").val();
		settingsapplyto = "applyonly";
		// store settings for active variable
		data.forEach(function(d,i) {
			//console.log("did",d.id.length);
			if (d.id.length > 5 && d.id.length != 0) {
			if (isNaN(data[document.getElementById(d.id)]) != null)  {
				
			if (settingsapplyto === "applyonly") {
			if (checkboxes.indexOf(d.id) > -1) {
				data[i][colSelected] = document.getElementById(d.id).checked;
				}
			else {
				data[i][colSelected] = document.getElementById(d.id).value;
			}
				}
				else {
					Object.keys(data[i]).forEach(function(key) {
							if (key != "id") {data[i][key] = document.getElementById(d.id).value;}
					});	
				}
			//console.log("stored setting offf", d.id);
			//console.log("stored for variable offf", colSelected);
			//console.log("stored value offf", data[i][colSelected]);
			}}
			
    });
		
		// prepare csv file containing all data + settings
		var csvContent = "data:text/csv;charset=utf-8,";
		csvdata = d3.csvFormat(data);
		csvContent += csvdata;
		var encodedUri = encodeURI(csvContent);
//		window.open(encodedUri);
		
	var csvlink = document.createElement("a");
    csvlink.setAttribute("href", encodedUri);
    csvlink.setAttribute("download", "rhomolo-maps.csv");
    document.body.appendChild(csvlink); // Required for FF
	
	csvlink.click();
	document.body.removeChild(csvlink); 
	 		
    });

	
	
	
	
	
	
    // what to do if "apply settings to all variables" is chosen.
	
    d3.select("#applysettingsbutton").on("click", function() {
			
		// store settings for active variable
		
		//console.log("clicked");
		
		
		data.forEach(function(d,i) {
			//console.log("did",(d.id == "drawregbordercheck"));
			// loop over data, if we encouter a setting (length ~= 4) and it exists in the html document, save the setting "for all variables" (implying a loop over all keys in the "data" object)
			if (d.id.length > 5 && d.id.length != 0) {
			if (isNaN(data[document.getElementById(d.id)]) != null)  {
				
		  
					
			if (checkboxes.indexOf(d.id) > -1) {
//			//console.log("WWWWW",document.getElementById(d.id).checked);
//			//console.log("WWWWW",(document.getElementById(d.id).checked == 'true'));
			Object.keys(data[i]).forEach(function(key) {if (key != "id") {data[i][key] = document.getElementById(d.id).checked}});	
			}
			else {
			Object.keys(data[i]).forEach(function(key) {if (key != "id") {data[i][key] = document.getElementById(d.id).value;}});	
			}
				
			}
			//console.log("stored setting offf", d.id);
			//console.log("stored for variable offf", colSelected);
			//console.log("stored value offf", data[i][colSelected]);
			}
			

			
    });
		
    });
	
	
	
	
	// what to do if user is planning to change variable: store previous settings
    d3.select("#variableList").on("mousedown", function() {
		//console.log("startsave");
		
		// when changing variable, before doing anything, store variable settings of particular active variable
		// store settings... if they were stored before (data.id ~= 4 exist and correspond to some setting)
		
// we do not read from menu whether settings appply to all, we assume not, and only apply to all if button is pressed
//		settingsapplyto = $("#settingsapplyto").val();
		settingsapplyto = "applyonly";
		
		data.forEach(function(d,i) {
			//console.log("did",d.id);
			if (d.id.length > 5 && d.id.length != 0) {
// why did we ever wanted to check whether the settings exists? just save it.
//			if (isNaN(data[document.getElementById(d.id)]) != null)  {
			
			if (settingsapplyto === "applyonly") {
			if (checkboxes.indexOf(d.id) > -1) {
				data[i][colSelected] = document.getElementById(d.id).checked;
				}
			else {
				data[i][colSelected] = document.getElementById(d.id).value;
			}
				}
				else {
					Object.keys(data[i]).forEach(function(key) {
							if (key != "id") {data[i][key] = document.getElementById(d.id).value;}
					});	
				}
//	
				
//			//console.log("stored setting offf", d.id);
//			//console.log("stored for variable offf", colSelected);
//			//console.log("stored value offf", data[i][colSelected]);
//			}
			}
			
    });
	//console.log("stopsave");
	});
	
	
	
    // what to do if a different variable is chosen in the menu
    d3.select("#variableList").on("change", function() {
	colSelected = $("#variableList").val();
		//console.log("CHANGED offf", data);
		// READ IN stored SETTINGS for newly selected variable, if any
		
	    data.forEach(function(d,i) {
//		//console.log("d",i);
//		//console.log("d",d);
//		//console.log("d",d.hasOwnProperty(colSelected));
		
		
			// if no stored setting, skip... hmmm perhaps, if there is no setting... we actually want to have no setting, like for "merge"
//		if (d.hasOwnProperty(colSelected)) {
		
		// if the ID is length 4, the row corresponds to a region and contains hard data
		if (d.id.length < 6  && d.id.length != 0 ) {
        coldata[d.id] = d[colSelected];
		} // else, the row contains a setting... actually allow for .length == 0, for empty string in merge
//		if (d.id.length != 4 && d.id.length != 0 && d[colSelected].length != 0) {
			if (d.id.length > 5 && d.id.length != 0 ) {
//			//console.log("diddddd",d[colSelected]);
//			dfds
//			if (document.getElementById(d.id) != null)  {
			var element = document.getElementById(d.id);
			
			if (checkboxes.indexOf(d.id) > -1) {
				//console.log("appllying",d[colSelected]);
				if (typeof(d[colSelected]) === 'boolean') {
				element.checked = d[colSelected];
				}
				else {
				element.checked = (d[colSelected].toLowerCase() == 'true');
				}
			}
			else {
				element.value = d[colSelected];	
			}
			console.log("new setting offf", d.id);
			console.log("new setting for variable offf", colSelected);
			console.log("new value offf", d[colSelected]);
			
//		}
		}
		
//	}
		
    });
	
redrawEverything();

    });
	
	
	

    d3.select("#PosQuant").on("change", function() {
		if (StyleSelected == "custom") {
		if (($("#poscutoffs").val().length > 0))  
			{
			console.log("LLLLLLLLLLLLLLLLLL");
			userposcutoffs = $("#poscutoffs").val();
			var element = document.getElementById("poscutoffs");
			userposcutoffs2 = userposcutoffs.split(",").map(function(item) {
			return parseFloat(item);
			});
			console.log("LL",userposcutoffs2.slice(0,parseInt($("#PosQuant").val())+1));
			element.value = userposcutoffs2.slice(0,parseInt($("#PosQuant").val())+1);
			}
		}
		if (StyleSelected != "custom") {
		var element = document.getElementById("groupingstyle");	
		var event = new Event('change');
		// Dispatch it.
		element.dispatchEvent(event);
		}
		else {
        redrawRegions();
		}
    });

    d3.select("#PosColor").on("change", function() {
        redrawEverything();
    });

	
    d3.select("#NegQuant").on("change", function() {
		if (StyleSelected == "custom") {
		if ($("#negcutoffs").val().length > 0)
			{
			usernegcutoffs = $("#negcutoffs").val();
			var element = document.getElementById("negcutoffs");
			usernegcutoffs2 = usernegcutoffs.split(",").map(function(item) {
			return parseFloat(item);
			});
			element.value = usernegcutoffs2.slice(-parseInt($("#NegQuant").val())-1);
			}
		}
		if (StyleSelected != "custom") {
		var element = document.getElementById("groupingstyle");	
		var event = new Event('change');
		// Dispatch it.
		element.dispatchEvent(event);
		}
		else {
        redrawRegions();
		}
    });

    d3.select("#NegColor").on("change", function() {
        redrawEverything();
    });

    d3.select(self.frameElement).style("height", height + "px");
	







	

	
////////////////////
	
	
	// what to do if user provides list of poscutoffs
	document.getElementById("poscutoffs").addEventListener("keydown", function(e) {
    if (!e) { var e = window.event; }
    if (e.keyCode == 13) {
	var element = document.getElementById("groupingstyle");
	element.value = "custom";	
	userposcutoffs = $("#poscutoffs").val();
	if (userposcutoffs.length == null) {
	var element = document.getElementById("poscutoffs");
	element.value = 0;
	}
	prepareData();
	//console.log( "going to draw map");
	drawMap();
	drawLegend();
	histogram();
	}
	// end what to do if user provides list of poscutoffs
	}, false);
	

	// what to do if user provides list of negcutoffs
	document.getElementById("negcutoffs").addEventListener("keydown", function(e) {
	if (!e) { var e = window.event; }
	if (e.keyCode == 13) {
	var element = document.getElementById("groupingstyle");
	element.value = "custom";
	usernegcutoffs = $("#negcutoffs").val();
	if (usernegcutoffs.length == null) {
	var element = document.getElementById("negcutoffs");
	element.value = 0;
	}
	prepareData();
	drawMap();
	drawLegend();
	histogram();
	}
	}, false);


// end of function createmap
};






function readSettings(settingsUrl,downloadUrl,nutsUrl,nutsUrl2) {
	
    d3.selectAll(".tooltip").remove();

	tooltipDiv = d3.select("body").append("div").attr("class", "tooltip").style("opacity", 0);  
	
	queue().defer(d3.csv, settingsUrl).await(ready2);

	function ready2(error, _settings) {
	console.log("READING IN SETTINGS from default settings file");
	console.log(downloadUrl);
	console.log(_settings);
	
	defaultsettings = _settings;

	checkboxes = ["displaynames","drawgraticule","legend100","legendpercentage","drawshadecheck","drawregbordercheck","bysize","nodata","poscheck","negcheck","poslegcheck","neglegcheck","drawcopyright"];
	
	
    _settings.forEach(function(d) {
	if (d.Setting != "") {
	if (document.getElementById(d.Setting) != null) {
	var element = document.getElementById(d.Setting);
	
	// if the setting being read in is a checkbox...
	if (checkboxes.indexOf(d.Setting) > -1) {
	
	if (typeof(d.Value) === 'boolean') {
				element.checked = d.Value;
				}
				else {
				element.checked = (d.Value.toLowerCase() == 'true');
				}
	}
	else {
	element.value = d.Value
	}
	console.log("changing setting of", d.Setting);
	console.log("changing to value of", d.Value);
	}}
    });
	
			
			
	
	
	// if no file selected, look for "rhomolo-output.csv"
	
	//console.log("TESTTEST",downloadUrl);
//	if (document.getElementById("csvfile").value.string == null) {
//		//console.log("ZZZZ");
//		downloadUrl = "rhomolo-output.csv";
//	}

    // setup layout of map (width, height, projection,...) defined in map_prepare.js
    // prepareMap();
    width = 900;
    height = 900;
    legendwidth = 900;
    regionlist = [];
    countrylist = [];
    inputs = [];
	legendfontsize = "12px";
	legendfontweight = "bold";

    zoommap = d3.behavior.zoom().scaleExtent([0.5,50]).on("zoom", movemap);
	zoomneglegend = d3.behavior.zoom().scaleExtent([0.5,50]).on("zoom", moveneglegend);
	zoomposlegend = d3.behavior.zoom().scaleExtent([0.5,50]).on("zoom", moveposlegend);

	zoomneglegend = d3.behavior.zoom().scaleExtent([0.7,50]).on("zoom", moveneglegend);
	zoomposlegend = d3.behavior.zoom().scaleExtent([0.7,50]).on("zoom", moveposlegend);

zoomneglegend.scaleGenerator(function (scale, delta, usecase) {
  if (usecase === 'mousewheel') { // usecase can be any of 'mousewheel', 'dblclick', 'touchzoom', 'dbltap'
    return delta > 0 ? scale + 0.1 : scale - 0.1; // always change scale to round values
  } else {
//    return scalegen(scale, delta, usecase); // for other usecases keep the default behavior
  }
});
	
zoomposlegend.scaleGenerator(function (scale, delta, usecase) {
  if (usecase === 'mousewheel') { // usecase can be any of 'mousewheel', 'dblclick', 'touchzoom', 'dbltap'
    return delta > 0 ? scale + 0.1 : scale - 0.1; // always change scale to round values
  } else {
//    return scalegen(scale, delta, usecase); // for other usecases keep the default behavior
  }
});
	
	//	var scalegen = zoom.scaleGenerator(); // get default scale generator

	
	// http://bl.ocks.org/jchlapinski/d51d9aca2084bc02f30b
zoommap.scaleGenerator(function (scale, delta, usecase) {
zoomspeed =  parseFloat($("#zoomspeed").val());
//console.log(zoomspeed);
  if (usecase === 'mousewheel') { // usecase can be any of 'mousewheel', 'dblclick', 'touchzoom', 'dbltap'
    return delta > 0 ? scale + zoomspeed : scale - zoomspeed; // always change scale to round values
  } else {
//    return scalegen(scale, delta, usecase); // for other usecases keep the default behavior
  }
});


	// http://bl.ocks.org/jchlapinski/d51d9aca2084bc02f30b
zoomneglegend.scaleGenerator(function (scale, delta, usecase) {
  if (usecase === 'mousewheel') { // usecase can be any of 'mousewheel', 'dblclick', 'touchzoom', 'dbltap'
    return delta > 0 ? scale + 0.1 : scale - 0.1; // always change scale to round values
  } else {
    return scalegen(scale, delta, usecase); // for other usecases keep the default behavior
  }
});
	
zoomposlegend.scaleGenerator(function (scale, delta, usecase) {
  if (usecase === 'mousewheel') { // usecase can be any of 'mousewheel', 'dblclick', 'touchzoom', 'dbltap'
    return delta > 0 ? scale + 0.1 : scale - 0.1; // always change scale to round values
  } else {
    return scalegen(scale, delta, usecase); // for other usecases keep the default behavior
  }
});

	
	//    svg = d3.select("#container").append("svg").attr("class", "svg-map").attr("preserveAspectRatio", "xMinYMin meet").attr("id", "svg-map")
 //           .attr("width", width).attr("height", height).attr("overflow", "hidden").attr("viewBox", "0 0 900 900");
			// if you have .call(zoommap) here you cannot move the legend, if you do not, legend moves, but zooming and moving becomes jittery, 
	
   svg = d3.select("#container").append("svg").attr("class", "svg-map").attr("id", "svg-map")
           .attr("width", width).attr("height", height);
		

		
    //projection = d3.geo.albers().center([ 10, 54 ]).rotate([ -3.5, 0 ]).parallels([ 50, 90 ]).scale(width * 1.4).translate([ width / 2, height / 2 ]);

	Projection = $("#Projection").val();

			if (Projection == "Albers") {
				projection = d3.geo.albers().center([ 10, 54 ]).rotate([ -3.5, 0 ]).parallels([ 50, 90 ]).scale(width * 1.45).translate([ width / 2, height / 2 ]);
			}; 
			
			if (Projection == "Lambert") {
//				projection = d3.geo.conicConformal().scale(1280).center([26, 60]).parallels([50, 90]);
//				projection = d3.geo.conicConformal().scale(280).center([26, 60]).parallels([85, 90]);
//				projection = d3.geo.mercator().center([15, 58.5]).scale(1000);
				projection = d3.geo.conicConformal().scale(1280).center([10, 70]).rotate([-10, 0]).parallels([50, 190]);

			};
			if (Projection == "Mercator") {
				projection = d3.geo.mercator().center([15, 58.5]).scale(1000);
			};
			
//	projection = d3.geo.mercator().center([15, 58.5]).scale(1000);

	//projection = d3.geo.conicConformal().scale(1250).center([24, 60]).parallels([50, 90]);

	
    	
    //z = svg.append("z");
    //g = svg.append("g");

    

	bordersize_reg = 0.2;
	bordersize_ctrext = 0.5;
	bordersize_ctr = 0.5;
	
	path = d3.geo.path().projection(projection);
	
	graticule = d3.geo.graticule()
    .extent([[-30, 20], [70 - 0.000001, 80 + 0.000001 ]])
	.step([10, 10]);

	
	// SVG -> MAING -> MAPG2 -> RECT and MAPG0(->MAPG). zoommap moves mapg0... not rect... bad
	// 
	
	/*
	maing = svg.append("g").attr("class","maing").style("pointer-events", "all");
	mapg2 = maing.append("g").attr("class","mapg2").call(zoommap);
	mapg0 = mapg2.append("g").attr("class","mapg0");
*/
	
	// used to be
	maing = svg.append("g").attr("class","maing");
	mapg2 = maing.append("g").attr("class","mapg2").call(zoommap);
	rect = mapg2.append("rect").style("fill", "white").style("pointer-events", "mousedown");
	mapg0 = mapg2.append("g").attr("class","mapg0");

	
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

	copyright = svg.append("g").attr("class","copyright");
	mainlegend = svg.append("g").attr("class","mainlegend");
	mainlegendpos = mainlegend.append("g").attr("class","mainlegendpos").call(zoomposlegend);
	mainlegendneg = mainlegend.append("g").attr("class","mainlegendneg").call(zoomneglegend);


	// this will contain (and preserve) the translate between redraws
	toplegendpos2 = mainlegendpos.append("g").attr("class","toplegendpos2");
	toplegendneg2 = mainlegendneg.append("g").attr("class","toplegendneg2");

	copyrightText = mainlegendpos.append("g").attr("class","copyrightText");

	
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
	


	
	
	delim_attempt = 0;
	createMap(downloadUrl, nutsUrl,nutsUrl2);
	};
	
	
	
	
}

/*
document.getElementById("csvfile").addEventListener("keydown", function(e) {
    if (!e) { var e = window.event; }
    if (e.keyCode == 13) {
		downloadUrl= $("#csvfile").val();
		 createMap(downloadUrl, "code/remo_nuts2006.json","code/remo_nuts2010.json","code/nuts2010_small.json");
		}
}, false);	
*/	
		
document.getElementById("translate").addEventListener("keydown", function(e) {
    if (!e) { var e = window.event; }
    if (e.keyCode == 13) {
		downloadUrl= $("#csvfile").val();
		translate= $("#translate").val();
		
	//console.log("TRANSLATE STRING", typeof translate);
	if (typeof translate !== 'string') {
		translate = "translate(0,0)scale(1)";
	}
	//console.log(d3.transform(translate));
	t = d3.transform(translate).translate;
	s = d3.transform(translate).scale;
	//console.log(s);
	zoommap.scale(s[0]);
	zoommap.translate(t);
	zoommap.event(mapg0);
		
	drawMap(downloadUrl, nutsUrl, nutsUrl2);
	}
}, false);

	
/*	
function SVG2PNG(svg, callback) {
  var canvas = document.createElement('canvas'); // Create a Canvas element.
  var ctx = canvas.getContext('2d'); // For Canvas returns 2D graphic.
  var data = svg.outerHTML; // Get SVG element as HTML code.
  canvg(canvas, data); // Render SVG on Canvas.
  callback(canvas); // Execute callback function.
}

		
function generateLink(fileName, data) {
  var link = document.createElement('a');
  document.body.appendChild(link);
  link.setAttribute("type", "hidden"); // make it hidden if needed
  link.download = fileName;
  link.href = data;
  return link;
}

document.getElementById('saveImage').onclick = function() { // Bind click event on download button.
  var element = document.getElementById('svg-map'); // Get SVG element.
  SVG2PNG(element, function(canvas) { // Arguments: SVG element, callback function.
    var base64 = canvas.toDataURL("image/png"); // toDataURL return DataURI as Base64 format.
	filename =   $("#prefix").val()  + $("#variableList").val() + ".png";
	filename = filename.replace(/\s+/g, '');
    generateLink(filename, base64).click(); // Trigger the Link is made by Link Generator and download.
  });
}		
*/

	
$(document).ready(
        function() {
            $("#saveImage").click(
                    function(e) {
						
						
						
						
                        e.preventDefault();

						
						
						
var doctype = '<?xml version="1.0" standalone="no"?>'
  + '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">';
// serialize our SVG XML to a string.
var source = (new XMLSerializer()).serializeToString(d3.select('.svg-map').node());
// create a file blob of our SVG.
var blob = new Blob([ doctype + source], { type: 'image/svg+xml;charset=utf-8' });
var url = window.URL.createObjectURL(blob);
// Put the svg into an image tag so that the Canvas element can read it in.

printwidth = width;
printheight = height;

var img = d3.select('body').append('img')
 .attr('width', printwidth)
 .attr('height', printheight)
 // SHOULD THE SVG IMAGE BE VISIBLE OR NOT? I MAKE IT VISIBLE FOR EASY COPY PASGING
// .attr('hidden','false')
 .attr('title',$("#variableList").val() + ".svg")
 .attr('download',$("#variableList").val() + ".svg" )
 .node();
 
img.onload = function(){
  // Now that the image has loaded, put the image into a canvas element.
  var canvas = d3.select('body').append('canvas').node();
  canvas.width = printwidth;
  canvas.height = printheight;
  var ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0);
  var canvasUrl = canvas.toDataURL("image/png");

// should the png be visible or not?  
  var img2 = d3.select('body').append('img')
  .attr('width', printwidth)
    .attr('height', printheight)
//	 .attr('hidden','true')
	.attr('title',$("#variableList").val() + ".png")
    .attr('download',$("#variableList").val() + ".png" )
    .node();
  
  // this is now the base64 encoded version of our PNG! you could optionally 
  // redirect the user to download the PNG by sending them to the url with 
//  window.location.href= canvasUrl;
  img2.src = canvasUrl; 
  					filename =   $("#prefix").val()  + $("#variableList").val() + ".png";
					filename = filename.replace(/\s+/g, '');

                      $("#downloadLink").remove();
                            var downloadLink = $("<a>", {
                                id : "downloadLink",
                                href : canvas.toDataURL('image/png'),
                                download : filename
                            });

                            $("body").append(downloadLink);
                            $("#downloadLink").hide();
                            $("#downloadLink")[0].click();
							
  d3.select('canvas').remove();
}

// start loading the image.
img.src = url;

						
			
						
						
						
	
						
					
                    });
        });
		
		
		
		

		
		


$(document).ready(
        function() {
            $("#saveImage2").click(
			
                    function(e) {
                        e.preventDefault();
						
	   d3.selectAll('.axis path, .axis line, .axis').each(function() {
        var element = this;
        var computedStyle = getComputedStyle(element, null);
        for (var i = 0; i < computedStyle.length; i++) {
          var property = computedStyle.item(i);
          var value = computedStyle.getPropertyValue(property);
          element.style[property] = value;
        }
      });


                        var html = d3.select(".histogram").attr("version", 1.1).attr("xmlns", "http://www.w3.org/2000/svg")
                                .node().parentNode.innerHTML;
								
//alert(html);								
								
								var encodedSVG;

                        if (window.btoa) {
                            encodedSVG = btoa(unescape(encodeURIComponent(html)));
                        } else {
                            encodedSVG = Base64.encode(unescape(encodeURIComponent(html)));
                        }

                        var image = new Image();
                        image.src = "data:image/svg+xml;base64," + encodedSVG;

                        image.onload = function() {
									alert("image is loaded");
                            var canvas = document.createElement('canvas');
                            canvas.width = image.width;
                            canvas.height = image.height;

                            var context = canvas.getContext('2d');
                            context.drawImage(image, 0, 0);

                            $("#downloadLink").remove();
                            var downloadLink = $("<a>", {
                                id : "downloadLink",
                                href : canvas.toDataURL('image/png'),
                                download : "histogram.png"
                            });

                            $("body").append(downloadLink);
                            $("#downloadLink").hide();
                            $("#downloadLink")[0].click();
                        };
                    });
        });

		
		
		
		
		
		
$(document).ready(
        function() {
            $("#saveImage3").click(
			
                    function(e) {
                        e.preventDefault();
						
						      d3.selectAll('.axis path, .axis line, .axis').each(function() {
        var element = this;
        var computedStyle = getComputedStyle(element, null);
        for (var i = 0; i < computedStyle.length; i++) {
          var property = computedStyle.item(i);
          var value = computedStyle.getPropertyValue(property);
          element.style[property] = value;
        }
      });


 //                       var html = "<svg class="histogram" preserveAspectRatio="xMinYMin meet" id="histogram" width="900" height="400" version="1.1" xmlns="http://www.w3.org/2000/svg">" 
						
						d3.select(".toplegend").attr("version", 1.1).attr("xmlns", "http://www.w3.org/2000/svg")
                                .node().parentNode.innerHTML;

alert(html);								

								var encodedSVG;

                        if (window.btoa) {
                            encodedSVG = btoa(unescape(encodeURIComponent(html)));
                        } else {
                            encodedSVG = Base64.encode(unescape(encodeURIComponent(html)));
                        }

                        var image = new Image();
                        image.src = "data:image/svg+xml;base64," + encodedSVG;

                        image.onload = function() {
                            var canvas = document.createElement('canvas');
                            canvas.width = image.width;
                            canvas.height = image.height;

                            var context = canvas.getContext('2d');
                            context.drawImage(image, 0, 0);

                            $("#downloadLink").remove();
                            var downloadLink = $("<a>", {
                                id : "downloadLink",
                                href : canvas.toDataURL('image/png'),
                                download : "legend.png"
                            });

                            $("body").append(downloadLink);
                            $("#downloadLink").hide();
                            $("#downloadLink")[0].click();
                        };
                    });
        });


d3.select("#csvfile")
          .attr("type", "file")
          .attr("accept", ".csv")
          .style("margin", "5px")
          .on("change", function() {
		delete delimiter;
            var file = d3.event.target.files[0];
            if (file) {
              var reader = new FileReader();
                reader.onloadend = function(evt) {
				  d3.select("#svg-map").remove();
				  settingsUrl = "default-settings.csv";
                  downloadUrl = evt.target.result;
				  // The following call results in an "Access denied" error in IE.
				  //console.log("new DOWNLOADURL",downloadUrl);
				  readSettings(settingsUrl,downloadUrl,"code/all2010.json","code/all2006.json");
				  //readSettings(settingsUrl,downloadUrl,"code/remo_nuts2006.json","code/remo_nuts2010.json","code/nuts2010_small.json");
                  //createMap(downloadUrl, "code/remo_nuts2006.json","code/remo_nuts2010.json","code/nuts2010_small.json");
              };
             reader.readAsDataURL(file);
            }
         })
