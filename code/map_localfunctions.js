	
function dropHandler(ev) {
  console.log('File(s) dropped');

  // Prevent default behavior (Prevent file from being opened)
  ev.preventDefault();

  if (ev.dataTransfer.items) {
    // Use DataTransferItemList interface to access the file(s)
    for (var i = 0; i < ev.dataTransfer.items.length; i++) {
      // If dropped items aren't files, reject them
      if (ev.dataTransfer.items[i].kind === 'file') {
        var file = ev.dataTransfer.items[i].getAsFile();
        console.log('AAAA... file[' + i + '].name = ' + file.name);
		
		

		       
		delete delimiter;
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
 
		 
		
      }
    }
  } else {
    // Use DataTransfer interface to access the file(s)
    for (var i = 0; i < ev.dataTransfer.files.length; i++) {
      console.log('BBB... file[' + i + '].name = ' + ev.dataTransfer.files[i].name);
    }
  }
}

function dragOverHandler(ev) {
  console.log('File(s) in drop zone'); 

  // Prevent default behavior (Prevent file from being opened)
  ev.preventDefault();
}
	
	
	
 
function showinput(region) {
//console.log("clicked", region);
//console.log("regionlist", regionlist);

// fill dropdown menu with list of all regions within the same country as the clicked region
// and move selection to clicked region
first = "<option value='";
last = "</option>";
textregions = "";
textcountries = "";
inputs.forEach(function(d) {
	if (region.substring(0,2) == d.id.substring(0,2)) {
		textregions += first + d.id + "'";
		if (region == d.id) {
			textregions += " selected='selected'";
		}
	textregions += ">" + d.id +  " " + d.Name +  last;
	};
});

// fill dropdown menu with list of all countries
// and move selection to the country the clicked region belongs to
countrylist.forEach(function(d) {
	textcountries += first + d + "'";
	if (region.substring(0,2) == d) {
		textcountries += " selected='selected'";
	}
	textcountries += ">" + d + last;
});

$("#regions").html(textregions);
$("#countries").html(textcountries);


// look for stored inputs for the clicked region
// read and display existing values
//console.log("storedinputs", inputs);
// store the values for the clicked region in object R
R = inputs.filter(function(d) { return d.id == region})[0];
//console.log("thisinput", R);
//console.log("budget",myround(+R.Budget));
sum = +R.TFP + +R.LP + +R.TC;
R.relTFP = +R.TFP/sum; if (isNaN(R.relTFP)) {R.relTFP = 0;};
R.relLP = +R.LP/sum; if (isNaN(R.relLP)) {R.relLP = 0;};
R.relTC = +R.TC/sum; if (isNaN(R.relTC)) {R.relTC = 0;};
//console.log('value',R.relTFP);
document.getElementById("Budget").max=nodecimals(+R.GDP2009/20*1000);
document.getElementById("Budget").value = nodecimals(+R.Budget);
document.getElementById("TFP").value = nodecimals(R.relTFP*100);
document.getElementById("LP").value = nodecimals(R.relLP*100);
document.getElementById("TC").value = nodecimals(R.relTC*100);
document.getElementById("BudgetText").value = nodecimals(+R.Budget) + " (max:" + nodecimals(+R.GDP2009/20*1000) + ")";
document.getElementById("TFPText").value = nodecimals(R.relTFP*100);
document.getElementById("LPText").value = nodecimals(R.relLP*100);
document.getElementById("TCText").value = nodecimals(R.relTC*100);
};


function storeinputs(level) {
// apply (=store) inputs to region, or entire NUTS1 region, or entire country
Budget = document.getElementById("Budget").value;
TFP = document.getElementById("TFP").value;
LP = document.getElementById("LP").value;
TC = document.getElementById("TC").value;

regtonuts1list = [];
regtoctrlist = [];
regionlist.forEach(function(d) {regtonuts1list.push(d.substring(0,3))});
regionlist.forEach(function(d) {regtoctrlist.push(d.substring(0,2))});

//console.log('regtonuts1: ',regtonuts1list);
//console.log('regtoctr: ',regtoctrlist);

region = $("#regions").val();    
regionindex = regionlist.indexOf(region);

// get array of indices of regions in same nuts1, and same country
nuts1indices = [];
ctrindices = [];
nuts1index = regtonuts1list.indexOf(region.substring(0,3));
ctrindex = regtoctrlist.indexOf(region.substring(0,2));
while (nuts1index != -1) {
nuts1indices.push(nuts1index);
nuts1index =  regtonuts1list.indexOf(region.substring(0,3), nuts1index + 1);
};
while (ctrindex != -1) {
ctrindices.push(ctrindex);
ctrindex =  regtoctrlist.indexOf(region.substring(0,2), ctrindex + 1);
};
//console.log('nuts1indices', nuts1indices);
//console.log('ctrindices', ctrindices);


switch (level) {
    case "region" :
	    inputs[regionindex].TFP = TFP;
   	    inputs[regionindex].LP = LP;
	    inputs[regionindex].TC = TC;
   	    inputs[regionindex].Budget = Budget;
    break;
    case "NUTS1" :
        nuts1indices.forEach(function(d) {
        inputs[d].TFP = TFP;
        inputs[d].LP = LP;
        inputs[d].TC = TC;
        inputs[d].Budget = Budget;
        });    
    break;
    case "country" :
        ctrindices.forEach(function(d) {
        inputs[d].TFP = TFP;
        inputs[d].LP = LP;
        inputs[d].TC = TC;
        inputs[d].Budget = Budget;
         }); 
    break;
}
//console.log('newinputs',inputs);
}



