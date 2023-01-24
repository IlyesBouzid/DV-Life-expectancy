function FourthQuery_TExpend(){

  // set the dimensions and margins of the graph
  var margin = {top: 30, right: 50, bottom: 60, left: 100},
      width = 600 - margin.left - margin.right,
      height = 400 - margin.top - margin.bottom;


  // append the svg object to the body of the page
  var svg = d3.select("#FourthQ_TExpend_LineChart")
    .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

  //Read the data
  d3.csv("./LineCharts/FourthQuery_LineChart.csv", function(data) {

      // List of groups (here I have one group per column)
      var allGroup = d3.map(data, function(d){return(d.Country)}).keys()

      // add the options to the button
      d3.select("#selectButton_TQ_TExpend_LineChart")
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
        .call(d3.axisBottom(x)
        .tickPadding(10)
        .ticks(16)
        .tickFormat(d3.format('.4')));
        


      // Add Y left axis
      var y = d3.scaleLinear()
        .domain([0, d3.max(data, function(d) { return +d.LE; })])
        .range([ height, 0 ]);

        /*
      var yAxisLeft = d3.svg.axis().scale(y)     //  <==  Add in 'Left' and 'y0'
      .orient("left");
  */
      svg.append("g")
        .attr("class", "y axis")
        /*.style("fill", "steelblue")*/
        .call(d3.axisLeft(y));

        // Add Y right axis
      var yy = d3.scaleLinear()
        .domain([0, d3.max(data, function(d) { return +d.TotalExpenditure; })])
        .range([ height, 0 ]);

        /*
      var yAxisRight = d3.svg.axis().scale(yy)  // This is the new declaration for the 'Right', 'y1'
      .orient("right");           // and includes orientation of the axis to the right.
  */
      svg.append("g")
        .attr("class", "y axis")    
        .attr("transform", "translate(" + width + " ,0)")
        /*.style("fill", "red")   */
        .call(d3.axisRight(yy));


        svg.append("text")
                   /* .attr("class", "x label") */
                    .attr("class","labels")
                    .attr("text-anchor", "end")
                    .attr("x", width)
                    .attr("y", height + 40 )
                    .text("Years");

        // Add Y axis label:
        svg.append("text")
                    .attr("class","labels")
                    .attr("text-anchor", "middle")
                    .attr("transform", "rotate(-90)")
                    .attr("x", -margin.top - (height/2))
                    .attr("y", -40)
                    .text("Life expectancy (years)");

        // Add Y axis label:
        svg.append("text")
                    .attr("class","labels")
                    .attr("text-anchor", "middle")
                    .attr("transform", "translate(" + width + " ,0) rotate(-90)")
                    .attr("x", - margin.top - (height/2) + 10)
                    .attr("y", 40)
                    .text("Total expenditure (%)");
                  
        
        

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
          .style("stroke-width", 4)
          .style("fill", "none")
        
      svg.append("text")
                    .datum(data.filter(function(d){return d.Country==allGroup[0]}))
                    .attr("transform", function(d) {return "translate(" + width/2 + "," + 0 + ")"; })
                    .attr("x",5)
                    .attr("class","legend")
                    .style("fill",function(d){ return myColor("valueA")})
                    .text("Life expectancy");
      svg.append("text")
                    .datum(data.filter(function(d){return d.Country==allGroup[0]}))
                    .attr("transform", function(d) {return "translate(" + width/2 + "," + 20 + ")"; })
                    .attr("x",5)
                    .attr("class","legend")
                    .style("fill",function(d){ return myColor("valueB")})
                    .text("Total expenditure");
          
          // Initialize line with first group of the list
      var line2 = svg
        .append('g')
        .append("path")
          .datum(data.filter(function(d){return d.Country==allGroup[0]}))
          .attr("d", d3.line()
            .x(function(d) { return x(d.Year) })
            .y(function(d) { return yy(+d.TotalExpenditure) })
          )
          .attr("stroke", function(d){ return myColor("valueB") })
          .style("stroke-width", 4)
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

        line2
            .datum(dataFilter)
            .transition()
            .duration(1000)
            .attr("d", d3.line()
              .x(function(d) { return x(d.Year) })
              .y(function(d) { return yy(+d.TotalExpenditure) })
            )
            .attr("stroke", function(d){ return myColor(selectedGroup+1) })

        svg.append("text")
                    .datum(dataFilter)
                    .attr("transform", function(d) {return "translate(" + width/2 + "," + 0 + ")"; })
                    .attr("x",5)
                    .attr("class","legend")
                    .style("fill",function(d){ return myColor(selectedGroup)})
                    .text("Life expectancy");
          svg.append("text")
                    .datum(dataFilter)
                    .attr("transform", function(d) {return "translate(" + width/2 + "," + 20 + ")"; })
                    .attr("x",5)
                    .attr("class","legend")
                    .style("fill",function(d){ return myColor(selectedGroup+1)})
                    .text("Total expenditure");
      }
      

      // When the button is changed, run the updateChart function
      d3.select("#selectButton_TQ_TExpend_LineChart").on("change", function(d) {
          // recover the option that has been chosen
          var selectedOption = d3.select(this).property("value")
          // run the updateChart function with this selected option
          update(selectedOption)
      })

  })
  return;

}