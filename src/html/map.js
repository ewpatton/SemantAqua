/* -*- espresso-indent-level: 2; tab-width: 8; -*- */
var map = null;
var geocoder = null;
var pollutedwatersource = new Array();
var violatedfacility = new Array();
var pollutedMarkers = new Array();
var cleanMarkers = new Array();
var violatedMarker = new Array();
var facilityMarker = new Array();
var state;
var countyCode;
var start;
var limit = 5;
var stateCode = "";
var healthEffect = "";
var curPage = 0;
var wqpMarkers = {
	"pollutedWater" : [],
	"cleanWater" : [],
	"pollutedFacility" : [],
	"facility" : [],
	"flood" : []
}
var stateAbbr2Code = [];
stateAbbr2Code["RI"] = "US:44";
stateAbbr2Code["CA"] = "US:06";
stateAbbr2Code["MA"] = "US:25";
stateAbbr2Code["NY"] = "US:36";
var pagedData = [];
var lat, lng;
var zipcode;
var countyFips;
var industry;
//
var reg = new Array(3);
// Array that contains the name of the regulations for human
reg['human'] = new Array(5);
reg['human']['EPA'] = "EPA Regulation";
reg['human']['ca'] = "CA Regulations";
reg['human']['ma'] = "MA Regulations";
reg['human']['ny'] = "NY Regulations";
reg['human']['ri'] = "RI Regulations";
// Array that contains the name of the regulations for aquatic life
reg['aquatic'] = new Array(2);
reg['aquatic']['EPA'] = "EPA regulation for aquatic life";
reg['aquatic']['ne'] = "NE regulation for aquatic life";
// Array that contains the name of the regulations for canadian goose
reg['CanadaGoose'] = new Array(2);
reg['CanadaGoose']['EPA'] = "EPA regulation for aquatic life";
reg['CanadaGoose']['ne'] = "NE regulation for aquatic life";

//
esciencePrefix = "http://escience.rpi.edu/ontology/semanteco/2/0/";
sparqlPrefix = "http://sparql.tw.rpi.edu/ontology/semanteco/2/0/";
var regOwl = new Array(2);
// Array for the owl files of the regulations for human
regOwl['human'] = new Array(5);
regOwl['human']['EPA'] = "EPA-regulation.owl";
regOwl['human']['ca'] = "ca-regulation.owl";
regOwl['human']['ma'] = "ma-regulation.owl";
regOwl['human']['ny'] = "ny-regulation.owl";
regOwl['human']['ri'] = "ri-regulation.owl";
regOwl['aquatic'] = new Array(2);
regOwl['aquatic']['EPA'] = "epa-aqua-acute-regulation.owl";
regOwl['aquatic']['ne'] = "species-regulation.owl";

// naics code
var naicsCode = new Array();
naicsCode['all'] = 'All Data';
naicsCode['11'] = 'Agriculture, Forestry, Fishing and Hunting';
naicsCode['21'] = 'Mining, Quarrying, and Oil and Gas Extraction';
naicsCode['22'] = 'Utilities';
naicsCode['31-32-33'] = 'Manufacturing';
naicsCode['42'] = 'Wholesale Trade';
naicsCode['44-45'] = 'Retail Trade';
naicsCode['48-49'] = 'Transportation and Warehousing';
naicsCode['51'] = 'Information';
naicsCode['52'] = 'Finance and Insurance';
naicsCode['53'] = 'Real Estate and Rental and Leasing';
naicsCode['54'] = 'Professional, Scientific, and Technical Services';
naicsCode['55'] = 'Management of Companies and Enterprises';
naicsCode['56'] = 'Administrative and Support and Waste Management and Remediation Services';
naicsCode['61'] = 'Educational Services';
naicsCode['62'] = 'Health Care and Social Assistance';
naicsCode['71'] = 'Arts, Entertainment, and Recreation';
naicsCode['72'] = 'Accommodation and Food Services';
naicsCode['81'] = 'Other Services (except Public Administration)';
naicsCode['92'] = 'Public Administration';

var highlight = [];

function isChecked(str) {
	var el = document.getElementById(str);
	return el.checked;
}

function closeHelpers() {
	if (codesWindow)
		codesWindow.close();
}

function showhide(str) {
	var check = document.getElementById(str);
	if (check.checked) {
		for ( var i = 0; i < window.wqpMarkers[str].length; i++) {
			window.wqpMarkers[str][i].show();
		}
	} else {
		for ( var i = 0; i < window.wqpMarkers[str].length; i++) {
			window.wqpMarkers[str][i].hide();
		}
	}
}

function initialize() {
	if (GBrowserIsCompatible()) {
		map = new GMap2(document.getElementById("map_canvas"));
		map.setCenter(new GLatLng(37.4419, -122.1419), 10);
		var c = new GLargeMapControl();
		map.addControl(c, c.getDefaultPosition());
		geocoder = new GClientGeocoder();
	}

	document.getElementById("species").selectedIndex = 1;
	onchange_species_selection();
	// for industry facet
	fill_industry_selection();
}

function fill_industry_selection() {
	var industry_sel = document.getElementById("industry_selection_canvas");
	industry_sel.innerHTML = "";
	for ( var i in naicsCode) {
		append_selection_element(industry_sel, i, naicsCode[i]);
	}
}