// irrelevant for website: populate menu for scatterplot with same list
function prepare_locally() {
	


data.forEach(function(d) {
if (d.id.length < 6  && d.id.length != 0) {
regionlist.push(d.id);
countrylist.push(d.id.substring(0,2));
}
});
// countrynames are the first two characters of the region-codes
countrylist = d3.set(countrylist).values();



d3.select("#Budget").on("change", function() { 
region =  $("#regions").val();
storeinputs("region");
showinput(region);
});

d3.select("#TFP").on("change", function() { 
region =  $("#regions").val();
storeinputs("region");
showinput(region);
});

d3.select("#LP").on("change", function() { 
region =  $("#regions").val();
storeinputs("region");
showinput(region);
});

d3.select("#TC").on("change", function() { 
region =  $("#regions").val();
storeinputs("region");
showinput(region);
});

// if a new country is selected from dropdown, the 'clicked' region is the first region for that country
d3.select("#countries").on("change", function() { 
region =  $("#countries").val();
thiscountryregionlist = [];
regionlist.forEach(function(d) {
if (region.substring(0,2) == d.substring(0,2)) {
thiscountryregionlist.push(d);
};
});
showinput(thiscountryregionlist[0]);
});

d3.select("#regions").on("change", function() { 
region =  $("#regions").val();
showinput(region);
});

// if runninglocally, define actions for some more buttons

poschecked =  document.getElementById('poscheck').checked;
d3.select("#poscheck").on("change", function() { 
poschecked =  document.getElementById('poscheck').checked;
//console.log(poschecked);
drawMap();
drawLegend();
histogram();
});


drawcopyright =  document.getElementById('drawcopyright').checked;
d3.select("#drawcopyright").on("change", function() { 
drawcopyright =  document.getElementById('drawcopyright').checked;
console.log("copyrightcheck");
drawMap();
drawLegend();
histogram();
});


poslegcheck =  document.getElementById('poslegcheck').checked;
d3.select("#poslegcheck").on("change", function() { 
poslegcheck =  document.getElementById('poslegcheck').checked;
//console.log(poslegcheck);
drawMap();
drawLegend();
histogram();
});

neglegcheck =  document.getElementById('neglegcheck').checked;
d3.select("#neglegcheck").on("change", function() { 
neglegcheck =  document.getElementById('neglegcheck').checked;
//console.log(neglegcheck);
drawMap();
drawLegend();
histogram();
});




d3.select("#drawregbordercheck").on("change", function() { 
		
//drawMap();

if (document.getElementById('drawregbordercheck').checked == true) {
	mapg.selectAll(".subunit2").style("stroke", "white");
	mapg.selectAll(".subunit2").style("stroke-width", bordersize_reg);
	}
	else {
	mapg.selectAll(".subunit2")
	  .attr('fill', function(d){return getcolor(coldata[this.id]);})
	  .style('stroke', function(d){return getcolor(coldata[this.id]);})
	  .style('stroke-width',0.9)
	}

	
});


d3.select("#drawshadecheck").on("change", function() { 
drawMap();
});


d3.select("#legend100").on("change", function() { 
drawMap();
drawLegend();
histogram();
});

d3.select("#legendpercentage").on("change", function() { 
drawMap();
drawLegend();
histogram();
});


d3.select("#bysize").on("change", function() { 
drawMap();
});

d3.select("#nodata").on("change", function() { 
drawMap();
});

d3.select("#displaynames").on("change", function() { 
drawMap();
});


d3.select("#drawgraticule").on("change", function() { 
drawMap();
});

d3.select("#negcheck").on("change", function() { 
negchecked =  document.getElementById('negcheck').checked;
drawMap();
drawLegend();
histogram();
});


d3.select("#applytoregion").on("click", function() { 
storeinputs("region");
});

d3.select("#applytoNUTS1").on("click", function() { 
storeinputs("NUTS1");
});

d3.select("#applytocountry").on("click", function() { 
storeinputs("country");
});

d3.select("#histogrambutton").on("click", function() { 
histogram();
});

d3.select("#histcolor").on("change", function() { 
histcolor =  $("#histcolor").val();
histogram();
});

d3.select("#histcutleft").on("change", function() { 
histcutleft =  $("#histcutleft").val();
histogram();
});

d3.select("#histcutright").on("change", function() { 
histcutright =  $("#histcutright").val();
histogram();
});

d3.select("#histbins").on("change", function() { 
histogram();
});


d3.select("#scatterbutton").on("click", function() { 
prepareData();
scatter();
});


d3.select("#scattervars").on("change", function() { 
prepareData();
scatter();
});


d3.select("#groupingstyle").on("change", function() {
prepareData();
if (StyleSelected != "custom") {
	var element = document.getElementById("poscutoffs");
	element.value = poscutsplus;
	var element = document.getElementById("negcutoffs");
	element.value = negcutsplus;
}
mapg.selectAll(".subunit2")
    .attr('fill',function(d){
    return getcolor(coldata[d.id]);
    })
	.attr('id',function(d){
	return d.id;
	});
drawLegend();
histogram();
});





d3.select("#outerbordersize").on("change", function() {
mergeinput =  $("#MergeRegs").val();
outerbordersize =  $("#outerbordersize").val();
merge = mergeinput.split(",");
//prepareData();
drawMap();
//drawLegend();
//histogram();
});



d3.select("#MergeRegs").on("change", function() {
mergeinput =  $("#MergeRegs").val();
mergeinput = mergeinput.replace(/\s+/g, '');
outerbordersize =  $("#outerbordersize").val();
merge = mergeinput.split(",");
prepareData();
drawMap();
drawLegend();
histogram();
});





d3.select("#saveAllImage").on("click", function() { 
// we keep the prefix which is visible when clicked, even if different ones exist
prefix = $("#prefix").val();
//console.log("clicked");
var test = $("#variableList > option");
//console.log(test);
variables = [];
test.each(function() {
variables.push(this.value);
})
//console.log(variables);
var l = document.getElementById('saveImage');
var element = document.getElementById("variableList");





// this will contain a movie version combining all images.
var encoder = new Whammy.Video(1.5); 

var builder = new VideoBuilder({
    width  : 900,
    height : 900,
    fps    : 1.5
});

function main() {
    var index = 0;

    function saveimages() {
        if (index < variables.length) {
			
d3.selectAll("canvas").remove();
d3.selectAll("img").remove();
			
var canvas = d3.select('body').append('canvas').style("display","none").node();			
			
var variableToLoad = variables[index];
element.value = variableToLoad;
//console.log("in main index", index);
//console.log("in main variabletoload", variableToLoad);


// function to execute only after adjusting data
function rest() {

redrawEverything();

var doctype = '<?xml version="1.0" standalone="no"?>'
  + '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">';
// serialize our SVG XML to a string.
var source = (new XMLSerializer()).serializeToString(d3.select('.svg-map').node());
// create a file blob of our SVG.
var blob = new Blob([ doctype + source], { type: 'image/svg+xml;charset=utf-8' });
var url = window.URL.createObjectURL(blob);
// Put the svg into an image tag so that the Canvas element can read it in.
var img = new Image();
/*
 d3.select('body').append('img')
 .attr('width', 900)
 .attr('height', 900)
 .node();
*/			
					   
img.onload = function() {
//encoder.add(canvas);														
														
  // Now that the image has loaded, put the image into a canvas element.
  
  
  canvas.width = 900;
  canvas.height = 900;
  var ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0);
  var canvasUrl = canvas.toDataURL("image/png");
  					filename =   prefix  + $("#variableList").val() + ".png";
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
							
	builder.addCanvasFrame(canvas);
	encoder.add(canvas);
	
	// if we just build the last image, create video
	if (index == variables.length - 1 ) {
		
//	//console.log("encoder",encoder);
	encoder.compile(false, function(output){
	var url = URL.createObjectURL(output);
	var video = document.getElementById('video');
	document.getElementById('video').src = url; //toString converts it to a URL via Object URLs, falling back to DataURL
//	document.getElementById('download').style.display = '';
	document.getElementById('download').href = url;
	/*
	video.innerHTML = '';
	var source = document.createElement('source');
	source.setAttribute('src', url);
//	source.setAttribute('type', "video/webm");
	video.appendChild(source);
	video.innerHTML += "no video support";
//	video.play();
*/
	});
	
	// this is the AVI version
	builder.finish(function(generatedURL) {
		
	a = document.getElementById('download')
	a.style.display = '';
	a.href = generatedURL;
//	a.click();
	});
	
	}				
						++index;
						saveimages();
};
img.src = url;					 
                    
// we want to execute this block only after looping over data and adjusting settings
}


done = 0;
// load settings for active variable, then call rest() function

data.forEach(function(d,i,arr) {
//		//console.log("d",d);
		
			// if no stored setting, skip
		if (d.hasOwnProperty(variableToLoad)) {
		
		// if the ID is length 4, the row corresponds to a region and contains hard data
		if (d.id.length < 6  && d.id.length != 0) {
        coldata[d.id] = d[variableToLoad];
		} // else, the row contains a setting
		if (d.id.length > 5 && d.id.length != 0) {
			//console.log("diddddd",d[variableToLoad]);
			if (document.getElementById(d.id) != null)  {
			var element = document.getElementById(d.id);
			element.value = d[variableToLoad];
		    //console.log("new setting offf", d.id);
			//console.log("new setting for variable offf", variableToLoad);
			//console.log("new value offf", d[variableToLoad]);
		}}
		
	}
done++;
// when all settings are loaded
if (done == arr.length)	{
	rest();
}
});
        }

		
    }
  saveimages();
};


maini = 0;
colSelected = $("#variableList").val();
settingsapplyto = $("#settingsapplyto")//.val();

// store data for active variable, then call main function
		data.forEach(function(d,i,a) {
//			//console.log("did",d.id.length);
			if (d.id.length > 5 && d.id.length != 0) {
			if (isNaN(data[document.getElementById(d.id)]) != null)  {
				
// no, we always only store the settings of the active variable!!!
//			if (settingsapplyto === "applyonly") {
			data[i][colSelected] = document.getElementById(d.id).value;
			//console.log("stored setting offf", d.id);
			//console.log("stored for variable offf", colSelected);
			//console.log("stored value offf", data[i][colSelected]);
//				}
				/*
				else {
					Object.keys(data[i]).forEach(function(key) {
							if (key != "id") {
							data[i][key] = document.getElementById(d.id).value;
			//console.log("stored2 setting offf", d.id);
			//console.log("stored2 for variable offf", key);
			//console.log("stored2 value offf", data[i][key]);

							}
					});	
				}			
			*/
			}}
			maini++;
//			//console.log(maini);
			if (maini == a.length) {setTimeout(function(){ main(); }, 10);}
    });
	

});

	
	

	

