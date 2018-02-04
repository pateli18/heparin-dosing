SingleLine = function(_parentElement, _labels, _baseData, _probFlag, _formatter) {
    this.parentElement = _parentElement;
    this.labels = _labels;
    this.baseData = _baseData;
    this.probFlag = _probFlag;
    this.formatter = _formatter;

    this.initVis();
};

SingleLine.prototype.initVis = function() {
    var vis = this;

    vis.margin = {top:0, right:20, bottom:0, left:20};

    vis.width = $('#' + vis.parentElement).width() - vis.margin.left - vis.margin.right;
    vis.height = 34 - vis.margin.top - vis.margin.bottom;

    vis.svg = d3.select("#" + vis.parentElement).append("svg")
        .attr("width", vis.width + vis.margin.left + vis.margin.right)
        .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
        .append("g")
        .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

    vis.xScale = d3.scaleLinear()
        .range([0, vis.width]);

    vis.svg.append('line')
        .attr('x1', 0)
        .attr('x2', vis.width)
        .attr('y1', vis.height / 2)
        .attr('y2', vis.height / 2)
        .attr('stroke', 'black');

    vis.svg.append('text')
        .attr('class', 'line-label')
        .attr('x', 0)
        .attr('y', vis.height / 4)
        .text(vis.labels[0]);

    vis.svg.append('text')
        .attr('class', 'line-label')
        .attr('text-anchor', 'end')
        .attr('x', vis.width)
        .attr('y', vis.height / 4)
        .text(vis.labels[1]);

    vis.toolTip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-8, 0]);

    vis.updateChart([vis.baseData]);
};

SingleLine.prototype.updateChart = function(data) {
    var vis = this;

    vis.displayData = data;

    var baseValue;
    vis.displayData.forEach(function(d) {
        if (d.type == 'Protocol') {
            baseValue = d.value;
        }
    });

    if (vis.probFlag == false) {
        var maxIncrement = d3.max(vis.displayData, function(d) {
            return Math.abs(d.value - baseValue);
        });

        var xScaleIncrement = Math.max(baseValue * .25, maxIncrement);
        vis.xScale.domain([baseValue - xScaleIncrement, baseValue + xScaleIncrement]);
    } else {
        vis.xScale.domain([0, 1]);
    }

    console.log(vis.displayData);

    vis.toolTip.html(function(d) {
        return '<strong style="color: ' + modelColorScale(d.type) + ';">' + d.type + '</strong>: ' + vis.formatter(d.value);
    });

    vis.svg.call(vis.toolTip);

    var circle = vis.svg.selectAll('.dose-circle')
        .data(vis.displayData);

    circle.enter()
        .append('circle')
        .attr('class', 'dose-circle')
        .on('mouseover', vis.toolTip.show)
        .on('mouseout', vis.toolTip.hide)
        .merge(circle)
        .transition()
        .duration(1000)
        .attr('cx', function(d) {
            return vis.xScale(d.value);
        })
        .attr('cy', vis.height / 2)
        .attr('r', 7)
        .attr('fill', function(d) {
            return modelColorScale(d.type);
        });

    circle.exit().remove();

    var label = vis.svg.selectAll('.dose-label')
        .data(vis.displayData);

    label.enter()
        .append('text')
        .attr('class', 'dose-label')
        .attr('text-anchor', 'middle')
        .merge(label)
        .transition()
        .duration(1000)
        .attr('fill', function(d) {
            return modelColorScale(d.type);
        })
        .attr('x', function(d) {
            return vis.xScale(d.value);
        })
        .attr('y', vis.height / 2 + 15)
        .text(function(d) {
            if (d.type === 'Protocol') {
                return d.type;
            } else {
                if (d.value === baseValue) {
                    return '';
                } else {
                    return d.type;
                }
            }
        });

    label.exit().remove();

};