function onchange_species_selection() {
	var regTable = document.getElementById("regDiv");
	regTable.innerHTML = "";
	var species = $("#species").val();
	// alert(species);
	if (species == "" || species == "Human") {
		$("#spinner").css("display", "block");
		for ( var i in reg['human']) {
			// alert(reg['human'][i]);
			append_radio_element(regTable, "regulation", esciencePrefix
					+ regOwl['human'][i], "unchecked", reg['human'][i]);
		}
		console.log(highlight);
		$(highlight).each(function() {
			map.removeOverlay(this);
		});
		$("#spinner").css("display", "none");
	}
	if (species == "" || species == "Aquatic-life") {
		$("#spinner").css("display", "block");
		for ( var i in reg['aquatic']) {
			// alert(reg['aquatic'][i]);
			append_radio_element(regTable, "regulation", sparqlPrefix
					+ regOwl['aquatic'][i], "unchecked", reg['aquatic'][i]);
		}
		$(highlight).each(function() {
			map.removeOverlay(this);
		});
		$("#spinner").css("display", "none");
	}

	if (species == "CanadaGoose") {
		$("#spinner").css("display", "block");
		for ( var i in reg['CanadaGoose']) {
			append_radio_element(regTable, "regulation", sparqlPrefix
					+ regOwl['aquatic'][i], "unchecked", reg['aquatic'][i]);
		}
		var zip = $('#zip').val();
		alert(zip);
		if (zip != '98103')
			$("#spinner").css("display", "none");
		else {
			highlight = [];
			var bounds = map.getBounds();
			var southWest = bounds.getSouthWest();
			var northEast = bounds.getNorthEast();
			var lngSpan = northEast.lng() - southWest.lng();
			var latSpan = northEast.lat() - southWest.lat();

			$
					.getJSON(
							"canada_goose_wa_huc8.json",
							function(ret) {
								var huc = ret.HUC_8;
								$
										.getJSON(
												"water-bodies.json",
												function(json) {
													$(json.features)
															.each(
																	function() {
																		var feature = this;
																		$(huc)
																				.each(
																						function() {
																							if (feature.properties.ReachCode
																									.indexOf(this) === 0) {
																								var coords = feature.geometry.coordinates;
																								lng = coords[0][0][0];
																								lat = coords[0][0][1];
																								// highlight
																								// the
																								// water
																								// body
																								// only
																								// if
																								// the
																								// first
																								// point
																								// of
																								// the
																								// water
																								// body
																								// falls
																								// in
																								// the
																								// viewport
																								// of
																								// the
																								// map,
																								if (lng < northEast
																										.lng()
																										&& lat < northEast
																												.lat()
																										&& lng > southWest
																												.lng()
																										&& lat > southWest
																												.lat())
																									highlightPolygon(
																											coords,
																											feature.properties,
																											highlight);
																							}
																						});
																	});
													$("#spinner").css(
															"display", "none");
												});
							});
		}
	}

	var spcIndex = 'human';
	if (species == "Aquatic-life")
		spcIndex = 'aquatic';
	if (species == "CanadaGoose")
		spcIndex = 'CanadaGoose';
	console.log(reg[spcIndex]['EPA']);
	document.getElementById(reg[spcIndex]['EPA'].replace(/ /g, "_"))
			.setAttribute("checked", "checked");
}

/**
 * highlight a polygon extracted from the geometry attribute of a GeoJSON object
 * 
 * @param polygon
 *            the polygon to highlight polygon ::= [outline, hole-1, hole-2,
 *            ..., hole-n] outline, hole-k ::= [coord-1, coord-2, ..., coord-m]
 *            coord-k ::= [longitude, latitude] longitude, latitude ::= floating
 *            number such as -119.08
 * @param properties
 *            the properties of the water body recorded in the GeoJSON object
 * @param record
 *            an array used to store all the polygons currently highlighted, so
 *            that we can un-highlight them later.
 */
function highlightPolygon(polygon, properties, record) {
	var first = true;
	$(polygon).each(
			function() {
				var poly_coords = [];
				$(this).each(function() {
					poly_coords.push(new GLatLng(this[1], this[0]));
				});
				var polygon1 = null;
				if (first) {
					polygon1 = new GPolygon(poly_coords, "#fff", 0, 0, "#00f",
							0.5);
					GEvent.addListener(polygon1, "mouseover", function() {
						$(this).css('cursor', 'pointer');
					});
					GEvent.addListener(polygon1, "mouseout", function() {
						$(this).css('cursor', 'auto');
					});
					GEvent.addListener(polygon1, "click", function() {
						map.openInfoWindowHtml(
								polygon1.getBounds().getCenter(),
								makeTable(properties));
					});
					first = false;
				} else {
					polygon1 = new GPolygon(poly_coords, "#fff", 0, 0, "#fff",
							0.5);
				}
				record.push(polygon1);
				map.addOverlay(polygon1);
			});
}

/**
 * make an html table from a properties field from a GeoJSON object
 * 
 * @param properties
 *            the properties where the data in the table come from
 * @return a table containing all the items in the properties
 */
function makeTable(properties) {
	var ret = "<table>";
	for ( var p in properties) {
		ret += "<tr><td>" + p + "</td><td>" + properties[p] + "</td></tr>";
	}
	ret += "<tr><td>Provenance:</td><td></td></tr>";
	ret += "<tr><td>water body shapes</td><td>ftp://www.ecy.wa.gov/gis_a/hydro/nhd/NHDmajor.zip</td></tr>";
	ret += "<tr><td>bird distribution</td><td>http://www.avianknowledge.net/</td></tr>";
	ret += "</table>";
	return ret;
}