d3.select("#legenddecimals").on("change", function() {
legenddecimals = $("#legenddecimals").val();
drawMap();
drawLegend();
histogram();
});



d3.select("#legendsize").on("change", function() {
	// later on
zoomposlegend.scale($("#legendsize").val());
zoomneglegend.scale($("#legendsize").val());
zoomposlegend.event(toplegendpos);
zoomneglegend.event(toplegendneg);
//d3.selectAll(".toplegend").attr("transform", "scale(" + $("#legendsize").val() + ")");
});



d3.select("#legendfontsize").on("change", function() {
legendfontsize = $("#legendfontsize").val();
d3.selectAll(".legendtext").style("font-size",legendfontsize)
//drawLegend();
});

d3.select("#legendfontweight").on("change", function() {
legendfontweight = $("#legendfontweight").val();
d3.selectAll(".legendtext").style("font-weight",legendfontweight)
//drawLegend();
});

d3.select("#legendorientation").on("change", function() {
legendorientation = $("#legendorientation").val();
poschecked =  document.getElementById('poscheck').checked;
negchecked =  document.getElementById('negcheck').checked;
drawLegend();
});


d3.select("#zoomspeed").on("change", function() {
zoomspeed =  parseFloat($("#zoomspeed").val());
//console.log("zoomspeed", zoomspeed)
	// http://bl.ocks.org/jchlapinski/d51d9aca2084bc02f30b
zoommap.scaleGenerator(function (scale, delta, usecase) {
  if (usecase === 'mousewheel') { // usecase can be any of 'mousewheel', 'dblclick', 'touchzoom', 'dbltap'
  //console.log("if",scale + zoomspeed);
  
    return delta > 0 ? scale + zoomspeed : scale - zoomspeed; // always change scale to round values
  } else {
	  //console.log("else");
    return scalegen(scale, delta, usecase); // for other usecases keep the default behavior
  };
});
	
});

