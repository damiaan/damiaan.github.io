// draw the current data depending onvthe choice made in the menu


function redrawEverything() {
		
        prepareData();
		prepareMap();
		if (StyleSelected != "custom") {
		var element = document.getElementById("poscutoffs");
		element.value = poscutsplus;
		var element = document.getElementById("negcutoffs");
		element.value = negcutsplus;
		}
        drawMap();
		drawLegend();
        // not used on server
        if (typeof sumstats == 'function') {
            sumstats();
        }

        if (typeof histogram == 'function') {
            histogram();
        }
    };
    
	

function redrawRegions() {

prepareData();
if (((document.getElementById('bysize').checked == true) && (rescaled == true)) || ((document.getElementById('bysize').checked == false)  && (rescaled == false))) {
console.log("value of rescaled",d3.selectAll(".subunit2").attr("rescaled"));
mapg.selectAll(".subunit2") 
    .attr('fill',function(d){
    return getcolor(coldata[this.id]);
    });
}
else {
//		//console.log("value of rescaled",d3.selectAll(".subunit2").attr("rescaled"));
drawMap();
}
drawLegend();
histogram();
}






function drawMap() {
	
//d3.selectAll(".tooltip").remove();
	


    
poschecked =  document.getElementById('poscheck').checked;
negchecked =  document.getElementById('negcheck').checked;
	

	
    // if something was drawn before, remove it
	mapg0.selectAll(".mapg").remove();
	rect = mapg0.append("rect").style("fill", "white").style("width",width).style("height",height);
	mapg = mapg0.append("g").attr("class","mapg");

	
	
//	toplegend = d3.select("#svg-map").append("g").attr("class","toplegend");
//	toplegend = svg.append("g").attr("class","toplegend");


	
//	g.append("rect").attr("width", "100%").attr("height", "100%").attr("fill", "#CCFFFF");


if (document.getElementById('bysize').checked == false && document.getElementById('nodata').checked == true) {
	
	//console.log("SIZE FALSE");
	
if ( (document.getElementById('nodata').checked == true) & (document.getElementById('drawgraticule').checked == true) ) {	
lines = mapg.selectAll('path.graticule').data([graticule()]);
lines.enter().append('path').classed('graticule', true);
lines
.attr('d', path)
.attr("fill","none")
.attr("stroke","#79A09E")
.attr("stroke-width","1")
.attr("stroke-dasharray","1,1");
lines.exit().remove();
}

	
    /// DRAWING COUNTRIES... here we only fill the entire landmass in some colour (grey)... we will draw the borders between countries (interior/exterior) below, after (and on top) of colouring the regions
//    //console.log("nuts.objects.ctr", nuts.objects.ctr);

svg.selectAll("defs").remove();



	/* NEW STUFF, SHADE */
	
if (document.getElementById('drawshadecheck').checked == true ) {

var filter = svg.append("defs")
  .append("filter")
  .attr("id", "drop-shadow")
  .attr("height", "110%");
  
filter.append("feGaussianBlur")
.attr("in", "SourceAlpha")
.attr("stdDeviation", 3)
.attr("result", "blur");

filter.append("feOffset")
    .attr("in", "blur")
    .attr("dx", 3)
    .attr("dy", 3)
    .attr("result", "offsetBlur");

var feMerge = filter.append("feMerge");

feMerge.append("feMergeNode")
    .attr("in", "offsetBlur")
feMerge.append("feMergeNode")
    .attr("in", "SourceGraphic");

	gradient = svg.append("svg:defs")
  .append("svg:linearGradient")
    .attr("id", "gradient")
    .attr("x1", "0%")
    .attr("y1", "0%")
    .attr("x2", "0%")
    .attr("y2", "100%")
    .attr("spreadMethod", "pad");

gradient.append("svg:stop")
    .attr("offset", "0%")
    .attr("stop-color", "#0F3871")
    .attr("stop-opacity", 1);

gradient.append("svg:stop")
    .attr("offset", "100%")
    .attr("stop-color", "#175BA8")
    .attr("stop-opacity", 1);

mapg.append("path").datum(topojson.mesh(nuts, nuts.objects.ctr, function(a, b) {
    return a === b;
    })).attr("d", path).attr("class", "ctrext1").style("fill", "rgb(240,240,240)").style("filter", "url(#drop-shadow)");
	
	
	
}	 else {
mapg.append("path").datum(topojson.mesh(nuts, nuts.objects.ctr, function(a, b) {
    return a === b;
    })).attr("d", path).attr("class", "ctrext1").style("fill", "rgb(240,240,240)");
}	
	

	
	
	}
	
	    // TOOLTIPS for external countries
    mapg.selectAll(".countries").data(topojson.feature(nuts, nuts.objects.ctr).features).enter().append("path")
   	.style('stroke-opacity',0)
	.style('opacity',0)
    .attr("d", path).classed("countries", true);
	
if (document.getElementById('bysize').checked == false && document.getElementById('nodata').checked == true) {

	 mapg.selectAll(".countries").on(
    "mouseover",
    function(d) {
    d3.select(this).transition().duration(300)
	//.style("opacity",1)
	//.style("stroke-width",15);
    tooltipDiv.transition().duration(300).style("opacity", 1);
    tooltipDiv.text(
	d.properties.Name
	//+ ": " + regionnames[d.id] + " "  + myround(coldata[d.id])
	).style("left", d3.event.pageX + "px").style(
    "top", d3.event.pageY - 30 + "px");
    })
    .on("mouseout", function() {
    d3.select(this).transition().duration(300).style("opacity", 0);
    tooltipDiv.transition().duration(300).style("opacity", 0);
    });
    // when clicked, allow the user to enter inputs for the clicked region
    //.on("click", function(d){if (typeof showinput == 'function') {showinput(d.id)}});
}






if (document.getElementById('bysize').checked == false) {
  
  
    /// DRAW THE REGIONS IN THE CORRECT COLORS       
    //... now the most important drawing part: add the regions to the map and fill them according to the data
mapg.selectAll(".subunit2").data(topojson.feature(nuts, nuts.objects.subunits).features).enter().append("path")
    // by default, fill in regions with white... also below: if something goes wrong reading the , we use white
//   .attr('fill',"white")
//    .style('opacity',1)
    .attr('id',function(d){ d.id })
//	.attr('test',function(d){ return +coldata[d.id] })
//	.attr('test2',function(d){ return posscale(+coldata[d.id]) })
    .attr('fill',function(d){
				  console.log("BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB");
				  console.log(coldata[d.id]);
				  console.log(getcolor(coldata[d.id]));
//	if (d.id.substring(0,2) != "UK") {
				  return getcolor(coldata[d.id]);
//				  }
	})
//    .style('display',function(d){
//				  return getcolor(coldata[d.id]) == "black" ? "none": null;})
	.attr("d", path).classed("subunit2", true);
	
rescaled = false;
//	//console.log("JAAAAAAAAAAAAAAAAAA");

/*
// to remove UK
mapg.selectAll(".subunit2")
.attr('opacity',function(d){
		if (d.id.substring(0,2) == "UK") {
			return 0;
		}
		else {
			return 1
		}
})
*/


// to display the region name
if (document.getElementById('displaynames').checked == true) {
	 mapg.selectAll(".subunit3").data(topojson.feature(nuts, nuts.objects.subunits).features).enter().append("text")
	 .attr("class", "label")
	 .attr("transform", function(d) { return "translate(" + path.centroid(d) + ")"; })
	 .style("font-size", "5px")
 	 .style("font-weight", "bold")
	 .style("font-family", "Arial, sans-serif")
	 .attr('visibility',function(d){
    //	if (d.id.substring(0,2) != "UK") {
				  return getcolor(coldata[d.id]);
				  })
     .attr("dx", function(d){return -6})
	 .attr("dy", function(d){ if ((d.id == "DE40")|(d.id == "BE24")|(d.id == "UKI2")|(d.id == "CZ02"))  {return -5}})
     .text(function(d){return d.id});
}


}




// morph


/*
            var provinces = mapg.append("g")
                .attr("class", "subunit2")
                .selectAll("path")
                .data(newpp)
                // .data(features)
                .enter().append("path")
//               .attr("class", "province")
                .attr("d", path)
				.classed("subunit2", true)
				    .attr('fill',function(d){
//				  //console.log("BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB");
	//			  //console.log(getcolor(coldata[d.id]));
				  return getcolor(coldata[d.id]);});
				
				// .attr("d", carto.path)
                //.attr("transform", "translate(0,350)" +
                //      "scale(0.75,0.75)");

//            var title = provinces.append("title")
//                   .text(function(d) { return get_id_length(d) + ": " + d.id; });
*/

if (document.getElementById('bysize').checked == true) {
	
	//console.log("BYSIZE TRUE");


	thecarto = carto(nuts, nuts.objects.subunits.geometries);
	collection = {type: "FeatureCollection", features: thecarto.features}; // GeoJSON
	topology = topojson.topology({collection: collection}); // convert to TopoJSON
	
			//console.log("nuts", nuts);
			//console.log("ctr", nuts.objects.ctr);
			//console.log("carto",thecarto);
			//console.log("features", thecarto.features);
			
			
	
//    newnuts = (JSON.parse(JSON.stringify(nuts)));
//	newnuts["arcs"] = thecarto["arcs"];
//	newnuts.objects.subunits.geometries =  thecarto["features"];
//	newnuts.objects.subunits.type = "GeometryCollection";
		
	//newfeaturecollection = carto
//	//console.log("collection",collection);
	//console.log("topo",topology);
	//console.log("topo",countrylist);
	//console.log("toptooo" , topology.objects);

	



     mapg.selectAll(".subunit2").data(thecarto.features).enter().append("path")
//              .transition()
//               .duration(2000)
//                .ease("sin-in-out")
				.attr("class","subunit2")
                .attr("d", carto.path)
				.attr("id",function(d){return d.id;})
				.attr('fill',function(d){return getcolor(coldata[d.id]);});

	countrylist.forEach(function(d) {	
	var ctr = topojson.mergeArcs(topology,topology.objects.collection.geometries.filter(function(z) {return (z.id.substring(0,2) == d);}));
	mapg.append("path").datum(topojson.mesh(topology,ctr)).attr("d", carto.path).attr("class", "cartoctrborder").style("stroke", "black").style("stroke-width", bordersize_ctr).style("fill", "none");
	});
				
rescaled = true;


/// this does work!
//mapg.append("path").datum(topojson.mesh(thecarto)).attr("d", carto.path).attr("class", "ctrext1").style("stroke", "black").style("stroke-width", bordersize_ctr).style("fill", "none");

//mapg.append("path").datum(topojson.mesh(topology)).attr("d", carto.path).attr("class", "ctrext1").style("stroke", "black").style("stroke-width", bordersize_ctr).style("fill", "none");

}


				


	if (document.getElementById('bysize').checked == false && document.getElementById('nodata').checked == true ) {

	// after drawing the regions and coloring them according to the values in the data, we redraw the borders of countries on top of the regions.
    mapg.append("path").datum(topojson.mesh(nuts, nuts.objects.ctr, function(a, b) {
    return a !== b;
    })).attr("d", path).attr("class", "ctr2").style("stroke", "black").style("stroke-width", bordersize_ctr).style("fill", "none");
	
    mapg.append("path").datum(topojson.mesh(nuts, nuts.objects.ctr, function(a, b) {
    return a === b;
    })).attr("d", path).attr("class", "ctrext2").style("stroke", "black").style("stroke-width", bordersize_ctrext).style("fill", "none");
	    
	}
//	//console.log("JAAAAAAAAAAAAAAAAAA");
	
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
	
	


//	//console.log("JAAAAAAAAAAAAAAAAAA");
	
	

	
	// if the user wants to "visually merge" some regions

  //svg.append("path")
  //    .datum(selection)
  //    .attr("class", "state selected")
  //    .attr("d", path);

		

	
	/* if we do so, add pointer-events: none, to the underlying colored regions layer, in css
	/// after adding everything, overlay with regions, again, but now transparently, such that tooltips can be attached, and always show up even if underlying there is a countryborder
	 mapg.selectAll(".subunit").data(topojson.feature(nuts, nuts.objects.subunits).features).enter().append("path")
    // by default, fill in regions with white... also below: if something goes wrong reading the , we use white
	.style('stroke-opacity',0)
	.style('opacity',0)
    .attr("d", path).classed("subunit", true);
	*/
	
	

	// TOOLTIPS when hovering above regions
    mapg.selectAll(".subunit2").on("mouseover",
    function(d) {
    d3.select(this).transition().duration(300)
//	.style("opacity",1)
//	.style("stroke-width",);
    tooltipDiv.transition().duration(300).style("opacity", 1);
    tooltipDiv.text(
	d.id + ": " + d.properties.Name + " "  + myround(coldata[d.id])
	).style("left", d3.event.pageX + "px").style(
    "top", d3.event.pageY - 30 + "px");
    })
    .on("mouseout", function() {
//    d3.select(this).transition().duration(300).style("opacity", 0);
    tooltipDiv.transition().duration(300).style("opacity", 0);
    })
	
	

	/*
	    /// DRAW THE REGIONS IN THE CORRECT COLORS       
    //... now the most important drawing part: add the regions to the map and fill them according to the data
    mapg.selectAll(".selectedreg").data(selection).enter().append("path")
    // by default, fill in regions with white... also below: if something goes wrong reading the , we use white
    .style('opacity',1)
    .attr('fill',function(d){return getcolor(coldata[d.id]);})
	.attr("d", path).classed("selectedreg", true);
	*/
	
//	merge = "AA"
//	//console.log(merge);

		
	// usermergeselected = d3.set(merge);
	
mergeinput =  $("#MergeRegs").val();
outerbordersize =  $("#outerbordersize").val();
merge = mergeinput.split(",");

posadd = ($("#PosColor").val() == "Add"); 
negadd = ($("#NegColor").val() == "Add");

if (posadd == 1 && negadd == 1) {
	document.getElementById("PosColor").value = "Blues";
	posadd = 0;
	prepareData();
	drawMap();
}
	
	if (merge[0] !== "") {
	usermergeselected = d3.set(merge);
	selection = topojson.feature(nuts, nuts.objects.subunits).features.filter(function(d) {return usermergeselected.has(d.id);});
//	//console.log("SELECTION", selection);
	// redraw border of each selected region
	selection.forEach(function(d) {
	mapg.append("path")
      .datum(d)
	  .attr('fill', function(d){return getcolor(coldata[d.id]);})
	  .attr('stroke', function(d){return getcolor(coldata[d.id]);})
	  .attr('stroke-width',0.3)
	  .attr("class", "test")
	  .attr("d", path);
	});
	
	// border of merged selected region
	mergedselection = topojson.merge(nuts,  nuts.objects.subunits.geometries.filter(function(d) {return usermergeselected.has(d.id)}));
//	//console.log("merged SELECTION", mergedselection);
	mapg.append("path")
      .datum(mergedselection)
	  .attr("fill","none")
	  .attr("stroke","black")
	  .attr("stroke-width",outerbordersize)
      .attr("d", path);
	} 

	  
	/*  
// Graticule lines (above everything, but thin)
lines = mapg.selectAll('path.graticule').data([graticule()]);
lines.enter().append('path').classed('graticule', true);
lines
.attr('d', path)
.attr("fill","none")
.attr("stroke","#79A09E")
.attr("stroke-width","1")
.attr("stroke-dasharray","1,1");
lines.exit().remove();
	  */
	
    // when clicked, allow the user to enter inputs for the clicked region
//    .on("click", function(d){if (typeof showinput == 'function') {showinput(d.id)}});

//mapg0.selectAll(".tooltip").remove();

drawcopyright =  document.getElementById('drawcopyright').checked;

function drawCopyright () {
copyright.selectAll(".copyright2").remove()	
copyright2 = copyright.append("g").attr("class","copyright2");
copyright2.append("text").attr("class", "legendtext").text("© EuroGeographics for the administrative boundaries").attr("x",30).attr("y",30).style("font-size","12px").style("font-weight","normal");
copyright2.append("text").attr("class", "legendtext").text("© European Commission, Joint Research Centre (JRC), B.3 Territorial Development").attr("x",30).attr("y",15).style("font-size","12px").style("font-weight","normal");
   	
}

if (drawcopyright) {drawCopyright()} 
else {copyright.selectAll(".copyright2").remove()};





}; /// end of function for drawing the map;