function showReportSite(state) {
	var reportSiteUrl = "http://was.tw.rpi.edu/swqp/reportSite.php";
	$.ajax({
		type : "GET",
		url : reportSiteUrl,
		dataType : "xml",
		success : function(data) {
			$(data).find("Organization").each(
					function() {
						if ($(this).find("hasState").text() == state) {
							var site = $(this).find("hasReportSite").text();
							$("#reportSite").html(
									"Report Environmental Problems: <a href=\""
											+ site + "\">" + site + "</a>");
							return;
						}
					});
		}
	});
}

/**
 * show markers on the map given a zip code
 * 
 * @param address
 *            zip code
 */
function showAddress(address) {
	if (address.length != 5) {
		alert("The input zip code is not valid! Please check and input again.");
		return;
	}
	window.pagedData = [];
	window.curPage = 0;
	var waterquery = "";
	var facilityquery = "";
	if (geocoder) {
		geocoder.getLatLng(address, function(point) {
			if (!point) {
				alert(address + " not found");
			} else {
				map.setCenter(point, 10);
			}
		});

		$("#spinner").css("display", "block");
		$
				.ajax({
					type : "GET",
					url : thiszipagent, // SPARQL service URI
					data : "code=" + address, // query parameter
					dataType : "json",
					success : function(data) {
						state = data.result.stateAbbr;
						showReportSite(state);
						thisStateCode = data.result.stateCode;
						if (thisStateCode == undefined)
							thisStateCode = stateAbbr2Code[state];
						stateCode = thisStateCode.split(":")[1];
						countyCode = data.result.countyCode;
						countyCode = countyCode.replace("US:", "");// strip the
						// "US:"
						countyFips = countyCode.replace(":", "");// strip the
						// ":"
						// alert(countyFips);
						countyCode = countyCode.split(":")[1];
						countyCode = countyCode.replace(/^0+/, "");
						lat = data.result.lat;
						lng = data.result.lng;

						var contaminants = $("#characteristicName").val();
						var effects = $("#health").val();
						var time = $("#time").val();
						var sources = JSON.stringify($.map(
								$('[name="source"]:checked'), function(x) {
									return x.value;
								}));
						var regulation = $('[name="regulation"]:checked').val();
						industry = $("#industry_selection_canvas").val();
						// alert(industry);
						// getLimitData(sources, regulation, contaminants,
						// effects, time, industry);
						var bounds = map.getBounds();
						var southWest = bounds.getSouthWest();
						var northEast = bounds.getNorthEast();
						var lngLow = southWest.lng();
						var lngHigh = northEast.lng();
						var latLow = southWest.lat();
						var latHigh = northEast.lat();
						getAllData(sources, regulation, contaminants, effects,
								time, industry, lngLow, lngHigh, latLow,
								latHigh);
					},
					error : function(data) {
						window
								.alert("Unable to determine enough information about your location.");
						$("#spinner").css("display", "none");
					}
				});
	}
}

function deCodeZip() {
	var address = document.getElementById("zip").value;
	if (address.length != 5) {
		alert("The input zip code is not valid! Please check and input again.");
		return;
	}
	window.curPage = 0;
	var waterquery = "";
	var facilityquery = "";
	if (geocoder) {
		geocoder.getLatLng(address, function(point) {
			if (!point) {
				alert(address + " not found");
			} else {
				map.setCenter(point, 10);
			}
		});

		$("#spinner").css("display", "block");
		$
				.ajax({
					type : "GET",
					url : thiszipagent, // SPARQL service URI
					data : "code=" + address, // query parameter
					dataType : "json",
					success : function(data) {
						state = data.result.stateAbbr;
						showReportSite(state);
						thisStateCode = data.result.stateCode;
						if (thisStateCode == undefined)
							thisStateCode = stateAbbr2Code[state];
						stateCode = thisStateCode.split(":")[1];
						countyCode = data.result.countyCode;
						countyCode = countyCode.replace("US:", "");// strip the
						// "US:"
						countyFips = countyCode.replace(":", "");// strip the
						// ":"
						// alert(countyFips);
						countyCode = countyCode.split(":")[1];
						countyCode = countyCode.replace(/^0+/, "");
						lat = data.result.lat;
						lng = data.result.lng;

						showHUC();
					},
					error : function(data) {
						window
								.alert("Unable to determine enough information about your location.");
						$("#spinner").css("display", "none");
					}
				});
	}
}

function showHUC() {
	// alert(countyFips);
	$
			.ajax({
				type : "GET",
				url : thisserviceagent,
				// data: "fips="+countyFips+"&method=getHUC8Codes",
				data : {
					"fips" : "\"" + countyFips + "\"",
					"method" : "getHUC8Codes"
				},
				dataType : "json",
				success : function(data) {
					if (data.error) {
						window.alert("An error occurred: " + data.errorString);
						return;
					}
					var hucArr = data.HUC_8;
					if (hucArr.length == 0) {
						window
								.alert("No data are available for this county at this time.");
					}
					// for(var i=0;i<hucArr.length;i++) {
					var hucStr = hucArr.join();
					window.alert(hucStr);
				},
				error : function(err) {
					window.alert("Unable to retrieve data from the server.");
					$("#spinner").css("display", "none");
				}
			});
}

