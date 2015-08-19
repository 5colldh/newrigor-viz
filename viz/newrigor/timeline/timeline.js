// Initialize dataset
var dataset = [];

// Import JSON
d3.json("timeline_data.json", function(data) {

// Width and height
var margin = {top: 30, right: 10, bottom: 25, left: 300};
var width = 7000 - margin.left - margin.right;
var height = 600 - margin.top - margin.bottom;

// Data
dataset = data;

// Domain and range
var x = d3.time.scale()
.domain([new Date("Sat May 02 16:17:00 +0000 2015"), new Date("Sat May 02 18:02:00 +0000 2015")])
.range([0, width]);

var y = d3.scale.ordinal()
.domain(["red", "green", "blue", "orange", "purple", "none"])
.rangeBands([0, height]);

// Create axes
var xAxis = d3.svg.axis()
    .scale(x)
    .orient('bottom')
    .ticks(d3.time.minute, 5)
    .tickFormat(d3.time.format('%I:%M'))
    .tickSize(0)
    .tickPadding(8);

var yAxis = d3.svg.axis()
    .scale(y)
    .orient('left')
    .tickPadding(8);

// Create SVG
var svg = d3.select("#canvas")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Color function
// Assign colors to groups
var colors = function(dataset){
  if (dataset.hashtags === "none") {
    return "#949494";
  } else if (dataset.hashtags === "red") {
    return "#ff0000";
  } else if (dataset.hashtags === "blue") {
    return "#00A6FF";
  } else if (dataset.hashtags === "orange") {
    return "#FFA200";
  } else if (dataset.hashtags === "purple") {
    return "#BB00FF";
  } else if (dataset.hashtags === "green") {
    return "#00B539";
  } else {
    return "#000000";
  }
}; 

// Create circles
var circle = svg.selectAll("circle")
  .data(dataset)
  .enter()
  .append("circle")
  .attr("cx", function(d) { return x(new Date(d.created_at)) + 60; })
  .attr("cy", function(d) {
    return y(d.hashtags);
  })
  .attr("r", 11)
  .style("fill", colors);

  // Update label box and highlighting
  svg.selectAll("circle")
  .on("click", function (d) {
    // Create labels
    d3.select("#name")
    .text(d.user_name);
    d3.select("#tweet")
    .text('"'+d.text+'"');
    d3.select("#group")
    .text(d.hashtags);
    d3.select("#username")
    .html('@' + '<a href="http://www.twitter.com/' + d.user_screen_name + '" target="_blank">' + d.user_screen_name + '</a>');

    // Highlight selected circle
    var circleUnderMouse = this;
    d3.selectAll('circle').transition().style('opacity',function () {
        return (this === circleUnderMouse) ? 1.0 : 0.5;
    });
  })
  // Remove label box and highlighting
  .on("dblclick", function(d){
    // Turf label
    d3.select("#name").text("");
    d3.select("#tweet").text("");
    d3.select("#group").text("");
    d3.select("#username").text("");

    // Turf highlighting
    circle.transition().style("opacity", 1.0);
  });

  // Create X Axis
  svg.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(0," + (height) + ")")
    .call(xAxis);

});