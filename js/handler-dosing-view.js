var modelColorScale = d3.scaleOrdinal()
    .range(["#887bb4", "#e69d49"])
    .domain(['Protocol', 'Physician']);

// probability charts

var probChartItems = [{title:'Therapeutic', value:.20, id:'therapeutic-prob-chart'},
    {title:'Sub-Therapeutic', value:.80, id:'sub-therapeutic-prob-chart'},
    {title:'Supra-Therapeutic', value:.40, id:'supra-therapeutic-prob-chart'}]

var probCharts = [];

function generateProbabilitiesChart(element) {
    d3.select('#prob-container').append('h2')
        .attr('class', 'section-header')
        .html('Probabilities');

    var form = d3.select('#prob-container').append('form')
        .attr('class', 'form-horizontal');

    probChartItems.forEach(function(d) {
        var container = form.append('div').attr('class', 'form-group')
        container.append('label').attr('class', 'col-sm-3 control-label').html(d.title);
        container.append('div').attr('class', 'col-sm-9').attr('id', d.id);
        var dataItem = {type:'Protocol', value:d.value};
        var probChart = new SingleLine(d.id, ['0%', '100%'], dataItem, true, d3.format('.1%'));
        probCharts.push(probChart);
    });

    d3.select('#prob-view').remove();
}

$('#prob-view').on("click", generateProbabilitiesChart);

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

    probCharts.forEach(function(d) {
        d.updateChart([d.baseData, {type:'Physician', value:Math.min(Math.max(Math.random(), 0), 1)}]);
    });

    $('[data-toggle="tooltip"]').tooltip();
}

for (var inputCell in inputCellIds) {
    $('#' + inputCellIds[inputCell]).on("change", inputCellValueChange);
}

var patient_record;
var lab_record;
var most_recent_lab;

queue()
    .defer(d3.csv, 'data/simulated_patient_records.csv')
    .defer(d3.json, 'data/patient_lab_data.json')
    .await(function(error, patient_data, lab_data) {

    var random_record = Math.floor(Math.random() * patient_data.length);
    patient_data.forEach(function(d) {
        if (+d.id == random_record) {
            patient_record = d;
        }
    });

    lab_record = lab_data[+patient_record.id];

    for (var param in patient_record) {
        $('#patient' + param).html(patient_record[param]);
        var random_prob = Math.random();
        if (random_prob > 0.5) {
            $('#patient' + param + 'SubImpact').html('<i class="fa fa-arrow-up"></i>');
            $('#patient' + param + 'SupraImpact').html('<i class="fa fa-arrow-down"></i>');
        } else {
            $('#patient' + param + 'SubImpact').html('<i class="fa fa-arrow-down"></i>');
            $('#patient' + param + 'SupraImpact').html('<i class="fa fa-arrow-up"></i>');
        }
    }

    lab_record.forEach(function(d) {
        d.ts = d3.timeParse('%Y-%m-%d %H:%M:%S')(d.ts);
    });

    lab_record.sort(function(a, b) {
        return b.ts - a.ts;
    });

    console.log(lab_record);

    most_recent_lab = lab_record[0];
    $('#pttValue').html(d3.format(',')(most_recent_lab.ptt));
    $('#pttDate').html(d3.timeFormat('%b %d %H:%M')(most_recent_lab.ts));
    var pttChart = new LabLine('pttChart', lab_record, 'ptt');

    $('#pltValue').html(d3.format(',')(most_recent_lab.plt));
    $('#pltDate').html(d3.timeFormat('%b %d %H:%M')(most_recent_lab.ts));
    var pltChart = new LabLine('pltChart', lab_record, 'plt');
});