/**
 * get data within a viewport
 * 
 * @param sources
 * @param regulation
 * @param contaminants
 * @param effects
 * @param time
 * @param industry
 * @param lngLow
 *            left bound of the viewport
 * @param lngHigh
 *            right bound of the viewport
 * @param latLow
 *            bottom bound of the viewport
 * @param latHigh
 *            top bound of the viewport
 */
function getAllData(sources, regulation, contaminants, effects, time, industry,
		lngLow, lngHigh, latLow, latHigh) {
	if (sources == null) {
		sources = JSON.stringify($.map($('[name="source"]:checked'),
				function(x) {
					return x.value;
				}));
		regulation = $('[name="regulation"]:checked').val();
		contaminants = $("#characteristicName").val();
		effects = $("#health").val();
		time = $("#time").val();
		industry = $("#industry_selection_canvas").val();
	}
	map.clearOverlays();
	// if (window.pagedData[curPage]) {
	// for ( var i = 0; i < window.pagedData[curPage].length; i++) {
	// var marker = window.pagedData[curPage][i];
	// map.addOverlay(marker);
	// if ((marker.siteData.isPolluted && !isChecked("pollutedWater"))
	// || (!marker.siteData.isPolluted && !isChecked("cleanWater")))
	// marker.hide();
	// else
	// marker.show();
	// }
	// return;
	// }
	$("#spinner").css("display", "block");
	$
			.ajax({
				type : "GET",
				url : thisserviceagent,
				data : {
					"sources" : sources,
					"regulation" : regulation,
					"contaminants" : contaminants,
					"effects" : effects,
					"time" : time,
					"industry" : industry,
					"countyCode" : countyCode,
					"state" : state,
					"lat" : lat,
					"lng" : lng,
					"lngLow" : lngLow,
					"lngHigh" : lngHigh,
					"latLow" : latLow,
					"latHigh" : latHigh,
					"method" : "getAllData",
					"limit" : JSON.stringify(window.limits)
				},
				dataType : "json",
				success : function(data) {
					// if(window.pagedData[curPage] == undefined)
					// window.pagedData[curPage] = [];
					var bindings = data.results.bindings;
					var found = {};
					if (bindings.length == 0) {
						window
								.alert("No data are available for this county at this time.");
					}
					for ( var i = 0; i < bindings.length; i++) {
						var result = bindings[i];
						var uri = result["s"].value;
						if (found[uri] == true)
							continue;
						found[uri] = true;
						var lat = result["lat"].value;
						var lng = result["long"].value;
						if (lng > 0)
							lng = -lng;
						var label = result["label"] ? result["label"].value
								: "";
						var facility = eval(result["facility"].value);
						var polluted = eval(result["polluted"].value);
						var site = {
							'uri' : uri,
							'label' : label,
							'isFacility' : facility,
							'isPolluted' : polluted
						};
						var iconfile;
						if (facility && polluted)
							iconfile = "image/facilitypollute.png";
						else if (facility && !polluted)
							iconfile = "image/facility.png";
						else if (!facility && polluted)
							iconfile = "image/pollutedwater.png";
						else if (!facility && !polluted)
							iconfile = "image/cleanwater2.png";
						var icon = new GIcon(G_DEFAULT_ICON, iconfile);
						icon.iconSize = new GSize(polluted ? 29 : 30, 34);
						var latlng = new GLatLng(lat, lng);
						markerOptions = {
							"icon" : icon,
							"title" : label
						};
						var marker = new GMarker(latlng, markerOptions);
						marker.siteData = site;
						GEvent.addListener(marker, "click",
								getDataCallback(marker));
						map.addOverlay(marker);
						if ((!facility && polluted && !isChecked("pollutedWater"))
								|| (!facility && !polluted && !isChecked("cleanWater"))
								|| (facility && polluted && !isChecked("pollutedFacility"))
								|| (facility && !polluted && !isChecked("facility")))
							marker.hide();
						// window.pagedData[curPage].push(marker);
						if (facility && polluted)
							wqpMarkers["pollutedFacility"].push(marker);
						else if (facility && !polluted)
							wqpMarkers["facility"].push(marker);
						else if (!facility && polluted)
							wqpMarkers["pollutedWater"].push(marker);
						else if (!facility && !polluted)
							wqpMarkers["cleanWater"].push(marker);
					}
					$("#spinner").css("display", "none");
				},
				error : function(err) {
					window.alert("Unable to retrieve data from the server.");
					$("#spinner").css("display", "none");
				}
			});
}

/**
 * show markers in a paged manner
 * 
 * @param sources
 * @param regulation
 * @param contaminants
 * @param effects
 * @param time
 * @param industry
 */
function getLimitData(sources, regulation, contaminants, effects, time,
		industry) {
	$
			.ajax({
				type : "GET",
				url : thisserviceagent,
				data : {
					"sources" : sources,
					"regulation" : regulation,
					"contaminants" : contaminants,
					"effects" : effects,
					"time" : time,
					"industry" : industry,
					"countyCode" : countyCode,
					"state" : state,
					"method" : "getLimitData"
				},
				dataType : "json",
				success : function(data) {
					if (data.error) {
						window.alert("An error occurred: " + data.errorString);
						return;
					}
					if (data.facilityCount + data.siteCount == 0) {
						window
								.alert("Our datasets do not contain your county at this time.");
						return;
					}
					window.facilityCount = (data.facilityCount ? data.facilityCount
							: 0);
					window.siteCount = (data.siteCount ? data.siteCount : 0);
					window.limits = {
						"facility" : {},
						"site" : {}
					};
					limits.facility["offset"] = 0;
					limits.site["offset"] = 0;
					if (facilityCount > siteCount) {
						limits.site["limit"] = Math.min(limit, siteCount);
						limits.facility["limit"] = Math.min(facilityCount, 2
								* limit - limits.site["limit"]);
					} else {
						limits.facility["limit"] = Math.min(limit,
								facilityCount);
						limits.site["limit"] = Math.min(siteCount, 2 * limit
								- limits.facility["limit"]);
					}
					generatePaging();
					getData(sources, regulation, contaminants, effects, time,
							industry);
				},
				error : function(err) {
					window.alert("Unable to retrieve data from the server.");
					$("#spinner").css("display", "none");
				}
			});
}

