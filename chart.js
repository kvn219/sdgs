
var body = d3.select("body"),
    menu = d3.select("#menu"),
    margin = {
        top: 10,
        right: 10,
        bottom: 30,
        left: 30
    },
    height = 500 - margin.top - margin.bottom,
    width = 700 - margin.left - margin.right,
    formatNumber = d3.format(',.2f'),
    tooltip = d3.select("body")
        .append("div")
        .attr("class", "tooltip")
        .style("opacity", 1.0);

// set color scale for actors
var color = d3.scale.ordinal()
    .domain(["Hot", "Not"])
    .range(["red", "#A5F2F3"]);

var data_url = 'https://www.dropbox.com/s/1u232rizgcbhgfh/final.csv?dl=1';

// load data
d3.csv(data_url, function (data) {
    console.log(data);
    // add dropdown menu for x variables
    var xVars = [{
        "variable": "Friends"
    }, {
        "variable": "Twitter Score"
    }, {
        "variable": "Followers"
    }, {
        "variable": "Impact"
    }, {
        "variable": "Statuses"
    }];
    // add dropdown menu for y variables
    var yVars = [{
        "variable": "Friends"
    }, {
        "variable": "Twitter Score"
    }, {
        "variable": "Followers"
    }, {
        "variable": "Impact"
    }, {
        "variable": "Statuses"
    }];
menu.append('span')
    .text('X-axis: ');
menu.append('select')
    .on('change', xChange)
    .selectAll('option')
    .data(xVars)
    .enter()
    .append('option')
    .attr('value', function (d) {
        return d.variable
    })
    .text(function (d) {
        return d.variable
    });
menu.append('br');
menu.append('span')
    .text('Y-axis: ');
menu.append('select')
    .on('change', yChange)
    .selectAll('option')
    .data(yVars)
    .enter()
    .append('option')
    .attr('id', function (d) {
        return d.variable;
    })
    .attr('value', function (d) {
        return d.variable;
    })
    .text(function (d) {
        return d.variable;
    });

// select inital y variable
d3.select("[id='Followers']")
    .attr("selected", "selected");

// set x axis scale
var xScale = d3.scale.log()
    .domain([d3.min(data, function (d) {
        return 0.93 * d["Friends"];
    }), d3.max(data, function (d) {
        return 1.07 * d["Friends"];
    })])
    .range([0, width]);

// set y axis scale
var yScale = d3.scale.log()
    .domain([d3.min(data, function (d) {
        return 0.98 * d["Followers"];
    }), d3.max(data, function (d) {
        return 1.02 * d["Followers"];
    })])
    .range([height, 0]);

// select SVG
var svg = d3.select("#chart")
    .append('svg')
    .attr('height', 1.01 * height + margin.top + margin.bottom)
    .attr('width', width + margin.left + margin.right)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

// append X axis scale
var xAxis = d3.svg.axis()
    .scale(xScale)
    .ticks(7, d3.format(".0f"))
    .orient('bottom')
    .tickSize(-height - margin.right - margin.left, 0);

// append Y axis scale
var yAxis = d3.svg.axis()
    .scale(yScale)
    .ticks(7,  d3.format(".0f"))
    .orient('left')
    .tickSize(-width - margin.left - margin.right, 0);

// create points
svg.append('g')
    .attr('class', 'axis')
    .attr('id', 'xAxis')
    .attr('transform', 'translate(-1,' + height + ')')
    .call(xAxis)
    .append('text')
    .attr('id', 'xAxisLabel')
    // .attr("x", width)
    .attr("dy", "2.0em")
    .attr("dx", width / 1.9)
    .style('text-anchor', 'end')
    .text('Friends');
svg.append('g')
    .attr('class', 'axis')
    .attr('id', 'yAxis')
    .call(yAxis)
    .append('text')
    .attr('id', 'yAxisLabel')
    .attr('transform', 'rotate(-90)')
    .attr("dy", "-4.0em")
    .attr("dx", -height / 2.5)
    .style('text-anchor', 'end')
    .text('Followers');

//Draw circles
var circles = svg.selectAll('circle')
    .data(data)
    .enter()
    .append('circle')
    .filter(function (d) {
        return d["Friends"] > 0;
    })
    .attr('cx', function (d) {
        return xScale(d["Friends"]);
    })
    .attr('cy', function (d) {
        return yScale(d["Followers"]);
    })
    .attr('r', 3)
    .style("fill", function (d) {
        return color(d.prediction);
    }).style("opacity", 0.30)
    .on("mouseover", function (d) {
        tooltip.transition()
            .duration(250)
            .style("opacity", 1.0)
            .style("border", "red");
        tooltip.html("<img src=" + d["Profile"]  + " width=40% height=90px align=middle" + " >" + "<p><strong> " + d["Screen Name"] + " </strong> </p>" + "<p><strong>Bio:  </strong>" + d["Description"] + "</p>" + "<p><strong>Tags Mentioned:  </strong>" + d["Tags Mentioned"] + "</p>" + "<p><strong>Users mentioned:  </strong>" + d["Users Mentioned"] + "</p>" + "<br>" + "<p><strong>Potentially:  </strong>" + d.prediction + "</p>" + "<p><strong>Friends:  </strong>" + formatNumber(d["Friends"]) + "</p>" + "<p><strong>Statuses: </strong>" + formatNumber(d["Statuses"]) + "</p>" + "<p><strong>Followers:  </strong>" + formatNumber(d['Followers']) + "</p>" + "<p><strong>Twitter Impact Metric:  </strong>" + formatNumber(d["Twitter Score"]) + "</p>" + "<p><strong>Philanthropic Impact Score:  </strong>" + formatNumber(d["Twitter Score"]) + "</p>")
            .style("left", ( d3.event.pageX + 15 ) + "px")
            .style("top", ( d3.event.pageY - 28 ) + "px");
    })
    .on("mouseout", function (d) {
        tooltip.transition()
            .duration(250)
            .style("opacity", 0);
    });

// draw legend
var legend = svg.selectAll(".legend")
    .data(color.domain())
    .enter()
    .append("g")
    .attr("class", "legend")
    .attr("transform", function (d, i) {
        return "translate(0," + i * 15 + ")";
    });

// draw legend colored rectangles
legend.append("rect")
    .attr("x", width + 58)
    .attr("y", -10)
    .attr("width", 10)
    .attr("height", 10)
    .style("fill", color);

// draw legend text
legend.append("text")
    .attr("x", width + 50)
    .attr("y", -2)
    .attr("dy", ".10em")
    .style("text-anchor", "end")
    .text(function (d) {
        return d;
    });

function xChange() {
    var value = this.value;
    xScale.domain([d3.min(data, function (d) {
        return 0.93 * d[value];
    }), d3.max(data, function (d) {
        return 1.07 * d[value];
    })]);
    xAxis.scale(xScale);
    d3.select('#xAxis')
        .transition()
        .duration(750)
        .call(xAxis);
    d3.select('#xAxisLabel')
        .text(value);
    d3.selectAll('circle')
        .transition()
        .duration(750)
        .attr('cx', function (d) {
            return xScale(d[value]);
        });
}

function yChange() {
    var value = this.value;
    yScale.domain([d3.min(data, function (d) {
        return 0.98 * d[value];
    }), d3.max(data, function (d) {
        return 1.02 * d[value];
    })]);
    yAxis.scale(yScale);
    d3.select('#yAxis')
        .transition()
        .duration(750)
        .call(yAxis);
    d3.select('#yAxisLabel')
        .text(value);
    d3.selectAll('circle')
        .transition()
        .duration(750)
        .attr('cy', function (d) {
            return yScale(d[value]);
        });
}
});
d3.select(self.frameElement)
    .style("height", "900px");
