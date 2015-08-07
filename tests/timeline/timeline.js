// Initialize dataset
var dataset = [];

// Import JSON
d3.json("timeline_data.json", function(data) {

// Width and height
var width = 5000;
var height = 250;
var padding = 20;

// Data
dataset = data;

// Domain and range
var x = d3.time.scale()
.domain([new Date("Sat May 02 16:00:00 +0000 2015"), new Date("Sat May 02 20:30:00 +0000 2015")])
.range([0, width]);

var y = d3.scale.ordinal()
.domain(["red", "green", "blue", "orange", "purple", "empty"])
.rangeBands([0, height]);

// Create axes
var xAxis = d3.svg.axis()
    .scale(x)
    .orient('bottom')
    .ticks(d3.time.minute, 15)
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
    .attr("width", width)
    .attr("height", height);

// Color function
// Assign colors to groups
var colors = function(dataset){
  if (dataset.hashtags === "empty") {
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
svg.selectAll("circle")
  .data(dataset)
  .enter()
  .append("circle")
  .attr("cx", function(d) { return x(new Date(d.created_at)) + 60; })
  .attr("cy", function(d) {
    return y(d.hashtags);
  })
  .attr("r", 9)
  .style("fill", colors);

  // Update label box
  svg.selectAll("circle")
  .on("mouseover", function(d) {
    d3.select("#name")
    .text(d.user_name);
    d3.select("#tweet")
    .text(d.text);
    d3.select("#group")
    .text(d.hashtags);
    d3.select("#username")
    .text(d.user_screen_name);
  });

  // Create X Axis
  svg.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(0," + (height - padding) + ")")
    .call(xAxis);

  // Create Y Axis
  svg.append("g")
    .call(yAxis);

});