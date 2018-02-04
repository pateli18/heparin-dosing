var modelColorScale = d3.scaleOrdinal()
    .range(["#887bb4", "#e69d49"])
    .domain(['Protocol', 'Physician']);

$('#inputBolus').val(4000);
$('#inputInfusion').val(1000);

var baseBolusDose = {type:'Protocol', value:+$('#inputBolus').val()};
var baseInfusionDose = {type:'Protocol', value:+$('#inputInfusion').val()};

var bolusLine = new SingleLine('infusion-bolus-change-chart', baseBolusDose, 'inputBolus', ['Less', 'Greater']);
var infusionLine = new SingleLine('infusion-rate-change-chart', baseInfusionDose, 'inputInfusion', ['Less', 'Greater']);

$('#inputBolus').on("change", function() {
    console.log('working');
    bolusLine.wrangleData();
});

$('#inputInfusion').on("change", function() {
    infusionLine.wrangleData();
});