function drawLegend(){
	
	
poschecked =  document.getElementById('poscheck').checked;
negchecked =  document.getElementById('negcheck').checked;

poslegcheck =  document.getElementById('poslegcheck').checked;
neglegcheck =  document.getElementById('neglegcheck').checked;

//console.log("poschecked",poschecked);
//console.log("negchecked",negchecked);
	


	
	//console.log("begin legend", legendorientation);

	    // if something was drawn before, remove it
	
//    svg.selectAll(".mainlegend").remove();
    toplegendpos2.selectAll(".toplegendpos").remove();
    toplegendneg2.selectAll(".toplegendneg").remove();
	

// this will contain the contents of the legend
	toplegendpos = 	toplegendpos2.append("g").attr("class","toplegendpos");
	legendposwhite = toplegendpos.append("g").attr("class","legendposwhite");
	legendposbars  = toplegendpos.append("g").attr("class","legendposbars");
	legendpostext  = toplegendpos.append("g").attr("class","legendpostext");	
	

	toplegendneg = toplegendneg2.append("g").attr("class","toplegendneg");
	legendnegwhite = toplegendneg.append("g").attr("class","legendnegwhite");
	legendnegbars  = toplegendneg.append("g").attr("class","legendnegbars");
	legendnegtext  = toplegendneg.append("g").attr("class","legendnegtext");
	
	
	
	
    // DRAWING THE LEGEND
    //on top of everything, we draw the legends. These legends are attached to the object svg (and not to "g" which is a child of SVG), this to avoid rescaling on zoom
    var gridSize = Math.floor(legendwidth / 24);
    var legendElementWidth = gridSize * 2;
    var legendElementHi = gridSize;
    
	if (legendorientation == "horizontal") {
		
		
	
    // draw LEGEND FOR NEGATIVE VALUES, if there are negative values
    if (negdomain.length > 0 && negchecked == true && neglegcheck == true) {
		
	//console.log("poschecked", poschecked);
	//console.log("color set for neglegend", negcolors );
	//console.log("in legend negcuts",negcuts);
	//console.log("in legend negcuts",negcuts.length);
		
	// white background of correct size
	toplegendneg.selectAll(".legendnegwhite").append("rect").attr("x",5).attr("y", 95).attr("width", legendElementWidth * negcuts.length  + 51).attr("height", gridSize*1.13).style("fill","white").attr("stroke","black").attr("stroke-width","0.2");
	// colored bars
    legend2 = legendnegbars.selectAll(".legend").data(negcuts).enter().append("g").attr("class", "legend");
    legend2.append("rect").attr("x", function(d, i) {
    return 25 + legendElementWidth * i;
    }).attr("y", 100).attr("width", legendElementWidth).attr("height", gridSize / 2).style("fill",
    function(d, i) {
    return negcolors2[i];
    });
    // text with values corresponding to the colors, for the legend. If there are very few values, we don't work with colors for values from-to, but we draw a color exactly matching a single value in the data (and put an "=" mark)
//	if (negdomain.length == NegQuantSelected) {
//    legend3 = legendnegtext.selectAll(".legend").data(negcuts, function(d) {return d;}).enter().append("g").attr("class", "legend");
//	 }
//	 else {
		 	   // if we are working with fixed steps for grouping
		   if (isNaN(+StyleSelected)) {
			   //console.log("nan");
			   add = d3.min([d3.min(negdomain),d3.min(negcutsplus)]);
		   }
		   else {
			   //console.log("nonnan");
			   add = d3.min([d3.min(negdomain),+StyleSelected*NegQuantSelected*(-1)]);
		   }
    legend3 = legendnegtext.selectAll(".legend").data([add].concat(negcuts)).enter().append("g").attr("class", "legend");		 
//	 }
    legend3.append("text").attr("class", "legendtext").text(function(d,i) {
    tmp = negdomain.slice()
//    if (negdomain.length == NegQuantSelected) {return "\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0= " + myround(tmp[i])} 
//    else {
		return myround(d)
//		};
    }).attr("x", function(d, i) {
    return 10 +legendElementWidth * i;
    }).attr("y",  100+gridSize*0.9).style("font-size",legendfontsize).style("font-weight",legendfontweight);
    }
	
    
    // draw LEGEND FOR POSITIVE VALUES (if there are any positive values)
	//console.log("poschecked", poschecked);
    if (posdomain.length > 0 && poschecked == true  && poslegcheck == true) {
		
	//console.log("poschecked", poschecked);
	//console.log("HORIZONTAL LEGEND");
	//console.log(poscuts);
	//console.log(poscuts);
	
	// white background
	toplegendpos.selectAll(".legendposwhite").append("rect").attr("x",5).attr("y", 45).attr("width", legendElementWidth * poscuts.length  + 51).attr("height", gridSize*1.13).style("fill","white").attr("stroke","black").attr("stroke-width","0.2");
	
	// a square with the right color for the legend   
    legend = legendposbars.selectAll(".legend").data(poscuts).enter().append("g").attr("class", "legend");		   
    legend.append("rect").attr("x", function(d, i) {
	// begin 12.5 to the right; for a width of 12.5 less. 
    return 25 + legendElementWidth * i;
    }).attr("y", 50).attr("width", legendElementWidth).attr("height", gridSize / 2).style("fill",
    function(d, i) {
    return poscolors[i];
    });

	// legend text
//	if (posdomain.length == PosQuantSelected)  {
//	legend0 = legendpostext.selectAll(".legend").data(poscuts, function(d) {return d;}).enter().append("g").attr("class", "legend");
//	}
//	else {
	legend0 = legendpostext.selectAll(".legend").data(poscutsplus).enter().append("g").attr("class", "legend");
//	};
	 // text with values corresponding to the colors, for the legend. If there are very few values, we don't work with colors for values from-to, but we draw a color exactly matching a single value in the data
    legend0.append("text").attr("class", "legendtext").text(function(d,i) {
//    if (posdomain.length == PosQuantSelected) {return "\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0= " + myround(posdomain[i])} 
//    else {
		//console.log("printing legend",i);
		//console.log("printing legend",d);
		return myround(d)  
//	}
    }).attr("x", function(d, i) {
    return 10 +legendElementWidth * i;
    }).attr("y",  50+gridSize*0.9).style("font-size",legendfontsize).style("font-weight",legendfontweight);

	
	// end positive values, horizontal legend
    }
	
	/// end horizontal legend
	}
	
	
	
	// vertical legend
	else {
	
    // draw LEGEND FOR NEGATIVE VALUES, if there are negative values
    if (negdomain.length > 0 && negchecked == true  && neglegcheck == true) {
		
	toplegendneg.selectAll(".legendnegwhite").append("rect").attr("x",750).attr("y", legendElementHi * (poscuts.length-1)  + 51 + 20 + 10).attr("width", legendElementWidth + 60).attr("height", legendElementHi * (negcuts.length-1)  + 51).style("fill","white").attr("stroke","black").attr("stroke-width","0.2");
	
	// colors
    legend2 = legendnegbars.selectAll(".legend").data(negcuts).enter().append("g").attr("class", "legend");
	legend2.append("rect").attr("y", function(d, i) {
    return legendElementHi * (poscuts.length-1)  + 81 + 6 +  legendElementHi * (negcuts.length-1) - legendElementHi * i;
    }).attr("x", 760).attr("width", legendElementWidth + 40).attr("height", legendElementHi).style("fill",
    function(d, i) {
    return negcolors2[i];
    });
	
	// text
//	if (negdomain.length == NegQuantSelected) {
//    legend3 = legendnegtext.selectAll(".legend").data(negcuts, function(d) {return d;}).enter().append("g").attr("class", "legend");
//	 }
//	 else {
	console("negcutsplus",negcutsplus)
    legend3 = legendnegtext.selectAll(".legend").data(negcutsplus).enter().append("g").attr("class", "legend");		 
//	 }
    
    // text with values corresponding to the colors, for the legend. If there are very few values, we don't work with colors for values from-to, but we draw a color exactly matching a single value in the data (and put an "=" mark)
    legend3.append("text").attr("class", "legendtext").text(function(d,i) {
    tmp = negdomain.slice()
//    if (negdomain.length == NegQuantSelected) {return "\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0= " + myround(tmp[i])} 
//    else {
	if (i < negcuts.length) {
		return "[" + myround(negcutsplus[i]) + ", " + myround(negcutsplus[i+1]) + "]" ; 
		}		
		else {return "";}	
//	};
    }).attr("y", function(d, i) {
    return legendElementHi * (poscuts.length)  + 81 - 5 +  legendElementHi * (negcuts.length-1) - legendElementHi * i;
    }).attr("x",  761).style("font-size",legendfontsize).style("font-weight",legendfontweight)
	.style("fill", function(d, i) {
	if ((negcuts.length > 5)*(i < 2)) {return "white"} else { return "black"};	
	});
    }
	
    
	//console.log("color set for legend", poslegcheck );
	//console.log("color set for legend", drawregbordercheck );
	//console.log("color set for legend", nodata );
	//console.log("color set for legend", poschecked );
	
    // draw LEGEND FOR POSITIVE VALUES (if there are any positive values)
    if (posdomain.length > 0 && poschecked == true && poslegcheck == true) {
	
	
	
	//console.log("color set for legend", poscolors );
	//console.log("in legend poscuts",poscuts);
	//console.log("in legend poscuts",poscuts.length);
	toplegendpos.selectAll(".legendposwhite").append("rect").attr("x",750).attr("y",20).attr("width", legendElementWidth + 60).attr("height", legendElementHi * (poscuts.length - 1)  + 51).style("fill","white").attr("stroke","black").attr("stroke-width","0.2");

    // a square with the right color for the legend   
	//append("g").attr("class", "legend")
	legend = legendposbars.selectAll(".legend").data(poscuts).enter()
	.append("rect").attr("y", function(d, i) {
	// begin 12.5 to the right; for a width of 12.5 less. 
    return legendElementHi * (poscuts.length-1)  + 26 - legendElementHi * i;
    }).attr("x", 760).attr("width", legendElementWidth + 40).attr("height", legendElementHi).style("fill",
    function(d, i) {
		//console.log("poscolor i",i);
		//console.log("poscolor i",poscolors[i]);
    return poscolors[i];
    });

	
    // text with values corresponding to the colors, for the legend. If there are very few values, we don't work with colors for values from-to, but we draw a color exactly matching a single value in the data
//	if (posdomain.length == PosQuantSelected)  {
//	legend0 = legendpostext.selectAll(".legend").data(poscuts, function(d) {return d;}).enter().append("g").attr("class", "legend");
//	}
//	else {
	legend0 = legendpostext.selectAll(".legend").data(poscutsplus).enter().append("g").attr("class", "legend");
//	};
    legend0.append("text").attr("class", "legendtext").text(function(d,i) {
//    if (posdomain.length == PosQuantSelected) {return "\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0= " + myround(posdomain[i])} 
//    else {
		if (i < poscuts.length) {
		return "[" + myround(poscutsplus[i]) + ", " + myround(poscutsplus[i+1]) + "]" ; 
		}		
		else {return "";}
//	}
    }).attr("y", function(d, i) {
    return legendElementHi * (poscuts.length)  + 12 - legendElementHi * i;
    }).attr("x", 766).style("font-size",legendfontsize).style("font-weight",legendfontweight)
	.style("fill", function(d, i) {
	if (i < 3) {return "black"} else { if (poscuts.length - i < 3) {return "white"}};	
	});
	
    }
	}

}; // end function for drawing the legend.



