

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
        var r = 0, c1 = 0, c2 = 0, c3 = 0;
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




// ─── CSV parsing ──────────────────────────────────────────────────────────────

// Returns true if the parsed rows look like they used the right delimiter.
// A bad delimiter causes the entire first row to collapse into one long key.
function isValidParse(rows) {
    if (!rows || !rows[1]) return false;
    var firstKey = Object.keys(rows[1])[0];
    return firstKey.length <= 10
        && firstKey.indexOf(";")  === -1
        && firstKey.indexOf("\t") === -1
        && firstKey.indexOf("|")  === -1;
}

// Tries comma, semicolon, tab, pipe in sequence until one produces a valid
// parse, then calls callback(rows). No global counter needed.
function loadAndParseCSV(url, callback) {
    var delimiters = [",", ";", "\t", "|"];
    function tryDelimiter(i) {
        if (i >= delimiters.length) {
            alert("Cannot make sense of datafile. The first column should contain NUTS codes. " +
                  "The first row should contain variable names. The name of the variable " +
                  "containing NUTS codes can be anything < 10 characters, but not empty. " +
                  "Avoid using ; and , in variable names.");
            throw new Error("Could not parse datafile with any supported delimiter.");
        }
        var dsv = d3.dsv(delimiters[i], "text/plain");
        dsv(url, function(error, rows) {
            if (isValidParse(rows)) {
                callback(rows);
            } else {
                tryDelimiter(i + 1);
            }
        });
    }
    tryDelimiter(0);
}




// ─── Data normalisation helpers ───────────────────────────────────────────────

// Region codes that only existed in NUTS 2006 (renamed or split in 2010).
var NUTS_2006_ONLY_CODES     = ["DE41", "DE42", "DED1", "DED3", "FI13", "FI18", "FI1A"];
var NUTS_2006_ONLY_PREFIXES  = ["ITD", "ITE", "GR"];   // Italy (ITD/ITE→ITH/ITI), Greece (GR→EL)

// Renames whatever the first column is called to "id", strips whitespace,
// and fixes the Excel date-formatting bug that turns "DEC0" into "Dec-00".
function normaliseIds(rows) {
    var firstCol = Object.keys(rows[1])[0];
    rows.forEach(function(d) {
        d.id = (d[firstCol] || "")
            .replace(/\s+/g, "")
            .replace(/[Dd]ec-00/, "DEC0");
    });
}

// Scans rows for region codes that only exist in NUTS 2006 and returns
// "2006" or "2010" accordingly.
function detectNutsVersion(rows) {
    for (var i = 0; i < rows.length; i++) {
        var id = rows[i].id || "";
        if (NUTS_2006_ONLY_CODES.indexOf(id) > -1) return "2006";
        for (var j = 0; j < NUTS_2006_ONLY_PREFIXES.length; j++) {
            if (id.substring(0, NUTS_2006_ONLY_PREFIXES[j].length) === NUTS_2006_ONLY_PREFIXES[j]) return "2006";
        }
    }
    return "2010";
}

// Writes per-variable settings (rows whose id is an HTML element ID) into
// the corresponding UI controls. Skips empty / NA values.
function applyVariableSettingsToUI(rows, colSelected) {
    rows.forEach(function(d) {
        if (d.id.length <= 5 || d.id.length === 0) return;   // skip data rows
        if (d[colSelected] === "NaN" || d[colSelected] === "NA" || d[colSelected] === "") return;
        var el = document.getElementById(d.id);
        if (!el) return;
        if (checkboxes.indexOf(d.id) > -1) {
            el.checked = typeof d[colSelected] === "boolean"
                ? d[colSelected]
                : d[colSelected].toLowerCase() === "true";
        } else {
            el.value = d[colSelected];
        }
        console.log("applying setting", d.id, "=", d[colSelected]);
    });
}

// Adds a placeholder setting row for any UI control that is not yet present
// in data, so settings can be saved for every variable later.
function ensureSettingRowsExist(data) {
    var allmenus = document.getElementsByClassName("form-inline");
    for (var i = 0; i < allmenus.length; i++) {
        var id = allmenus.item(i).getAttribute("id");
        var exists = data.some(function(e) { return e.id.indexOf(id) === 0; });
        if (!exists) {
            var el = { id: id };
            Object.keys(data[0]).forEach(function(key) { if (key !== "id") el[key] = ""; });
            data.push(el);
        }
    }
}