d3.select("#Projection").on("change", function() {
	
Projection = $("#Projection").val();

			if (Projection == "Albers") {
				projection = d3.geo.albers().center([ 10, 54 ]).rotate([ -3.5, 0 ]).parallels([ 50, 90 ]).scale(width * 1.45).translate([ width / 2, height / 2 ]);
			}; 
			if (Projection == "Lambert") {
//				projection = d3.geo.conicConformal().scale(1280).center([26, 60]).parallels([50, 90]);
				projection = d3.geo.conicConformal().scale(1280).center([7, 60]).rotate([-10, 0]).parallels([50, 90]);
			};
			if (Projection == "Mercator") {
				projection = d3.geo.mercator().center([15, 58.5]).scale(1000);
			};
			
path = d3.geo.path().projection(projection);
graticule = d3.geo.graticule()
 .extent([[-30, 20], [70 - 0.000001, 80 + 0.000001 ]])
.step([10, 10]);

	//z = svg.append("z");
    //g = svg.append("g");
//createMap(downloadUrl, nutsUrl, nutsUrl2);
//prepareData();
drawMap();
//drawLegend();
});

$("#scattervars").empty();
var items = "";
$.each(variables, function() {
items+="<option value="+"'"+this+"'"+">"+this+"</option>";
});
$("#scattervars").html(items);