function changePage(p) {
	p = p - 1;
	var start = 2 * limit * p;
	var fac_start = limit * p;
	var site_start = limit * p;

	// update ui
	$("div#page a.selected").toggleClass("selected");
	$($("div#page a")[p]).toggleClass("selected");

	if (fac_start > facilityCount) {
		site_start = start - facilityCount;
		fac_start = facilityCount;
	} else if (site_start > siteCount) {
		fac_start = start - siteCount;
		site_start = siteCount;
	}

	limits.facility.offset = fac_start;
	limits.site.offset = site_start;

	if (fac_start + limit > facilityCount && site_start + limit > siteCount) {
		limits.facility.limit = Math.min(facilityCount - fac_start, limit);
		limits.site.limit = Math.min(siteCount - site_start, limit);
	} else if (fac_start + limit <= facilityCount
			&& site_start + limit <= siteCount) {
		limits.facility.limit = limit;
		limits.site.limit = limit;
	} else if (fac_start + limit > facilityCount) {
		limits.facility.limit = facilityCount - fac_start;
		limits.site.limit = 2 * limit - limits.facility.limit;
	} else if (site_start + limit > siteCount) {
		limits.site.limit = siteCount - site_start;
		limits.facility.limit = 2 * limit - limits.site.limit;
	}

	if (fac_start > facilityCount) {
		limits.facility.limit = 0;
	}
	if (site_start > siteCount) {
		limits.site.limit = 0;
	}

	curPage = p;
	getData();
}

function generatePagingCallback(i) {
	return function() {
		changePage(i);
		return false;
	};
}

function generatePaging() {
	var div = $("#page");
	div.empty();
	div.append("Page: ");
	var offset = limits.facility.offset + limits.site.offset;
	var limit = facilityCount + siteCount;
	var page = Math.floor(offset / (2 * window.limit)) + 1;
	var pages = Math.floor(limit / (2 * window.limit)) + 1;
	for ( var i = 1; i < page; i++) {
		var el = document.createElement("a");
		div.append(el);
		$(el).click(generatePagingCallback(i));
		$(el).attr("href", "#");
		$(el).text(i.toString());
		div.append(" ");
	}
	var el = document.createElement("a");
	div.append(el);
	$(el).click(generatePagingCallback(page));
	$(el).attr("href", "#");
	$(el).toggleClass("selected");
	$(el).text(page.toString());
	div.append(" ");
	for ( var i = page + 1; i <= pages; i++) {
		var el = document.createElement("a");
		div.append(el);
		$(el).click(generatePagingCallback(i));
		$(el).attr("href", "#");
		$(el).text(i.toString());
		div.append(" ");
	}
}

function getDataCallback(marker) {
	return function() {
		queryForWaterPollution(marker);
	};
}

