
function BubbleChart(){
  // set the dimensions and margins of the graph
  var margin = {top: 40, right: 150, bottom: 60, left: 100},
      width = 800 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

  // append the svg object to the body of the page
  var svg = d3.select("#BubbleChart")
    .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

  //Read the data
  d3.csv("./BubbleChart/FirstQuery_BubbleChart.csv", function(data) {
    // ---------------------------//
    //       AXIS  AND SCALE      //
    // ---------------------------//

    // List of groups (here I have one group per column)
  var allGroup = d3.map(data, function(d){return(d.Year)}).keys()

  // add the options to the button
  d3.select("#selectButton")
    .selectAll('myOptions')
    .data(allGroup)
    .enter()
    .append('option')
    .text(function (d) { return d; }) // text showed in the menu
    .attr("value", function (d) { return d; }) // corresponding value returned by the button

    // Add X axis
    var x = d3.scaleSqrt()
      .domain([0, d3.max(data, function(d) { return +d.GDP; })])
      .range([ 0, width ]);
    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x)
      .tickPadding(20)
      .ticks(10,".0s"));

    // Add X axis label:
    svg.append("text")
        .attr("class","labels")
        .attr("text-anchor", "end")
        .attr("x", width)
        .attr("y", height+50 )
        .text("Gdp per Capita");
    // Add Y axis
    var y = d3.scaleLinear()
      .domain([0, d3.max(data, function(d) { return +d.LE; })])
      .range([ height, 0]);
    svg.append("g")
      .call(d3.axisLeft(y));

    // Add Y axis label:
    svg.append("text")
        .attr("class","labels")
        .attr("text-anchor", "start")
        .attr("x", 0)
        .attr("y", -10 )
        .text("Life expectancy (years)")

    // Add a scale for bubble size
    var z = d3.scaleSqrt()
      .domain([d3.min(data, function(d) { return +d.Population; }), d3.max(data, function(d) { return +d.Population; })])
      .range([ 2, 100]); /* it was 2-30 */
    // List of groups (here I have one group per column)
    var allContinents = d3.map(data, function(d){return(d.continent)}).keys()

    // Add a scale for bubble color
    var myColor = d3.scaleOrdinal()
      .domain(allContinents)
      .range(d3.schemeSet1);


    // ---------------------------//
    //      TOOLTIP               //
    // ---------------------------//

    // -1- Create a tooltip div that is hidden by default:
    var tooltip = d3.select("#BubbleChart")
      .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .style("background-color", "black")
        .style("border-radius", "5px")
        .style("padding", "10px")
        .style("color", "white")

    // -2- Create 3 functions to show / update (when mouse move but stay on same circle) / hide the tooltip
    var showTooltip = function(d) {
      tooltip
        .transition()
        .duration(200)
      tooltip
        .style("opacity", 1)
        .html("Country: " + d.Country + " <br/> Population: " + d.Population + " <br/> GDP: " + d.GDP + " <br/> Life expectancy: " + d.LE + " years")
        .style("left", (d3.mouse(this)[0]+30) + "px")
        .style("top", (d3.mouse(this)[1]+30) + "px")
    }
    var moveTooltip = function(d) {
      tooltip
        .style("left", (d3.mouse(this)[0]+30) + "px")
        .style("top", (d3.mouse(this)[1]+30) + "px")
    }
    var hideTooltip = function(d) {
      tooltip
        .transition()
        .duration(200)
        .style("opacity", 0)
    }


    // ---------------------------//
    //       HIGHLIGHT GROUP      //
    // ---------------------------//

    // What to do when one group is hovered
    var highlight = function(d){
      // reduce opacity of all groups
      d3.selectAll(".bubbles").style("opacity", .05)
      // expect the one that is hovered
      d3.selectAll("."+d).style("opacity", 1)
    }

    // And when it is not hovered anymore
    var noHighlight = function(d){
      d3.selectAll(".bubbles").style("opacity", 1)
    }


    // ---------------------------//
    //       CIRCLES              //
    // ---------------------------//

    // Add dots
    var bubble = svg.append('g')
      .selectAll("dot")
      .data(data.filter(function(d){ return d.Year==allGroup[0] }))
      .enter()
      .append("circle")
        .attr("class", function(d) { return "bubbles " + d.continent })
        .attr("cx", function (d) { return x(d.GDP); } )
        .attr("cy", function (d) { return y(d.LE); } )
        .attr("r", function (d) { return z(d.Population); } )
        .style("fill", function (d) { return myColor(d.continent); } )
      // -3- Trigger the functions for hover
      .on("mouseover", showTooltip )
      .on("mousemove", moveTooltip )
      .on("mouseleave", hideTooltip )



      // ---------------------------//
      //       LEGEND              //
      // ---------------------------//

      // Add legend: circles
      var valuesToShow = [10000000, 100000000, 1000000000]
      var xCircle = width + 20
      var xLabel = xCircle + 100
      svg
        .selectAll("legend")
        .data(valuesToShow)
        .enter()
        .append("circle")
          .attr("cx", xCircle)
          .attr("cy", function(d){ return height - 50 - z(d) } )
          .attr("r", function(d){ return z(d) })
          .style("fill", "none")
          .attr("stroke", "black")

      // Add legend: segments
      svg
        .selectAll("legend")
        .data(valuesToShow)
        .enter()
        .append("line")
          .attr('x1', function(d){ return xCircle + z(d) } )
          .attr('x2', xLabel)
          .attr('y1', function(d){ return height - 50 - z(d) } )
          .attr('y2', function(d){ return height - 50 - z(d) } )
          .attr('stroke', 'black')
          .style('stroke-dasharray', ('2,2'))

      // Add legend: labels
      svg
        .selectAll("legend")
        .data(valuesToShow)
        .enter()
        .append("text")
          .attr('x', xLabel)
          .attr('y', function(d){ return height - 50 - z(d) } )
          .text( function(d){ return d/1000000 } )
          .style("font-size", 10)
          .attr('alignment-baseline', 'middle')

      // Legend title
      svg.append("text")
        .attr('x', xCircle)
        .attr("y", height - 50 +30)
        .text("Population (M)")
        .attr("text-anchor", "middle")

      // Add one dot in the legend for each name.
      var size = 20
      var allgroups = allContinents
      svg.selectAll("myrect")
        .data(allgroups)
        .enter()
        .append("circle")
          .attr("cx", xCircle)
          .attr("cy", function(d,i){ return 10 + i*(size+5)}) // 100 is where the first dot appears. 25 is the distance between dots
          .attr("r", 7)
          .style("fill", function(d){ return myColor(d)})
          .on("mouseover", highlight)
          .on("mouseleave", noHighlight)

      // Add labels beside legend dots
      svg.selectAll("mylabels")
        .data(allgroups)
        .enter()
        .append("text")
          .attr("x", xCircle + size*.8)
          .attr("y", function(d,i){ return i * (size + 5) + (size/2)}) // 100 is where the first dot appears. 25 is the distance between dots
          .style("fill", function(d){ return myColor(d)})
          .text(function(d){ return d})
          .attr("text-anchor", "left")
          .style("alignment-baseline", "middle")
          .on("mouseover", highlight)
          .on("mouseleave", noHighlight)



            // A function that update the chart
      function update(selectedGroup) {
        //svg.selectAll("circle").update;
        bubble.remove();
        // Create new data with the selection?
        var dataFilter = data.filter(function(d){return d.Year==selectedGroup})
        // Give these new data to update line
        // Add dots
        bubble = svg
          .selectAll("dot")
          .data(dataFilter)
          .enter()
          .append("circle")
            .attr("class", function(d) { return "bubbles " + d.continent })
            .attr("cx", function (d) { return x(d.GDP); } )
            .attr("cy", function (d) { return y(d.LE); } )
            .attr("r", function (d) { return z(d.Population); } )
            .style("fill", function (d) { return myColor(d.continent); } )
          // -3- Trigger the functions for hover
          .on("mouseover", showTooltip )
          .on("mousemove", moveTooltip )
          .on("mouseleave", hideTooltip )
      }


            // When the button is changed, run the updateChart function
        d3.select("#selectButton").on("change", function(d) {
            // recover the option that has been chosen
            var selectedOption = d3.select(this).property("value")
            // run the updateChart function with this selected option
            update(selectedOption)
        })
      
    })
    return;
  }
