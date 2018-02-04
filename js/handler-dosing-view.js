var modelColorScale = d3.scaleOrdinal()
    .range(["#887bb4", "#e69d49"])
    .domain(['Protocol', 'Physician']);

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
    var baseValue = Math.floor(Math.random() * (5000 - 0)) + 0;
    $('#' + inputCellIds[inputCell]).val(baseValue);
    inputCellBaseValues[inputCellIds[inputCell]] = baseValue;
}

var baseBolusDose = {type:'Protocol', value:inputCellBaseValues['inputBolus']};
var baseInfusionDose = {type:'Protocol', value:inputCellBaseValues['inputInfusion']};

var bolusLine = new SingleLine('infusion-bolus-change-chart', baseBolusDose, 'inputBolus', ['Less', 'Greater']);
var infusionLine = new SingleLine('infusion-rate-change-chart', baseInfusionDose, 'inputInfusion', ['Less', 'Greater']);

function inputCellValueChange(element) {
    var cellId = element.target.id;

    if (cellId == 'inputBolus') {
        bolusLine.wrangleData();
    } else if (cellId == 'inputInfusion') {
        infusionLine.wrangleData();
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
}

for (var inputCell in inputCellIds) {
    $('#' + inputCellIds[inputCell]).on("change", inputCellValueChange);
}

