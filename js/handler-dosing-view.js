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

var probChartItems = [{title:'Therapeutic', value:.20, id:'therapeutic-prob-chart'},
    {title:'Sub-Therapeutic', value:.80, id:'sub-therapeutic-prob-chart'},
    {title:'SupraTherapeutic', value:.40, id:'supra-therapeutic-prob-chart'}]

var probCharts = [];

function generateProbabilitiesChart(element) {
    d3.select('#prob-container').append('h2')
        .attr('class', 'section-header')
        .html('Probability');

    var form = d3.select('#prob-container').append('form')
        .attr('class', 'form-horizontal');

    probChartItems.forEach(function(d) {
        var container = form.append('div').attr('class', 'form-group')
        container.append('label').attr('class', 'col-sm-5 control-label').html(d.title);
        container.append('div').attr('class', 'col-sm-7').attr('id', d.id);
        var dataItem = {type:'Protocol', value:d.value};
        var probChart = new SingleLine(d.id, ['0%', '100%'], dataItem, true, d3.format('.1%'));
        probCharts.push(probChart);
    });

    d3.select('#prob-view').remove();
}

$('#prob-view').on("click", generateProbabilitiesChart);