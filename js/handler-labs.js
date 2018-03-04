var patient_record;
var lab_record;
var most_recent_lab;

queue()
    .defer(d3.csv, 'data/simulated_patient_records.csv')
    .defer(d3.json, 'data/patient_lab_data.json')
    .await(function(error, patient_data, lab_data) {

        var patient_record = {};
        location.search.substr(1).split("&").forEach(function(item) {patient_record[item.split("=")[0]] = item.split("=")[1]});

        var random_record = Math.floor(Math.random() * patient_data.length);
        if ("Weight" in patient_record) {
            lab_record = lab_data[random_record];
        } else {
            var random_record = Math.floor(Math.random() * patient_data.length);
            patient_data.forEach(function(d) {
                if (+d.id == random_record) {
                    patient_record = d;
                }
            });

            lab_record = lab_data[+patient_record.id];
        }

        for (var param in patient_record) {
            var value = patient_record[param];
            $('#patient' + param).html(value.split('+').join(' '));
            var random_prob = Math.random();
            if (random_prob > 0.7) {
                $('#patient' + param + 'SubImpact').html('<i class="fa fa-arrow-up"></i>');
                $('#patient' + param + 'SupraImpact').html('<i class="fa fa-arrow-down"></i>');
            } else if (random_prob < 0.3) {
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


        most_recent_lab = lab_record[0];
        $('#pttValue').html(d3.format(',')(most_recent_lab.ptt));
        $('#pttDate').html(d3.timeFormat('%b %d %H:%M')(most_recent_lab.ts));
        var pttChart = new LabLine('pttChart', lab_record, 'ptt');

        $('#pltValue').html(d3.format(',')(most_recent_lab.plt));
        $('#pltDate').html(d3.timeFormat('%b %d %H:%M')(most_recent_lab.ts));
        var pltChart = new LabLine('pltChart', lab_record, 'plt');
    });