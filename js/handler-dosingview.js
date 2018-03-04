var modelColorScale = d3.scaleOrdinal()
    .range(["#887bb4", "#e69d49"])
    .domain(['Protocol', 'Physician']);

// probability charts
var theraChart = new SingleLine('therapeutic-prob-chart', ['0%', '100%'], {type:'Protocol', value:.20}, true, d3.format('.1%'));
var subChart = new SingleLine('sub-therapeutic-prob-chart', ['0%', '100%'], {type:'Protocol', value:.80}, true, d3.format('.1%'));
var supraChart = new SingleLine('supra-therapeutic-prob-chart', ['0%', '100%'], {type:'Protocol', value:.40}, true, d3.format('.1%'));
var probCharts = [theraChart, subChart, supraChart];

var inputLabel = ['ptt', 'bolus', 'hold', 'rcv'];
var inputCellBaseValues = {};
var inputCellIds = [];

for (var label in inputLabel) {
    for (var i = 1; i <= 5; i++) {
        inputCellIds.push(inputLabel[label] + i);
    }
}

inputCellIds.push('inputBolus');
inputCellIds.push('inputInfusion');

for (var inputCell in inputCellIds) {
    inputCellBaseValues[inputCellIds[inputCell]] = $('#' + inputCellIds[inputCell]).val();
}

var baseBolusDose = {type:'Protocol', value:+inputCellBaseValues['inputBolus']};
var baseInfusionDose = {type:'Protocol', value:+inputCellBaseValues['inputInfusion']};

console.log(baseBolusDose);


var bolusLine = new SingleLine('infusion-bolus-change-chart', ['Less', 'Greater'], baseBolusDose, false, d3.format(','));
var infusionLine = new SingleLine('infusion-rate-change-chart', ['Less', 'Greater'], baseInfusionDose, false, d3.format(','));

function inputCellValueChange(element) {
    var cellId = element.target.id;

    if (cellId == 'inputBolus') {
        var newBolusDose = {type:'Physician', value:$('#inputBolus').val()};
        bolusLine.updateChart([baseBolusDose, newBolusDose]);
    } else if (cellId == 'inputInfusion') {
        var newInfusionDose = {type:'Physician', value:$('#inputInfusion').val()};
        infusionLine.updateChart([baseInfusionDose, newInfusionDose]);
    }

    var changeValue = $('#' + cellId).val();
    var baseValue = inputCellBaseValues[cellId];

    if (changeValue == baseValue) {
        d3.select('#' + cellId)
            .classed('standard-input-cell', true)
            .classed('changed-input-cell', false)
            .attr('data-toggle', null)
            .attr('data-placement', null)
            .attr('data-original-title', null)
            .attr('title', null);
    } else {
        d3.select('#' + cellId)
            .classed('standard-input-cell', false)
            .classed('changed-input-cell', true)
            .attr('data-toggle', 'tooltip')
            .attr('data-placement', 'top')
            .attr('title', 'Protocol: ' + d3.format(',')(baseValue))
            .attr('data-original-title', 'Protocol: ' + d3.format(',')(baseValue));
    }


    $('[data-toggle="tooltip"]').tooltip();

    var cellChangedFlag = false;
    for (var inputCell in inputCellIds) {
        if ($('#' + inputCellIds[inputCell]).hasClass("changed-input-cell")) {
            $('.protocol-change-flag').css("display", "inline");
            cellChangedFlag = true;
        }
    }
    if (!cellChangedFlag) {
        $('.protocol-change-flag').css("display", "none");
        probCharts.forEach(function(d) {
            d.updateChart([d.baseData]);
        });
    } else {
        probCharts.forEach(function(d) {
            d.updateChart([d.baseData, {type:'Physician', value:Math.min(Math.max(Math.random(), 0), 1)}]);
        });
    }
}

for (var inputCell in inputCellIds) {
    $('#' + inputCellIds[inputCell]).on("change", inputCellValueChange);
}

function submitOrder() {
    var override = $('input').hasClass('changed-input-cell');
    if (override) {
        window.location = 'dosing_override.html';
    } else {
        window.location = 'dosing_submission.html';
    }
}