function getData(sources, regulation, contaminants, effects, time, industry) {
	if (sources == null) {
		sources = JSON.stringify($.map($('[name="source"]:checked'),
				function(x) {
					return x.value;
				}));
		regulation = $('[name="regulation"]:checked').val();
		contaminants = $("#characteristicName").val();
		effects = $("#health").val();
		time = $("#time").val();
		industry = $("#industry_selection_canvas").val();
	}
	map.clearOverlays();
	if (window.pagedData[curPage]) {
		for ( var i = 0; i < window.pagedData[curPage].length; i++) {
			var marker = window.pagedData[curPage][i];
			map.addOverlay(marker);
			if ((marker.siteData.isPolluted && !isChecked("pollutedWater"))
					|| (!marker.siteData.isPolluted && !isChecked("cleanWater")))
				marker.hide();
			else
				marker.show();
		}
		return;
	}
	$("#spinner").css("display", "block");
	$
			.ajax({
				type : "GET",
				url : thisserviceagent,
				data : {
					"sources" : sources,
					"regulation" : regulation,
					"contaminants" : contaminants,
					"effects" : effects,
					"time" : time,
					"industry" : industry,
					"countyCode" : countyCode,
					"state" : state,
					"lat" : lat,
					"lng" : lng,
					"method" : "getData",
					"limit" : JSON.stringify(window.limits)
				},
				dataType : "json",
				success : function(data) {
					if (window.pagedData[curPage] == undefined)
						window.pagedData[curPage] = [];
					var bindings = data.results.bindings;
					var found = {};
					if (bindings.length == 0) {
						window
								.alert("No data are available for this county at this time.");
					}
					for ( var i = 0; i < bindings.length; i++) {
						var result = bindings[i];
						var uri = result["s"].value;
						if (found[uri] == true)
							continue;
						found[uri] = true;
						var lat = result["lat"].value;
						var lng = result["long"].value;
						if (lng > 0)
							lng = -lng;
						var label = result["label"] ? result["label"].value
								: "";
						var facility = eval(result["facility"].value);
						var polluted = eval(result["polluted"].value);
						var site = {
							'uri' : uri,
							'label' : label,
							'isFacility' : facility,
							'isPolluted' : polluted
						};
						var iconfile;
						if (facility && polluted)
							iconfile = "image/facilitypollute.png";
						else if (facility && !polluted)
							iconfile = "image/facility.png";
						else if (!facility && polluted)
							iconfile = "image/pollutedwater.png";
						else if (!facility && !polluted)
							iconfile = "image/cleanwater2.png";
						var icon = new GIcon(G_DEFAULT_ICON, iconfile);
						icon.iconSize = new GSize(polluted ? 29 : 30, 34);
						var latlng = new GLatLng(lat, lng);
						markerOptions = {
							"icon" : icon,
							"title" : label
						};
						var marker = new GMarker(latlng, markerOptions);
						marker.siteData = site;
						GEvent.addListener(marker, "click",
								getDataCallback(marker));
						map.addOverlay(marker);
						if ((!facility && polluted && !isChecked("pollutedWater"))
								|| (!facility && !polluted && !isChecked("cleanWater"))
								|| (facility && polluted && !isChecked("pollutedFacility"))
								|| (facility && !polluted && !isChecked("facility")))
							marker.hide();
						window.pagedData[curPage].push(marker);
						if (facility && polluted)
							wqpMarkers["pollutedFacility"].push(marker);
						else if (facility && !polluted)
							wqpMarkers["facility"].push(marker);
						else if (!facility && polluted)
							wqpMarkers["pollutedWater"].push(marker);
						else if (!facility && !polluted)
							wqpMarkers["cleanWater"].push(marker);
					}
					$("#spinner").css("display", "none");
				},
				error : function(err) {
					window.alert("Unable to retrieve data from the server.");
					$("#spinner").css("display", "none");
				}
			});
}

function showFlood() {
	var success = function(data) {
		pollutedwatersource = new Array();
		$(data).find('result').each(function() {
			var lat = "", lng = "", sub = "", label = "";
			$(this).find("binding").each(function() {

				if ($(this).attr("name") == "lat") {
					lat = ($(this).find("literal").text());
				}
				if ($(this).attr("name") == "long") {
					lng = ($(this).find("literal").text());
				}
				if ($(this).attr("name") == "label") {
					label = ($(this).find("literal").text());
				}
				if ($(this).attr("name") == "s") {
					sub = ($(this).find("uri").text());
					pollutedwatersource.push(sub);
				}
			});
			if (lat != "" && lng != "") {
				// document.getElementById("test").innerHTML="ready to display";
				var site = {
					'uri' : sub,
					'label' : label,
					'isPolluted' : true
				};
				var blueIcon = new GIcon(G_DEFAULT_ICON, "image/flood.png");
				blueIcon.iconSize = new GSize(29, 34);
				var latlng = new GLatLng(lat, lng);
				markerOptions = {
					icon : blueIcon
				};
				var marker = new GMarker(latlng, markerOptions);
				GEvent.addListener(marker, "click", function() {
					var info = queryForFlood(site, false, marker);
					marker.openInfoWindow(info);
				});
				map.addOverlay(marker);
				wqpMarkers["flood"].push(marker);
			}
		});
	};
	var query = "prefix	rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> prefix this: <http://tw2.tw.rpi.edu/zhengj3/owl/epa.owl#> prefix geo: <http://www.w3.org/2003/01/geo/wgs84_pos#> select * where{?s rdf:type this:Flood. ?s geo:lat ?lat. ?s geo:long ?long. }"
	var source = null;
	if (data_source["USGS"] == 1)
		source = "USGS";
	var parameter = "data=water&state=" + state + "&countyCode=" + countyCode
			+ "&query=" + encodeURIComponent(query) + "&start=" + start
			+ "&limit=" + limit + "&source=" + source;
	if (regulation != "") {
		parameter += "&regulation=" + regulation;
	}

	$.ajax({
		type : "GET",
		url : thisserviceagent, // SPARQL service URI
		data : parameter,// "state="+state+"&countyCode="+countyCode+"&query="+encodeURIComponent(query),
		// // query parameter
		dataType : "xml",
		success : success
	});

}

function showPollutedWater(query) {
	var success = function(data) {
		pollutedwatersource = new Array();
		$(data).find('result').each(
				function() {
					var lat = "", lng = "", sub = "", label = "";
					$(this).find("binding").each(function() {

						if ($(this).attr("name") == "lat") {
							lat = ($(this).find("literal").text());
						}
						if ($(this).attr("name") == "long") {
							lng = ($(this).find("literal").text());
						}
						if ($(this).attr("name") == "label") {
							label = ($(this).find("literal").text());
						}
						if ($(this).attr("name") == "s") {
							sub = ($(this).find("uri").text());
							pollutedwatersource.push(sub);
						}
					});
					if (lat != "" && lng != "") {
						// document.getElementById("test").innerHTML="ready to
						// display";
						var site = {
							'uri' : sub,
							'label' : label,
							'isPolluted' : true
						};
						var blueIcon = new GIcon(G_DEFAULT_ICON,
								"image/pollutedwater.png");
						blueIcon.iconSize = new GSize(29, 34);
						var latlng = new GLatLng(lat, lng);
						markerOptions = {
							icon : blueIcon
						};
						var marker = new GMarker(latlng, markerOptions);
						GEvent.addListener(marker, "click", function() {
							var info = queryForWaterPollution(site, false,
									marker);
							marker.openInfoWindow(info);
						});
						map.addOverlay(marker);
						wqpMarkers["pollutedWater"].push(marker);
					}
				});
		showCleanWater();
	};
	var source = null;
	if (data_source["USGS"] == 1)
		source = "USGS";
	var parameter = "data=water&state=" + state + "&countyCode=" + countyCode
			+ "&query=" + encodeURIComponent(query) + "&start=" + start
			+ "&limit=" + limit + "&source=" + source;
	if (regulation != "") {
		parameter += "&regulation=" + regulation;
	}

	$.ajax({
		type : "GET",
		url : thisserviceagent, // SPARQL service URI
		data : parameter,// "state="+state+"&countyCode="+countyCode+"&query="+encodeURIComponent(query),
		// // query parameter
		dataType : "xml",
		success : success
	});

}

