$('#editResidentForm').submit(function(e) {
    e.preventDefault();
});

function editInfo(form, residentId) { // правка інфи про користувача
    var $form = form, // береш форму
        formData = new FormData(),
        data = $form.serializeArray(); // вибираєш з неї данні
        
    data.forEach(function(element, index) {
        formData.append(element.name, element.value); // додаєш їх для відправки з більш крутого типу (тут і файли можна закидати і додаткові - свої змінні)
    });
        
    formData.append('residentId', residentId); // додаєш айдішник користувача
    
    formData.append('picture', $('#picture_upload')[0].files[0]); // додаєш його картиночку
        
    $.ajax({ // відправляєш на сервак                     
        url: '/editResident', // урл
        method: 'POST', // метод відправки
        dataType: 'json', // тип кодування для сервака
        contentType: false, // для фоток
        processData: false, // тож для фоток
        data: formData, // данні що відправляєш
        beforeSend: function() { // до відправки що робити
            $('button[type="submit"]', $form).addClass('disabled'); 
        },
        success: function(data) { // у разі відповіді від сервака ( приймає калбек )
            console.log('success send to the server');
        },
        complete: function() { // коли успішно завершено
            $('button[type="submit"]', $form).removeClass('disabled');
            window.location.reload(false); // перезагрузка сторінки
        }
    });
}    //спасибі звісно але мені так в загальному що функції роблять і все

$('#addResidentForm').submit(function(e) { // заборона стандартної відправки форми
    e.preventDefault();
});

function addResident(form, buildingId) { // додати чувака
    var $form = form,
        formData = new FormData(),
        data = $form.serializeArray();
        
    data.forEach(function(element, index) {
        formData.append(element.name, element.value);
    });
        
    formData.append('buildingId', buildingId);
    
    formData.append('picture', $('#picture_upload')[0].files[0]);
        
    $.ajax({
        url: '/addResident',
        method: 'POST',
        dataType: 'json',
        contentType: false,
        processData: false,
        data: formData,
        beforeSend: function() {
            $('button[type="submit"]', $form).addClass('disabled'); 
        },
        success: function(data) {
            console.log('success send to the server');
        },
        complete: function() {
            $('button[type="submit"]', $form).removeClass('disabled');
            window.location.reload(false);
        }
    });
}

$('#addBuildingForm').submit(function(e) { // додати будівлю
    e.preventDefault();
    var $form = $(this);
    
    $.ajax({
        url: '/addBuilding',
        method: 'POST',
        dataType: 'json',
        data: $form.serialize(),
        beforeSend: function() {
            $('input[type="submit"]', $form).addClass('disabled'); 
        },
        success: function(data) {
            console.log('success send to the server');
        },
        complete: function() {
            $('input[type="submit"]', $form).removeClass('disabled');
            window.location.reload(false);
        }
    });
});

changeImage($('#picture_upload'), function(e) { // показати яку ти картинку будеш ставити на аву, перед відправкою на сервак як в скайпі
    $('#addResidentForm .photo-box img').attr("src", e.target.result);
});