
function FirstQuery(){
  // set the dimensions and margins of the graph
  var margin = {top: 30, right: 30, bottom: 60, left: 100},
      width = 800 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;


  // append the svg object to the body of the page
  var svg = d3.select("#FirstQ_LineChart")
    .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

  //Read the data
  d3.csv("./LineCharts/LineChart.csv", function(data) {

      // List of groups (here I have one group per column)
      var allGroup = d3.map(data, function(d){return(d.Country)}).keys()

      // add the options to the button
      d3.select("#selectButton_FQ_LineChart")
        .selectAll('myOptions')
        .data(allGroup)
        .enter()
        .append('option')
        .text(function (d) { return d; }) // text showed in the menu
        .attr("value", function (d) { return d; }) // corresponding value returned by the button

      // A color scale: one color for each group
      var myColor = d3.scaleOrdinal()
        .domain(allGroup)
        .range(d3.schemeSet2);

      // Add X axis --> it is a date format
      var x = d3.scaleLinear()
        .domain(d3.extent(data, function(d) { return d.Year; }))
        .range([ 0, width ]);
      svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x).tickFormat(d3.format('.4')));

      // Add Y axis
      var y = d3.scaleLinear()
        .domain([0, d3.max(data, function(d) { return +d.LE; })])
        .range([ height, 0 ]);
      svg.append("g")
        .call(d3.axisLeft(y));


    // Add X axis label:
      svg.append("text")
        .attr("text-anchor", "end")
        .attr("x", width)
        .attr("y", height + 40 )
        .text("Years");

    // Add Y axis label:
      svg.append("text")
        .attr("text-anchor", "start")
        .attr("x", 0)
        .attr("y", -20 )
        .text("Life expectancy (years)");
      // Initialize line with first group of the list
      var line = svg
        .append('g')
        .append("path")
          .datum(data.filter(function(d){return d.Country==allGroup[0]}))
          .attr("d", d3.line()
            .x(function(d) { return x(d.Year) })
            .y(function(d) { return y(+d.LE) })
          )
          .attr("stroke", function(d){ return myColor("valueA") })
          .style("stroke-width", 5)
          .style("fill", "none")


      
      // A function that update the chart
      function update(selectedGroup) {

        // Create new data with the selection?
        var dataFilter = data.filter(function(d){return d.Country==selectedGroup})

        // Give these new data to update line
        line
            .datum(dataFilter)
            .transition()
            .duration(1000)
            .attr("d", d3.line()
              .x(function(d) { return x(d.Year) })
              .y(function(d) { return y(+d.LE) })
            )
            .attr("stroke", function(d){ return myColor(selectedGroup) })
      }

      // When the button is changed, run the updateChart function
      d3.select("#selectButton_FQ_LineChart").on("change", function(d) {
          // recover the option that has been chosen
          var selectedOption = d3.select(this).property("value")
          // run the updateChart function with this selected option
          update(selectedOption)
      })

  })
    return;
}