// irrelevant for website: populate drop down menu for time periods, extremely badly coded
ThereIsTime = 0;
if (ThereIsTime) {
times = [];
data.forEach(function(d) {
times[d.t] = d['t'];
});
times.shift();
times.reverse();
//console.log('times:', times);
var items = "";
$.each(times, function() {
//	items+="<option value="+"'"+this+"'"+">"+this+"</option>";
});
$("#time").html(items);
};
// end of things we run only locally in this function  





};

// not used on website
// function to calculate and display summary statistics for selected variable    
function sumstats() {
        
        var coldata2 = {};
        var colarray = []; 
        //console.log('localdata', colSelected);
        
        data.forEach(function(d) {
			if (d.id.length < 6  && d.id.length != 0) {
        colarray.push(+d[colSelected]);
        coldata2[d.id] = +d[colSelected];
			}
        });
        
        //console.log('colarray:', colarray);
        
        $("#sumstats1").empty();
        
        colarray.sort(function(a, b) {
        return a - b;
        });
        
		v = colarray;
        
		lowest = v.slice(0,8);
        
		highest = v.slice(-8);
		
		//console.log("first lowest", lowest);
		//console.log("first highest", highest);
		
		//console.log("THEN");
        //console.log(v);
        //console.log(lowest);
        //console.log(highest);
        mean = d3.mean(v);
        p25 = d3.quantile(v, 0.25);
        p50 = d3.quantile(v, 0.50);
        p75 = d3.quantile(v, 0.75);
		//console.log("p75", p75);
        lowest.forEach(function(d) {console.log('lowest:',d)});
	    text = "Hi: ";

		highest.forEach(function(d) {
					counter = 0;
	        for(var key in coldata) {
		        if(coldata[key] == d) {
					counter++;
		           if (counter<2) {
					   text +=  key + ": " +  myround(d) + "&nbsp;&nbsp;&nbsp;&nbsp;";
					   }
		        }
		    }
		});
		
		text += "<br>Lo: ";
		
		lowest.forEach(function(d) {
					counter = 0;
			for(var key in coldata) {
				if(coldata[key] == d) {
					counter++;
				    if(counter<2) { 
					text +=  key + ": " +  myround(d) + "&nbsp;&nbsp;&nbsp;&nbsp;";
					}
			    }
			}
		});

        
                
		//console.log("first lowest", lowest);
		//console.log("first highest", highest);
//        text += "<br>mean: " + myround(mean) + "&nbsp;";
        text += "<br>p25: " + myround(p25) + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
        text += "p50: " + myround(p50) + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
        text += "p75: " + myround(p75) + "&nbsp;";
        $("#sumstats1").html(text);
    // end of sumstats function
};        
     
     
     
     
// code for scatterplot, NOT USED IN WEBSITE
function scatter() {

d3.select("#histcontainer").html("");
var scattersvg = d3.select("#histcontainer").append("svg");

var coldata = {}; 
var coldata2 = {}; 

data.forEach(function(d) {
coldata[d.id] = +d[colSelected];
});
data.forEach(function(d) {
coldata2[d.id] = +d[colSelected2];
});


var cValue = function(d) { return d.id.substring(0,2);},
color = d3.scale.category20();


var margin = {top: 50, right: 50, bottom: 50, left: 50},
width = 1000 - margin.left - margin.right,
height = 500 - margin.top - margin.bottom;

// draw scatterplot
var xValue =  function(d) { return coldata2[d.id];}, // data -> value
xScale = d3.scale.linear().range([0, width]), // value -> display
xMap = function(d) { return xScale(xValue(d));}, // data -> display
xAxis = d3.svg.axis().scale(xScale).orient("bottom");

// setup y
var yValue = function(d) { return coldata[d.id];}, // data -> value
yScale = d3.scale.linear().range([height, 0]), // value -> display
yMap = function(d) { return yScale(yValue(d));}, // data -> display
yAxis = d3.svg.axis().scale(yScale).orient("left");




scattersvg.attr("width", width + margin.left + margin.right)
.attr("height", height + margin.top + margin.bottom)
.append("g")
.attr("transform", "translate(" + margin.left + "," + margin.top + ")");


// add the tooltip area to the webpage
var tooltip = d3.select("#histcontainer").append("div")
.attr("class", "tooltip")
.style("opacity", 0);


// don't want dots overlapping axis, so add in buffer to data domain
//        xScale.domain([d3.min(data, xValue)-1, d3.max(data, xValue)+1]);
var r = Math.abs(d3.min(data, xValue)-d3.max(data, xValue));
var r2 = Math.abs(d3.min(data, yValue)-d3.max(data, yValue));
xScale.domain([d3.min(data, xValue)-r*0.05, d3.max(data, xValue)*1.05+r*0.05]);
//        yScale.domain([d3.min(data, yValue)-1, d3.max(data, yValue)+1]);
yScale.domain([d3.min(data, yValue)-r2*0.05, d3.max(data, yValue)+r2*0.05]);



// x-axis
scattersvg.append("g")
.attr("class", "x axis")
.attr("transform", "translate(0," + height + ")")
//        .attr("transform", "translate(" + 40 + ",0)")
.call(xAxis)
.append("text")
.attr("class", "label")
.attr("x", width)
.attr("y", -6)
.style("text-anchor", "end")
.text(colSelected2);

// y-axis
scattersvg.append("g")
.attr("class", "y axis")
.attr("transform", "translate(" + 40 + ",0)")
.call(yAxis)
.append("text")
.attr("class", "label")
.attr("transform", "rotate(-90)")
.attr("y", 6)
.attr("dy", "1.71em")
.style("text-anchor", "end")
.text(colSelected);



//console.log(data);
// draw dots
var dots =    scattersvg.selectAll(".dot")
.data(data)
.enter().append("g")

dots.append("text")
//        .attr("class", "dot")
//        .attr("r", 4)
//        .attr("cx", xMap)
//        .attr("cy", yMap)
.style("fill", function(d) { return color(cValue(d));}) 
.attr("font-family", "sans-serif")
.attr("font-size", "9px")
.attr("font-weight", "900")
.attr("x", function(d) { return xScale(xValue(d)) ; })
.attr("y", function(d) { return yScale(yValue(d)) ; })
.text(function(d) { return d.id.substring(0,2) ; })
.on("mouseover", function(d) {
//        //console.log(d.id.substring(0,2));
tooltip.transition()
.duration(200)
.style("opacity", .9);
tooltip.html(d.id + "<br/> (" + xValue(d) 
+ ", " + yValue(d) + ")")
.style("left", (d3.event.pageX + 5) + "px")
.style("top", (d3.event.pageY - 28) + "px");
})
.on("mouseout", function(d) {
tooltip.transition()
.duration(500)
.style("opacity", 0);
});

//        dots.append("text")
//        .attr("x", function(d) { return xScale(xValue(d)) ; })
//        .attr("y", function(d) { return yScale(yValue(d)) ; })
//        .text(function(d) { return d.id ; });





//        dots.selectAll("circle")


// end scatterplot
};