function showCleanWater() {
	var success = function(data) {

		$(data)
				.find('result')
				.each(
						function() {
							var lat = "", lng = "", sub = "", label = "";
							var show = true;
							$(this)
									.find("binding")
									.each(
											function() {

												if ($(this).attr("name") == "s") {
													// document.getElementById("test").innerHTML+=pollutedwatersource.length;
													for ( var i = 0; i < pollutedwatersource.length; i++) {
														// document.getElementById("test").innerHTML+=pollutedwatersource[i]+"
														// ";
														if ($(this).find("uri")
																.text() == pollutedwatersource[i]) {
															show = false;
															break;
														}
													}
													sub = $(this).find("uri")
															.text();
												}
												if ($(this).attr("name") == "lat") {
													lat = ($(this).find(
															"literal").text());
													// document.getElementById("test").innerHTML+=lat;
												}
												if ($(this).attr("name") == "long") {
													lng = ($(this).find(
															"literal").text());
													// document.getElementById("test").innerHTML+=lng;
												}
												if ($(this).attr("name") == "label") {
													label = ($(this).find(
															"literal").text());
													// document.getElementById("test").innerHTML+=label;
												}
											});
							if (lat != "" && lng != "" && show) {

								var thisIcon = new GIcon(G_DEFAULT_ICON,
										"image/cleanwater2.png");
								thisIcon.iconSize = new GSize(30, 34);
								var latlng = new GLatLng(lat, lng);
								markerOptions = {
									icon : thisIcon
								};

								var site = {
									'uri' : sub,
									'label' : label,
									'isPolluted' : false
								};
								var marker = new GMarker(latlng, markerOptions);
								GEvent.addListener(marker, "click", function() {
									var info = queryForWaterPollution(site,
											false, marker);
									marker.openInfoWindowHtml(info);
								});
								map.addOverlay(marker);
								wqpMarkers["cleanWater"].push(marker);
							}
							;
						});
		/*
		 * var facilityquery="prefix rdf:
		 * <http://www.w3.org/1999/02/22-rdf-syntax-ns#> prefix rdfs:
		 * <http://www.w3.org/2000/01/rdf-schema#> prefix epa:
		 * <http://tw2.tw.rpi.edu/zhengj3/owl/epa.owl#> prefix geo:
		 * <http://www.w3.org/2003/01/geo/wgs84_pos#> select * where{?s rdf:type
		 * epa:ViolatingFacility. ?s geo:lat ?lat. ?s geo:long ?long.}";
		 */
		var facilityquery = "";
		if (noFilterForCharacteristicFlag)
			facilityquery = "prefix	rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> prefix epa: <http://tw2.tw.rpi.edu/zhengj3/owl/epa.owl#> prefix geo: <http://www.w3.org/2003/01/geo/wgs84_pos#> select * where{?s rdf:type epa:ViolatingFacility. ?s rdfs:label ?label. ?s geo:lat ?lat. ?s geo:long ?long.}";
		else
			facilityquery = buildPollutingFacilityQuery();

		showViolatedFacility(facilityquery);
	};
	var query = "prefix	rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> prefix this: <http://tw2.tw.rpi.edu/zhengj3/owl/epa.owl#> prefix geo: <http://www.w3.org/2003/01/geo/wgs84_pos#> select * where{?s rdf:type <http://sweet.jpl.nasa.gov/2.1/realmHydroBody.owl#BodyOfWater>. ?s geo:lat ?lat. ?s geo:long ?long. }"
	var source = null;
	if (data_source["USGS"] == 1)
		source = "USGS";
	var parameter = "data=water&state=" + state + "&countyCode=" + countyCode
			+ "&query=" + encodeURIComponent(query) + "&start=" + start
			+ "&limit=" + limit + "&source=" + source;
	if (regulation != "") {
		parameter += "&regulation=" + regulation;
	}
	$.ajax({
		type : "GET",
		url : thisserviceagent, // SPARQL service URI
		data : parameter,// "state="+state+"&countyCode="+countyCode+"&query="
							// +
		// encodeURIComponent(), // query parameter
		dataType : "xml",
		success : success
	});
}

