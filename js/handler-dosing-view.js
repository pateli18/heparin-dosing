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
}

for (var inputCell in inputCellIds) {
    $('#' + inputCellIds[inputCell]).on("change", inputCellValueChange);
}

var baseTherapeuticProb = {type:'Protocol', value:.0};
var baseSubTherapeuticProb = {type:'Protocol', value:1.0};
var baseSupraTherapeuticProb = {type:'Protocol', value:.40};

var therapeuticLine = new SingleLine('therapeutic-prob-chart', ['0%', '100%'], baseTherapeuticProb, true, d3.format('.1%'));
var subTherapeuticLine = new SingleLine('sub-therapeutic-prob-chart', ['0%', '100%'], baseSubTherapeuticProb, true, d3.format('.1%'));
var supraTherapeuticLine = new SingleLine('supra-therapeutic-prob-chart', ['0%', '100%'], baseSupraTherapeuticProb, true, d3.format('.1%'));