// Fills blank setting values with the application defaults loaded from
// default-settings.csv.
function fillDefaultSettings(data) {
    data.forEach(function(datapoint, index) {
        if (datapoint.id.length <= 5) return;   // skip data rows
        defaultsettings.forEach(function(setting) {
            if (setting.Setting !== datapoint.id) return;
            Object.keys(datapoint).forEach(function(key) {
                if (data[index][key] === "") data[index][key] = setting.Value;
            });
        });
    });
}

// Builds the coldata lookup (region id → value) for a given variable.
function buildColdata(data, col) {
    var result = {};
    data.forEach(function(d) {
        if (d.id.length > 0 && d.id.length < 6) result[d.id] = d[col];
    });
    return result;
}

// Writes the current UI control values into the data array for colSelected.
// Used when saving settings or switching variables.
function storeCurrentSettingsInData(data, col, applyToAll) {
    data.forEach(function(d, i) {
        if (d.id.length <= 5 || d.id.length === 0) return;
        if (isNaN(data[document.getElementById(d.id)]) == null) return;
        if (checkboxes.indexOf(d.id) > -1) {
            var val = document.getElementById(d.id).checked;
            if (applyToAll) {
                Object.keys(data[i]).forEach(function(key) { if (key !== "id") data[i][key] = val; });
            } else {
                data[i][col] = val;
            }
        } else {
            var el = document.getElementById(d.id);
            if (!el) return;
            if (applyToAll) {
                Object.keys(data[i]).forEach(function(key) { if (key !== "id") data[i][key] = el.value; });
            } else {
                data[i][col] = el.value;
            }
        }
    });
}




// ─── Map initialisation ───────────────────────────────────────────────────────

// Loads both NUTS TopoJSON files, then runs the full data-processing pipeline
// and hands off to redrawEverything().
function loadMapAndInitialise(nutsUrl, nutsUrl2) {
    queue().defer(d3.json, nutsUrl).defer(d3.json, nutsUrl2).await(function(error, _nuts2010, _nuts2006) {
        console.log("Reading in data for first time");

        // 1. Populate the variable dropdown from CSV column names.
        populateVariablesList(data);
        colSelected = $("#variableList").val();

        // 2. Normalise the id field in every row, then choose the right geometry.
        normaliseIds(data);
        var nutsVersion = detectNutsVersion(data);
        nuts = nutsVersion === "2006" ? _nuts2006 : _nuts2010;
        console.log("Detected NUTS version:", nutsVersion);

        // 3. Apply any per-variable settings stored in the CSV to the UI.
        applyVariableSettingsToUI(data, colSelected);

        // 4. Make sure every UI control has a row in data (so settings can be saved).
        ensureSettingRowsExist(data);

        // 5. Fill blanks with application defaults.
        fillDefaultSettings(data);

        // 6. Build coldata after settings may have changed the active variable.
        colSelected = $("#variableList").val();
        coldata = buildColdata(data, colSelected);

        legenddecimals = $("#legenddecimals").val();

        // 7. Set up projection and geographic path generator.
        Projection = $("#Projection").val();
        if (Projection === "Albers") {
            projection = d3.geo.albers().center([10, 54]).rotate([-3.5, 0]).parallels([50, 90]).scale(width * 1.45).translate([width / 2, height / 2]);
        } else if (Projection === "Lambert") {
            projection = d3.geo.conicConformal().scale(1280).center([10, 60]).rotate([-10, 0]).parallels([50, 90]);
        } else {
            projection = d3.geo.mercator().center([15, 58.5]).scale(1000);
        }
        path = d3.geo.path().projection(projection);
        graticule = d3.geo.graticule().extent([[-30, 20], [70 - 0.000001, 80 + 0.000001]]).step([10, 10]);

        // 8. Keep only region geometries that have data.
        nuts.objects.subunits.geometries = nuts.objects.subunits.geometries.filter(function(d) {
            return d.id in coldata;
        });

        _nuts2010 = null; _nuts2006 = null;

        // 9. Local-only setup (input panels etc.) – not used on server.
        if (typeof prepare_locally === "function") prepare_locally();

        // 10. Set up the cartogram helper; draw the map.
        if (document.getElementById("bysize").checked) {
            carto = d3.cartogram()
                .projection(projection)
                .properties(function(geom) { return geom.properties; })
                .value(function() { return 10; });
        } else {
            redrawEverything();
            bla2 = nuts.objects.subunits.geometries;
            bla  = bla2.filter(function(d) { return coldata[d.id] != null; });
            carto = d3.cartogram()
                .projection(projection)
                .properties(function(geom) { return geom.properties; })
                .value(function(d) { return Math.abs(coldata[d.id]); });
        }

        d3.select(self.frameElement).style("height", height + "px");

        registerEventHandlers();
    });
}




// ─── Event handlers ───────────────────────────────────────────────────────────

