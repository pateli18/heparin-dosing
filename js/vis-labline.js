LabLine = function(_parentElement, _labData, _labType){
    this.parentElement = _parentElement;
    this.data = _labData;
    this.labType = _labType;

    // for event handler

    this.initVis();
};

LabLine.prototype.initVis = function() {
    var vis = this;
    vis.margin = {top: 5, right: 5, bottom: 5, left: 5};

    vis.width = $("#" + vis.parentElement).width() - vis.margin.left - vis.margin.right;
    vis.height = 30 - vis.margin.top - vis.margin.bottom;


    // SVG drawing area
    vis.svg = d3.select("#" + vis.parentElement).append("svg")
        .attr("width", vis.width + vis.margin.left + vis.margin.right)
        .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
        .append("g")
        .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

    vis.xScale = d3.scaleTime()
        .range([0, vis.width])
        .domain(d3.extent(vis.data, function(d) {
            return d.ts;
        }));

    vis.yScale = d3.scaleLinear()
        .rangeRound([vis.height, 0])
        .domain(d3.extent(vis.data, function(d) {
            return d[vis.labType];
        }));

// draw line
    vis.line = d3.line()
        .x(function(d){
            return vis.xScale(d.ts);
        })
        .y(function(d){return vis.yScale(d[vis.labType]);})
        .curve(d3.curveLinear);

    vis.toolTip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-8, 0]);

    vis.svg.append('path')
        .datum(vis.data)
        .attr('class', 'lab-line')
        .attr('d', vis.line);

    vis.updateChart();

};


LabLine.prototype.updateChart = function() {
    var vis = this;

    vis.toolTip.html(function(d) {
        return '<strong>' + vis.labType.toUpperCase() + '</strong>: ' + d3.format(',')(d[vis.labType]) + ' on ' + d3.timeFormat('%b %d %H:%M')(d.ts);
    });

    vis.svg.call(vis.toolTip);

    //draw line
    var labPoint = vis.svg.selectAll(".lab-point")
        .data(vis.data);

    labPoint.enter().append("circle")
        .attr("class", "lab-point")
        .on('mouseover', vis.toolTip.show)
        .on('mouseout', vis.toolTip.hide)
        .merge(labPoint)
        .transition()
        .duration(1000)
        .attr('cx', function(d) {
            return vis.xScale(d.ts);
        })
        .attr('cy', function(d) {
            return vis.yScale(d[vis.labType])
        })
        .attr('r', 2.5);

    labPoint.exit().remove();

};