// CODE FOR DISPLAYING HISTOGRAM, NOT USED ON WEBSITE
function histogram() {




// remove color definitions 
// svg.selectAll("defs").remove();

svg.append("defs")

//console.log('HISTOGRAM',data.length);
//console.log('HISTOGRAM',data);

histvar = []; 

data.forEach(function(d) {
	if (d.id.length < 6  && d.id.length != 0 ) {
histvar.push(+d[colSelected]);
	}
});

console.log("histvar1",histvar);

// sort
histvar = histvar.sort(function(a, b){return a-b});
//console.log("length", histvar.length);
//console.log("histvar2",histvar);

// drop negative/positive, if checkboxes are used
histvar = histvar.filter(function(d) {
	return (poschecked)*(d>=0) + (negchecked)*(d<0);
})
// drop whatever was selected in menu
dropleft = $("#histcutleft").val();
dropright = $("#histcutright").val();

//console.log("cutleft", dropleft);
//console.log("cutright", dropright);

//console.log("histvar3",histvar);

if (dropright>0) {
histvar.splice(histvar.length - dropright, dropright);
}
if (dropleft>0) {
histvar.splice(0,dropleft);
}

minval = d3.min(histvar);
maxval = d3.max(histvar);

//console.log("min",minval);
//console.log("max",maxval);

if (minval == maxval) {
	
	minval = minval - 1;
	maxval = maxval + 1;
	}

// hardcoded, really bad
//console.log('col', histvar);
var minbin = minval;
var maxbin = maxval;
//console.log(minbin);
//console.log(maxbin);
var numbins = $("#histbins").val() - 1;
var binsize = (maxbin - minbin) / numbins;
//console.log('binsize',binsize);
minbin = minbin - binsize/2;
maxbin = maxbin + binsize/2;

//console.log("numbins",numbins);
//console.log("binsize",binsize);

// whitespace on either side of the bars in units of MPG
var binmargin = binsize*0.05; 
var margin = {top: 10, right: 30, bottom: 50, left: 60};
var width = 900 - margin.left - margin.right;
var height = 500 - margin.top - margin.bottom;

// Set the limits of the x axis
var xmin = minbin - binsize/2;
var xmax = maxbin + binsize/2;

histdata = new Array(numbins);
//console.log("AAAABBB");
//console.log("numbins", numbins);
//console.log("histdata", histdata);
for (var i = 0; i <= numbins; i++) {
//	//console.log("AAAABBB");
histdata[i] = { numfill: 0, meta: "" };
histdata[i].meta = "<table style='display: inline-block;'>";
}
//console.log("hmmm");

// Fill histdata with y-axis values and meta data
data.forEach(function(d) {
	if (d.id.length < 6  && d.id.length != 0) {
	if ((+d[colSelected]>=minval)&&(+d[colSelected]<=maxval)) {
//	//console.log("nieuw punt", d.id);
//	//console.log((+d[colSelected]));
//	//console.log((+d[colSelected] - minbin));
//	//console.log((+d[colSelected] - minbin) / binsize);
//	//console.log(Math.floor(+d[colSelected]/binsize)*binsize);
var bin = Math.floor((+d[colSelected] - minbin) / binsize);
// the very maximum observation has to be joined in the bin just below the cutoff
if (bin===numbins) {
//bin = numbins-1;	
};
//console.log('bin', bin);

if ((bin.toString() != "NaN") && (bin < histdata.length)) 
{
histdata[bin].numfill += 1;
//console.log('numfill', histdata[bin].numfill);
if ((histdata[bin].numfill % 20) == 0) {	
histdata[bin].meta += "</table>";
histdata[bin].meta += "<table style='display: inline-block;'>";
}
histdata[bin].meta += "<tr><td><font size='1'>" + d.id +
""  + 
"</font></td><td><font size='1'>" + 
+myround(d[colSelected]) + "</font></td></tr>";
}
	}
}
});

for (var i = 0; i <= numbins; i++) {
//histdata[i].meta += "</table><div style='clear:both'></div>";
histdata[i].meta += "</table>";
//console.log('i', i);
//console.log('histdata',histdata[i]);
//console.log('tooltipdata', histdata[i].meta);
histdata[i].avgval = 0;
histdata[i].min = 9999999999;
histdata[i].max = -9999999999;
histdata[i].num = i;
// try to calculate the average value within each bin, for colouring
data.forEach(function(d) {
	if ((+d[colSelected]>=minval)&&(+d[colSelected]<=maxval)) {
	// if obs in bin "i", add value value
if (Math.floor((+d[colSelected] - minbin) / binsize) == i) {
	// will be true for all obs that fall in bin i
	histdata[i].avgval += +d[colSelected];
	if (+d[colSelected] < histdata[i].min) {
		histdata[i].min = +d[colSelected];
		}
	if (+d[colSelected] > histdata[i].max) {
		histdata[i].max = +d[colSelected];
		}
		
	}
}
});
histdata[i].avgval = histdata[i].avgval/histdata[i].numfill;
}

//console.log('histdata',histdata);

// This scale is for determining the widths of the histogram bars
// Must start at 0 or else x(binsize a.k.a dx) will be negative
var x = d3.scale.linear()
.domain([0, (xmax - xmin)])
.range([0, width]);

// Scale for the placement of the bars
var x2 = d3.scale.linear()
.domain([xmin, xmax])
.range([0, width]);

var y = d3.scale.linear()
.domain([0, d3.max(histdata, function(d) { 
return d.numfill; 
})])
.range([height, 0]);

var xAxis = d3.svg.axis()
.scale(x2)
.orient("bottom");
var yAxis = d3.svg.axis()
.scale(y)
.ticks(8)
.orient("left");

var tip = d3.tip()
.attr('class', 'd3-tip')
.direction('e')
.offset([0, 20])
.html(function(d) {
return d.meta ;
});



// put the graph in the "histcontainer" div
d3.select("#histcontainer").html("");
var histsvg = d3.select("#histcontainer").append("svg").attr("class", "histogram").attr("preserveAspectRatio", "xMinYMin meet").attr("id", "histogram")
.attr("width", width + margin.left + margin.right)
.attr("height", height + margin.top + margin.bottom)
.append("g")
.attr("transform", "translate(" + margin.left + "," + 
margin.top + ")");

histsvg.call(tip);





//function(d){return getcolor(+histvar[d.id]);})

histdatamaxnumfill = 0;
histdata.forEach(function(d) {
	if (d.numfill>histdatamaxnumfill) {
	histdatamaxnumfill = d.numfill;
	}
});

var y = d3.scale.linear()
.domain([0, histdatamaxnumfill])
.range([height, 0]);

//console.log("HISTDATA",histdata);

// set up the bars
var bar = histsvg.selectAll(".bar")
.data(histdata)
.enter().append("g")
.attr("class", "bar")
//.attr("fill", "steelblue")
   .attr('fill',"white")
    .style('opacity',1)
    .attr('fill',function(d){
	if (histcolor == "nocolors") {
		return "steelblue";
	}
	else {
	// if mincolor = maxcolor, simply color
	if (getcolor(+d.min) == getcolor(+d.max)) {
//		console.log("drawinggggg",d);
		return getcolor(+((d.max+d.min)/2));
	}
	// else gradient
	else {

//console.log("drawinggggg",d);
//console.log("drawinggggg1",getcolor(+d.min));
//console.log("drawinggggg2",getcolor(+d.max));	
	var gradient = svg.append("defs")
  .append("linearGradient")
    .attr("id", "gradient" + d.num)
    .attr("x1", "0%")
    .attr("y1", "0%")
    .attr("x2", "100%")
    .attr("y2", "0%")
    .attr("spreadMethod", "pad");

gradient.append("stop")
    .attr("offset", "0%")
    .attr("stop-color", getcolor(+d.min) )
    .attr("stop-opacity", 1);

gradient.append("stop")
    .attr("offset", "100%")
    .attr("stop-color", getcolor(+d.max))
    .attr("stop-opacity", 1);
	
	
return "url(#gradient" + d.num + ")";

	}
	}
    })
.attr("shape-rendering","crispEdges")
.attr("transform", function(d, i) { return "translate(" + 
x2(i * binsize + minbin) + "," + y(d.numfill) + ")"; })
.attr("test", function(d, i) {return d.numfill})
.attr("testy", function(d, i) {return y(d.numfill)})
.attr("testheigth", function(d, i) {return height})
.on('mouseover', tip.show)
.on('mouseout', tip.hide);




// add rectangles of correct size at correct location
bar.append("rect")
.attr("x", x(binmargin))
.attr("width", x(binsize - 2 * binmargin))
.attr("height", function(d) { return height - y(d.numfill);});



// add the x axis and x-label
histsvg.append("g")
.attr("class", "x axis")
.attr("stroke-width","1px")
.attr("transform", "translate(0," + height + ")")
.call(xAxis);

//console.log("Y:", y(1));

// add the y axis and y-label
histsvg.append("g")
.attr("class", "y axis")
.attr("transform", "translate(0,0)")
.attr("stroke-width","1px")
.call(yAxis);
//histsvg.append("text")
//.attr("class", "ylabel")
//.attr("y", 0 - margin.left) // x and y switched due to rotation
//.attr("x", 0 - (height / 2))
//.attr("dy", "1em")
//.attr("transform", "rotate(-90)")
//.style("text-anchor", "middle")
//.text("# of fill-ups");

// end histogram

//.bar rect:hover{
//fill: rgba(0,0,0,.8);
//}



};
   
   
   