function registerEventHandlers() {

    // Save data + settings to CSV.
    d3.select("#savesettingsbutton").on("click", function() {
        storeCurrentSettingsInData(data, colSelected, false);
        var csvContent = "data:text/csv;charset=utf-8," + d3.csvFormat(data);
        var encodedUri = encodeURI(csvContent);
        var csvlink = document.createElement("a");
        csvlink.setAttribute("href", encodedUri);
        csvlink.setAttribute("download", "rhomolo-maps.csv");
        document.body.appendChild(csvlink);
        csvlink.click();
        document.body.removeChild(csvlink);
    });

    // Apply current settings to every variable in the file.
    d3.select("#applysettingsbutton").on("click", function() {
        storeCurrentSettingsInData(data, colSelected, true);
    });

    // Before switching variable: save current settings for the outgoing variable.
    // Use mouseenter so the save is already done before the click opens the dropdown.
    d3.select("#variableList").on("mouseenter", function() {
        storeCurrentSettingsInData(data, colSelected, false);
    });

    // After switching variable: load stored settings for the new variable and redraw.
    d3.select("#variableList").on("change", function() {
        colSelected = $("#variableList").val();
        applyVariableSettingsToUI(data, colSelected);
        coldata = buildColdata(data, colSelected);
        redrawEverything();
    });

    // Colour quantity / scheme changes.
    d3.select("#PosQuant").on("change", function() {
        if (StyleSelected === "custom") {
            if ($("#poscutoffs").val().length > 0) {
                var vals = $("#poscutoffs").val().split(",").map(parseFloat);
                document.getElementById("poscutoffs").value = vals.slice(0, parseInt($("#PosQuant").val()) + 1);
            }
            redrawRegions();
        } else {
            document.getElementById("groupingstyle").dispatchEvent(new Event("change"));
        }
    });

    d3.select("#PosColor").on("change", function() { redrawEverything(); });

    d3.select("#NegQuant").on("change", function() {
        if (StyleSelected === "custom") {
            if ($("#negcutoffs").val().length > 0) {
                var vals = $("#negcutoffs").val().split(",").map(parseFloat);
                document.getElementById("negcutoffs").value = vals.slice(-parseInt($("#NegQuant").val()) - 1);
            }
            redrawRegions();
        } else {
            document.getElementById("groupingstyle").dispatchEvent(new Event("change"));
        }
    });

    d3.select("#NegColor").on("change", function() { redrawEverything(); });

    // Custom cutoff inputs: redraw on Enter.
    document.getElementById("poscutoffs").addEventListener("keydown", function(e) {
        if (!e) e = window.event;
        if (e.keyCode !== 13) return;
        document.getElementById("groupingstyle").value = "custom";
        if ($("#poscutoffs").val().length === 0) document.getElementById("poscutoffs").value = 0;
        prepareData();
        drawMap();
        drawLegend();
        histogram();
    }, false);

    document.getElementById("negcutoffs").addEventListener("keydown", function(e) {
        if (!e) e = window.event;
        if (e.keyCode !== 13) return;
        document.getElementById("groupingstyle").value = "custom";
        if ($("#negcutoffs").val().length === 0) document.getElementById("negcutoffs").value = 0;
        prepareData();
        drawMap();
        drawLegend();
        histogram();
    }, false);

    // Translate input: apply stored map position on Enter.
    document.getElementById("translate").addEventListener("keydown", function(e) {
        if (!e) e = window.event;
        if (e.keyCode !== 13) return;
        var tr = $("#translate").val() || "translate(0,0)scale(1)";
        var t = d3.transform(tr).translate;
        var s = d3.transform(tr).scale;
        zoommap.scale(s[0]);
        zoommap.translate(t);
        zoommap.event(mapg0);
        drawMap();
    }, false);
}




// ─── Entry point ──────────────────────────────────────────────────────────────

