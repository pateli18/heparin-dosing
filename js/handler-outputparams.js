var patientParams = {'Weight':{type:'field', value:null},
    'Height':{type:'field', value:null},
    'Indication':{type:'field', value:null},
    'Age':{type:'field', value:null},
    'Creatinine':{type:'field', value:null},
    'SOFA':{type:'field', value:null},
    'Elixhauser':{type:'field', value:null},
    'Gender':{type:'button', value:null},
    'Ethnicity':{type:'button', value:null},
    'Renal':{type:'button', value:null},
    'PE':{type:'button', value:null},
    'ICU':{type:'field', value:null}};

function getParams() {
    for (var param in patientParams) {

        var unknownFlag;
        if (param == 'Weight' || param == 'Height' || param == 'Indication') {
            unknownFlag = false;
        } else {
            var paramClass = $('#na' + param).attr("class").split(' ');
            unknownFlag = (paramClass[paramClass.length - 1] == 'na-clicked');
        }

        if (unknownFlag) {
            patientParams[param].value = 'Unknown';
        } else  if (patientParams[param].type == 'field') {
            var fieldValue = $('#input' + param).val();
            if (fieldValue == "") {
                patientParams[param].value = 'Unknown';
                if (param == 'Weight' || param == 'Height') {
                    $('#formgroup' + param).addClass('has-error');
                    return false
                }
            } else {
                $('#formgroup' + param).removeClass('has-error');
                patientParams[param].value = fieldValue;
            }
        } else {
            var button1Class = $('#input' + param + 1).attr("class").split(' ');
            var button2Class = $('#input' + param + 2).attr("class").split(' ');
            if (button1Class[button1Class.length - 2] == 'input-clicked') {
                patientParams[param].value = $('#input' + param + 1).html();
            } else if (button2Class[button2Class.length - 2] == 'input-clicked') {
                patientParams[param].value = $('#input' + param + 2).html();
            } else {
                patientParams[param].value = 'Unknown';
            }
        }
    }

    return true
}

function calculateDose() {
    var execute = getParams();
    if (execute) {
        var queryParams = {};
        for (var param in patientParams) {
            queryParams[param] = patientParams[param].value;
        }
        var query = $.param(queryParams);
        window.location = 'dosing_view.html?' + String(query);
    }
}