function showViolatedFacility(query) {
	var success = function(data) {
		violatedfacility = new Array();
		$(data).find('result').each(
				function() {
					var lat = "", lng = "", sub = "", label = "";
					$(this).find("binding").each(function() {
						if ($(this).attr("name") == "lat") {
							lat = ($(this).find("literal").text());
						}
						if ($(this).attr("name") == "long") {
							lng = ($(this).find("literal").text());
							if (lng.charAt(0) != "-") {
								lng = "-" + lng;
							}
						}
						if ($(this).attr("name") == "label") {
							label = ($(this).find("literal").text());
						}
						if ($(this).attr("name") == "s") {
							sub = ($(this).find("uri").text());
							violatedfacility.push(sub);
						}
					});
					if (lat != "" && lng != "") {
						var site = {
							'uri' : sub,
							'label' : label,
							'isPolluted' : true
						};
						var blueIcon = new GIcon(G_DEFAULT_ICON,
								"image/facilitypollute.png");
						blueIcon.iconSize = new GSize(29, 34);
						var latlng = new GLatLng(lat, lng);
						markerOptions = {
							icon : blueIcon
						};
						var marker = new GMarker(latlng, markerOptions);
						GEvent.addListener(marker, "click",
								function() {
									var info = queryForFacilityInfo(site,
											false, marker);
									marker.openInfoWindow(info);
								});
						map.addOverlay(marker);
						wqpMarkers["pollutedFacility"].push(marker);
					}
				});
		showFacility();
	};
	var source = null;
	if (data_source["EPA"] == 1)
		source = "EPA";
	var parameter = "data=facility&state=" + state + "&countyCode="
			+ countyCode + "&query=" + encodeURIComponent(query) + "&start="
			+ start + "&limit=" + limit + "&type=ViolatingFacility&source="
			+ source;
	;

	$.ajax({
		type : "GET",
		url : thisserviceagent, // SPARQL service URI
		data : parameter,// "state="+state+"&countyCode="+countyCode+"&query="+encodeURIComponent(query),
		// // query parameter
		dataType : "xml",
		success : success
	});

	/*
	 * $.ajax({type: "GET", url: thisserviceagent, // SPARQL service URI data:
	 * "session="+window.sessionID+ "&query=" + encodeURIComponent("prefix rdf:
	 * <http://www.w3.org/1999/02/22-rdf-syntax-ns#> prefix this:
	 * <http://tw2.tw.rpi.edu/zhengj3/owl/epa.owl#> prefix geo:
	 * <http://www.w3.org/2003/01/geo/wgs84_pos#> prefix rdfs:
	 * <http://www.w3.org/2000/01/rdf-schema#> select * where{?s a
	 * this:ViolatingFacility . ?s rdfs:label ?label . ?s geo:lat ?lat . ?s
	 * geo:long ?log . }"), beforeSend: function(xhr) {
	 * xhr.setRequestHeader("Accept", "application/sparql-results+xml"); },
	 * dataType: "xml", success: success, error: function(xhr, text, err) {
	 * if(xhr.status==200) { success(xhr.responseXML); } } });
	 */
}

function showFacility() {
	var success = function(data) {
		$(data).find('result').each(function() {
			var lat = "", lng = "", sub = "", label = "";
			var show = true;
			$(this).find("binding").each(function() {
				if ($(this).attr("name") == "s") {
					for ( var i = 0; i < violatedfacility.length; i++) {
						if ($(this).find("uri").text() == violatedfacility[i]) {
							show = false;
						}
					}
					sub = $(this).find("uri").text();
				}
				if ($(this).attr("name") == "lat") {
					lat = ($(this).find("literal").text());
				}
				if ($(this).attr("name") == "log") {
					lng = ($(this).find("literal").text());
					if (lng.charAt(0) != "-") {
						lng = "-" + lng;
					}
				}
				if ($(this).attr("name") == "label") {
					label = ($(this).find("literal").text());
				}
			});
			if (lat != "" && lng != "" && show) {

				var thisIcon = new GIcon(G_DEFAULT_ICON, "image/facility.png");
				thisIcon.iconSize = new GSize(30, 34);
				var latlng = new GLatLng(lat, lng);
				markerOptions = {
					icon : thisIcon
				};

				var site = {
					'uri' : sub,
					'label' : label,
					'isPolluted' : false
				};

				var marker = new GMarker(latlng, markerOptions);
				GEvent.addListener(marker, "click", function() {
					var info = queryForFacilityInfo(site, false, marker);
					marker.openInfoWindow(info);
				});
				map.addOverlay(marker);
				window.wqpMarkers["facility"].push(marker);

			}
			;
		});
		// showFlood();
	};
	var query = "prefix	rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> prefix this: <http://tw2.tw.rpi.edu/zhengj3/owl/epa.owl#> prefix geo: <http://www.w3.org/2003/01/geo/wgs84_pos#> prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> select * where{?s rdf:type this:Facility .	?s geo:lat ?lat. ?s geo:long ?log.}";
	var source = null;
	if (data_source["EPA"] == 1)
		source = "EPA";
	var parameter = "data=facility&state=" + state + "&countyCode="
			+ countyCode + "&query=" + encodeURIComponent(query) + "&start="
			+ start + "&limit=" + limit + "&type=facility&source=" + source;
	$.ajax({
		type : "GET",
		url : thisserviceagent, // SPARQL service URI
		data : parameter,
		beforeSend : function(xhr) {
			xhr.setRequestHeader("Accept", "application/sparql-results+xml");
		},
		dataType : "xml",
		success : success,
		error : function(xhr, text, err) {
			if (xhr.status == 200) {
				success(xhr.responseXML);
			}
		}
	});
}
