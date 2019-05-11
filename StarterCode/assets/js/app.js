var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 90
};

//Create width and height to fit chart on the canvas
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create the canvas for the SVG element
//Create an SVG wrapper, append an SVG group that will hold our chart,

var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Creat the chartGroup and append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import data
d3.csv("assets/js/data.csv") 
  .then(function(statesData) {

//Parse Data/Cast as numbers
  statesData.forEach(function(data) {
      data.poverty = +data.poverty;
      data.healthcare = +data.healthcare;
  });

//Create scale functions
  var xLinearScale = d3.scaleLinear()
    .domain([0, d3.max(statesData, d => d.poverty)])
    .range([0, width]);

  var yLinearScale = d3.scaleLinear()
    .domain([0, d3.max(statesData, d => d.healthcare)])
    .range([height, 0]);

// Create initial axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

// append x axis
  chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  // append y axis
  chartGroup.append("g")
    .call(leftAxis);

// append initial circles
  var circlesGroup = chartGroup.selectAll("circle")
  .data(statesData)
  .enter()
  .append("circle")
  .attr("cx", d => xLinearScale(d.poverty))
  .attr("cy", d => yLinearScale(d.healthcare))
  .attr("r", 12)
  .attr("fill", "blue")
  .attr("opacity", ".5");

// Append text to circles 
  var circlesGroup = chartGroup.selectAll()
  .data(statesData)
  .enter()
  .append("text")
  .attr("x", d => xLinearScale(d.poverty))
  .attr("y", d => yLinearScale(d.healthcare))
  .style("font-size", "13px")
  .style("text-anchor", "middle")
  .style("fill", "white")
  .text(d => (d.abbr));


//Initialize tool tip 
  var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([80, -60])
    .html(function(d) {
      return (`State: ${d.state}<br>In Poverty %: ${d.poverty}<br>Lacks Healthcare %: ${d.healthcare}`);
      });

//Create tooltip in the chart
  chartGroup.call(toolTip);

//Create event listeners to display and hide the tooltip
  circlesGroup.on("click", function(data) {
    toolTip.show(data, this);
  })
    // onmouseout event
    .on("mouseout", function(data, index) {
        toolTip.hide(data);
    });

// Create axes labels
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 40)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("Lacks Healthcare (%)");

    chartGroup.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
      .attr("class", "axisText")
      .text("In Poverty (%)");
})