// what to do when zooming. I would like to have zooming in smaller steps and experimented around, but i don't get
// it to work correctly
function movemap() {
    var t = d3.event.translate;
    var s = Math.pow(d3.event.scale,1);
//      var s = Math.pow(d3.event.scale,1);
//    var zscale = Math.sqrt(s);
    var h = height / 4;
	
//	t[0] = 
    
//    t[0] = Math.min(width / height * (s - 1), Math.max(width * (1 - s), t[0]));
//    t[1] = Math.min(h * (s - 1) + h * s, Math.max(height * (1 - s) - h * s, t[1]));
    
//	    new_translate[0] = zoom_cp[0] - (zoom_cp[0] - prev_translate[0]) * new_scale / prev_scale;
//        new_translate[1] = zoom_cp[1] - (zoom_cp[1] - prev_translate[1]) * new_scale / prev_scale;
	
//    zoommap.translate(t);
//    g.attr("transform", "translate(" + t + ")scale(" + s + ")");
    //g2.attr("transform", "translate(" + t + ")scale(" + s + ")");

//	  t[0] = Math.min(width / height * (s - 1), Math.max(width * (1 - s), t[0]));
//    t[1] = Math.min(h * (s - 1) + h * s, Math.max(height * (1 - s) - h * s, t[1]));
    
//    zoommap.translate(t);
    mapg0.attr("transform", "translate(" + t + ")scale(" + s + ")");
	
    // adjust the country-region border stroke width based on zoom level
	
/*	
	if (document.getElementById('drawregbordercheck').checked == true) {
	mapg0.selectAll(".subunit2").style("stroke", "white");
	mapg0.selectAll(".subunit2").style("stroke-width",  bordersize_reg );
	}
	else {
	mapg0.selectAll(".subunit2").data(topojson.feature(nuts, nuts.objects.subunits).features)
	  .attr('stroke', function(d){
		  return getcolor(coldata[d.id]);
		  })
	  .attr('stroke-width', bordersize_reg )
	  .attr("class", "test");
	}
*/	
	
	

	
	
	
//    mapg0.selectAll(".ctrext2").style("stroke-width", bordersize_ctrext / Math.sqrt(s));
//    mapg0.selectAll(".ctr2").style("stroke-width", bordersize_ctr / Math.sqrt(s));

	var element = document.getElementById("translate");
	element.value = "translate(" + t + ")scale(" + s + ")";

};



function moveneglegend() {
//s = $("#legendsize").val();
var s = d3.event.scale;
var t = d3.event.translate;
toplegendneg2.attr("transform", "translate(" + t + ")" + "scale(" + s + ")");
var element = document.getElementById("neglegtranslate");
element.value = "translate(" + t + ")scale(" + s + ")";
};



function moveposlegend() {
var s = d3.event.scale;
var t = d3.event.translate;
toplegendpos2.attr("transform", "translate(" + t + ")" + "scale(" + s + ")");
var element = document.getElementById("poslegtranslate");
element.value = "translate(" + t + ")scale(" + s + ")";
};


    
// geo translation on mouse click in map
function click() {
    var latlon = projection.invert(d3.mouse(this));
}