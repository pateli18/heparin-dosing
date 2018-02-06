$('[data-toggle="tooltip"]').tooltip();

function na_input_clicked(element) {
    var buttonClasses = element.target.classList;
    var clickedFlag = (buttonClasses[buttonClasses.length - 1] == 'na-clicked');

    var buttonId = element.target.id;
    var inputId = buttonId.replace('na', 'input');

    if (clickedFlag) {
        $('#' + inputId).attr('disabled', false);
        $('#' + buttonId).removeClass('btn-warning');
        $('#' + buttonId).addClass('btn-default');
        $('#' + buttonId).removeClass('na-clicked');
    } else {
        $('#' + inputId).attr('disabled', true);
        $('#' + buttonId).removeClass('btn-default');
        $('#' + buttonId).addClass('btn-warning');
        $('#' + buttonId).addClass('na-clicked');
    }

    return false;
}

$('.na-input-button').on('click', na_input_clicked);

function na_button_clicked(element) {

    var buttonClasses = element.target.classList;
    var clickedFlag = (buttonClasses[buttonClasses.length - 1] == 'na-clicked');

    var buttonId = element.target.id;
    var inputId = buttonId.replace('na', 'input');

    if (clickedFlag) {
        $('#' + inputId + 1).attr('disabled', false);
        $('#' + inputId + 2).attr('disabled', false);
        $('#' + buttonId).removeClass('btn-warning');
        $('#' + buttonId).addClass('btn-default');
        $('#' + buttonId).removeClass('na-clicked');
    } else {
        $('#' + inputId + 1).attr('disabled', true);
        $('#' + inputId + 1).removeClass('btn-success');
        $('#' + inputId + 1).addClass('btn-default');
        $('#' + inputId + 2).attr('disabled', true);
        $('#' + inputId + 2).removeClass('btn-success');
        $('#' + inputId + 2).addClass('btn-default');
        $('#' + buttonId).removeClass('btn-default');
        $('#' + buttonId).addClass('btn-warning');
        $('#' + buttonId).addClass('na-clicked');
    }

    return false;
}

$('.na-button-button').on('click', na_button_clicked);

function input_button_clicked(element) {
    var buttonClasses = element.target.classList;

    var buttonId = element.target.id;
    var buttonNum = buttonId.slice(-1);


    if (buttonNum == 1) {
        $('#' + buttonId).addClass('input-clicked');
        $('#' + buttonId).removeClass('btn-warning');
        $('#' + buttonId).addClass('btn-success');
        $('#' + buttonId.replace('1', '2')).removeClass('btn-success');
        $('#' + buttonId.replace('1', '2')).addClass('btn-default');
        $('#' + buttonId.replace('1', '2')).removeClass('input-clicked');
    } else {
        $('#' + buttonId).addClass('input-clicked');
        $('#' + buttonId).addClass('btn-success');
        $('#' + buttonId.replace('2', '1')).removeClass('btn-success');
        $('#' + buttonId.replace('2', '1')).addClass('btn-default');
        $('#' + buttonId.replace('2', '1')).removeClass('input-clicked');
    }

    return false;
}

$('.input-button').on('click', input_button_clicked);

var patient_data;

d3.csv('data/simulated_patient_records.csv', function(raw_patient_data) {

    patient_data = raw_patient_data;

});

function generatePatient() {

    var patient_record;
    var random_record = Math.floor(Math.random() * patient_data.length);

    patient_data.forEach(function(d) {
        if (+d.id == random_record) {
            patient_record = d;
        }
    });

    for (var param in patient_record) {
        if (param in patientParams) {
            if (patientParams[param].type == 'field') {
                $('#input' + param).val(patient_record[param]);
            } else {
                var button1Clicked = ($('#input' + param + 1).html() == patient_record[param]);
                if (button1Clicked) {
                    $('#input' + param + 1).addClass('input-clicked');
                    $('#input' + param + 1).removeClass('btn-default');
                    $('#input' + param + 1).addClass('btn-success');
                    $('#input' + param + 2).addClass('btn-default');
                    $('#input' + param + 2).removeClass('btn-success');
                    $('#input' + param + 2).removeClass('input-clicked');
                } else {
                    $('#input' + param + 2).addClass('input-clicked');
                    $('#input' + param + 2).removeClass('btn-default');
                    $('#input' + param + 2).addClass('btn-success');
                    $('#input' + param + 1).addClass('btn-default');
                    $('#input' + param + 1).removeClass('btn-success');
                    $('#input' + param + 1).removeClass('input-clicked');
                }
            }
        }
    }
}