function readSettings(settingsUrl, downloadUrl, nutsUrl, nutsUrl2) {

    d3.selectAll(".tooltip").remove();
    tooltipDiv = d3.select("body").append("div").attr("class", "tooltip").style("opacity", 0);

    // Load default settings first, apply them to the UI, then load the data file.
    queue().defer(d3.csv, settingsUrl).await(function(error, _settings) {
        console.log("Reading default settings from", settingsUrl);

        defaultsettings = _settings;
        checkboxes = ["displaynames", "drawgraticule", "legend100", "legendpercentage",
                      "drawshadecheck", "drawregbordercheck", "bysize", "nodata",
                      "poscheck", "negcheck", "poslegcheck", "neglegcheck", "drawcopyright"];

        _settings.forEach(function(d) {
            if (!d.Setting) return;
            var el = document.getElementById(d.Setting);
            if (!el) return;
            if (checkboxes.indexOf(d.Setting) > -1) {
                el.checked = typeof d.Value === "boolean" ? d.Value : d.Value.toLowerCase() === "true";
            } else {
                el.value = d.Value;
            }
        });

        // Initialise dimensions and zoom behaviours.
        width = 900;
        height = 900;
        legendwidth = 900;
        regionlist = [];
        countrylist = [];
        inputs = [];
        legendfontsize = "12px";
        legendfontweight = "bold";

        zoommap      = d3.behavior.zoom().scaleExtent([0.5, 50]).on("zoom", movemap);
        zoomposlegend = d3.behavior.zoom().scaleExtent([0.7, 50]).on("zoom", moveposlegend);
        zoomneglegend = d3.behavior.zoom().scaleExtent([0.7, 50]).on("zoom", moveneglegend);

        zoommap.scaleGenerator(function(scale, delta, usecase) {
            var zoomspeed = parseFloat($("#zoomspeed").val());
            if (usecase === "mousewheel") return delta > 0 ? scale + zoomspeed : scale - zoomspeed;
        });
        zoomposlegend.scaleGenerator(function(scale, delta, usecase) {
            if (usecase === "mousewheel") return delta > 0 ? scale + 0.1 : scale - 0.1;
        });
        zoomneglegend.scaleGenerator(function(scale, delta, usecase) {
            if (usecase === "mousewheel") return delta > 0 ? scale + 0.1 : scale - 0.1;
        });

        // Build the SVG and its layer stack.
        svg    = d3.select("#container").append("svg").attr("class", "svg-map").attr("id", "svg-map").attr("width", width).attr("height", height);
        maing  = svg.append("g").attr("class", "maing");
        mapg2  = maing.append("g").attr("class", "mapg2").call(zoommap);
        rect   = mapg2.append("rect").style("fill", "white").style("pointer-events", "mousedown");
        mapg0  = mapg2.append("g").attr("class", "mapg0");

        copyright     = svg.append("g").attr("class", "copyright");
        mainlegend    = svg.append("g").attr("class", "mainlegend");
        mainlegendpos = mainlegend.append("g").attr("class", "mainlegendpos").call(zoomposlegend);
        mainlegendneg = mainlegend.append("g").attr("class", "mainlegendneg").call(zoomneglegend);
        toplegendpos2 = mainlegendpos.append("g").attr("class", "toplegendpos2");
        toplegendneg2 = mainlegendneg.append("g").attr("class", "toplegendneg2");
        copyrightText = mainlegendpos.append("g").attr("class", "copyrightText");

        bordersize_reg    = 0.2;
        bordersize_ctrext = 0.5;
        bordersize_ctr    = 0.5;

        // Set projection (also used by prepareMap on redraw).
        Projection = $("#Projection").val();
        if (Projection === "Albers") {
            projection = d3.geo.albers().center([10, 54]).rotate([-3.5, 0]).parallels([50, 90]).scale(width * 1.45).translate([width / 2, height / 2]);
        } else if (Projection === "Lambert") {
            projection = d3.geo.conicConformal().scale(1280).center([10, 70]).rotate([-10, 0]).parallels([50, 190]);
        } else {
            projection = d3.geo.mercator().center([15, 58.5]).scale(1000);
        }
        path      = d3.geo.path().projection(projection);
        graticule = d3.geo.graticule().extent([[-30, 20], [70 - 0.000001, 80 + 0.000001]]).step([10, 10]);

        // Restore saved pan/zoom positions from the hidden inputs.
        var translate = $("#translate").val();
        if (typeof translate === "string") {
            zoommap.scale(d3.transform(translate).scale[0]);
            zoommap.translate(d3.transform(translate).translate);
            zoommap.event(mapg0);
        }
        translate = $("#poslegtranslate").val();
        if (typeof translate === "string") {
            zoomposlegend.scale(d3.transform(translate).scale[0]);
            zoomposlegend.translate(d3.transform(translate).translate);
            zoomposlegend.event(mapg0);
        }
        translate = $("#neglegtranslate").val();
        if (typeof translate === "string") {
            zoomneglegend.scale(d3.transform(translate).scale[0]);
            zoomneglegend.translate(d3.transform(translate).translate);
            zoomneglegend.event(mapg0);
        }

        // Now load the actual data file and initialise the map.
        loadAndParseCSV(downloadUrl, function(rows) {
            data = rows;
            loadMapAndInitialise(nutsUrl, nutsUrl2);
        });
    });
}
