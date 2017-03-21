
//Width and height
var w = 600;
var h = 360;

//Define map projection

var geo;
var stateStatuses = {};

var projection = d3.geo.albersUsa()
  .translate([w/2, h/2])
  .scale([800]);

//Define path generator
var path = d3.geo.path()
  .projection(projection);

//Define quantize scale to sort data values into buckets of color
var color = d3.scale.ordinal()
  .range(["rgb(237,248,233)","rgb(116,196,118)","rgb(0,109,44)"])
  //Colors taken from colorbrewer.js, included in the D3 download
  //Set input domain for color scale
  .domain(["Not Started","Partial", "Up-to-date"]);


//Create SVG element
var mapdiv = d3.select("#map")

var svg = mapdiv.append("svg")
  .attr("width", w)
  .attr("height", h);

var infoBox = mapdiv.append('div')

//Load in agriculture data
//			d3.csv("openelection_volunteers.csv", processCSV)

d3.json("js/sample_metadata_status.json", processJSON);


function processJSON(data) {
  data.objects.forEach(function(row) {
    stateStatuses[row.state] = row
  })
  loadGeo()
}

function loadGeo() {
  //Load in GeoJSON data
  d3.json("js/us-states.json", function(json) {

    json.features.forEach(function(feature) {
      if (stateStatuses[feature.properties.name]) {
        feature.properties = stateStatuses[feature.properties.name]
      } else {
        console.log("No match", feature.properties.name)
      }
    })

    geo = json;
    render()
  })
}

function render() {
  //Bind data and create one path per GeoJSON feature
  svg.selectAll("path")
    .data(geo.features)
    .enter()
    .append("path")
    .attr("d", path)
    .style("fill", function(d) {
      var value = d.properties.status;
      return value ? color(value) : '#ccc'
    })
    .attr("stroke", "white")
    .attr("stroke-width", 1)
    .on('mouseover', function(d) {
      var dd = d.properties
      infoBox.html('<strong>' + dd.state + '</strong><br> Metadata Status: ' + dd.status + '<br> Volunteer(s): ' +  dd.volunteers)
    })

};