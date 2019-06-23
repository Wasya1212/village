function removeResident(buildingId) {
    var readyResidents = $('.residentCheckbox:checkbox:checked').map(function() {
        return $(this).val();
    }).get();
    
    $.post('/residents/delete', {buildingId: buildingId, residents: readyResidents}, function() {
        alert('Success deleted');
    });
}

function addResidentFromList(buildingId) {
    $.post('/residents/get', function(data) {
        $('#reveal_modal').empty();
        $('#reveal_modal').append($('<h3 class="button large alert" data-toggle="searchResidentForm">Фільтр</h3><form style="display: none;" data-toggler data-animate="fade-in fade-out" id="searchResidentForm"><p><input type="text" name="name.fName" placeholder="ПІБ"><input type="text" name="name.mName" placeholder="по батькові"><input type="text" name="name.lName" placeholder="прізвище"></p><p><input type="date" name="birth" placeholder="дата народження"></p><p></p><h5>Судимість</h5><input type="radio" name="conviction" value="true"><label>Так</label><input type="radio" name="conviction" value="false"><label>Ні</label><input type="radio" name="conviction" value="" checked=""><label>Не важливо</label><p></p><p><input type="text" name="study" placeholder="освіта"></p><p><input type="text" name="work" placeholder="робота"></p><p></p><h5>Пенсіонер</h5><input type="radio" name="pensioner" value="true"><label>Так</label><input type="radio" name="pensioner" value="false"><label>Ні</label><input type="radio" name="pensioner" value="" checked=""><label>Не важливо</label><p></p><p><input type="text" name="passport" placeholder="Код паспорту"></p><input class="expanded button success" type="submit" value="Search"></form>'));
        var tog = new Foundation.Toggler($('#searchResidentForm'), {});
        $('#searchResidentForm').submit(function(e) {
            e.preventDefault();

            var searchResFormFunc2 = function (form) {
                searchResidents(form.serialize(), function (data) {
                    console.log(data.residents);
                    $('.residents-section').empty();
                    data.residents.forEach(function (resident) {
                        $('.residents-section').append('<div class="row resident-box" id="resident_' + resident._id + '"><div class="small-1 medium-1 large-1 shrink column"><button class="button toHomeBtn" onclick="addResident(\'' + resident._id + '\', \'' + buildingId + '\');"><i class="fi-check"></i></button></div><div class="small-5 medium-5 large-5 column"><a href="/residents?id=' + resident._id + '">' + resident.name.fName + ' ' + resident.name.mName + ' ' + resident.name.lName + '</a></div><div class="small-2 medium-2 large-2 column">' + new Date(resident.birth).getDate() + '.' + (new Date(resident.birth).getMonth() + 1) + '.' + new Date(resident.birth).getFullYear() + '</div><div class="small-3 medium-3 large-3 column">' + resident.passport + '</div><div class="small-1 medium-1 large-1 column"> <a class="button toHomeBtn" href="/buildings?id=' + resident.building + '"><i class="fi-home"></i></a></div></div>');
                    });
                });
            }
            
            searchResFormFunc2($(this));
        });
        $('#reveal_modal').append($('<menu class="menu expanded row">Виберіть жителя:<menu>'));
        $('#reveal_modal').append($('<div class="expanded row"><strong class="small-4 medium-4 large-4 column">ПІБ</strong><strong class="small-4 medium-4 large-4 column">Дата народження</strong><strong class="small-4 medium-4 large-4 column">Ідентифікаційний код</strong></div>'));
        $('#reveal_modal').append($('<section class="residents-section"></section>'));
        data.residents.forEach(function (resident) {
            $('.residents-section').append('<div class="row resident-box" id="resident_' + resident._id + '"><div class="small-1 medium-1 large-1 shrink column"><button class="button toHomeBtn" onclick="addResident(\'' + resident._id + '\', \'' + buildingId + '\');"><i class="fi-check"></i></button></div><div class="small-5 medium-5 large-5 column"><a href="/residents?id=' + resident._id + '">' + resident.name.fName + ' ' + resident.name.mName + ' ' + resident.name.lName + '</a></div><div class="small-2 medium-2 large-2 column">' + new Date(resident.birth).getDate() + '.' + (new Date(resident.birth).getMonth() + 1) + '.' + new Date(resident.birth).getFullYear() + '</div><div class="small-3 medium-3 large-3 column">' + resident.passport + '</div><div class="small-1 medium-1 large-1 column"> <a class="button toHomeBtn" href="/buildings?id=' + resident.building + '"><i class="fi-home"></i></a></div></div>');
        });
    });
    $('#reveal_modal').foundation('open');
}

function addResident(residentId, buildingId) {
    $.post('/residents/add', {buildingId: buildingId, residentId: residentId}, function(data) {
        alert('Success adding');
    });
}

function removeOwner(buildingId) {
    var readyOwners = $('.ownerCheckbox:checkbox:checked').map(function() {
        return $(this).val();
    }).get();
    
    $.post('/owners/delete', {buildingId: buildingId, owners: readyOwners}, function() {
        alert('Success deleted');
    });
}

function replaceResident(buildingId) {
    $.post('/buildings/getAllSuka', {}, function(data) {
        $('#reveal_modal').empty();
        $('#reveal_modal').append($('<menu class="menu expanded row">Виберіть новий будинок:<menu>'));
        $('#reveal_modal').append($('<div class="expanded row"><strong class="small-1 medium-1 large-1 column">.</strong><strong class="small-1 medium-1 large-1 column">Номер</strong><strong class="small-4 medium-4 large-4 column">Житлова площа</strong><strong class="small-2 medium-2 large-2 column">Загальна площа</strong><strong class="small-4 medium-4 large-4 column">Адреса</strong></div>'));
        $('#reveal_modal').append('<section class="buildings-section"></section>')
        data.buildings.forEach(function(building) {
            try {
                if (buildingId != building._id)
                    $('.buildings-section').append('<div class="row building-box" id="building_' + building._id + '"><div class="small-1 medium-1 large-1 shrink column"><button class="button toHomeBtn" type="button" onclick="confirmReplacing(\'' + buildingId + '\', \'' + building._id + '\');"><i class="fi-check"></i></button></div><div class="small-1 medium-1 large-1 column"><a href="/buildings?id=' + building._id + '">' + building.number + '</a></div><div class="small-4 medium-4 large-4 column">' + building.area + '</div><div class="small-2 medium-2 large-2 column">' + (building.area + building.sgArea + building.businessArea + building.forestArea) + '</div><div class="small-4 medium-4 large-4 column">' + building.village + ' ' + building.street + '</div></div>');
            } catch (e) {
                console.error(e.message);
            }
        });
        /*data.buildings.forEach(function(building) {
            if (buildingId != building._id)
                $('#reveal_modal').append($('<div onclick="confirmReplacing(\'' + buildingId + '\', \'' + building._id + '\');"><span class="small-4 medium-4 large-4 column">' + building.village + '</span><span class="small-4 medium-4 large-4 column">' + building.street + '</span><span class="small-4 medium-4 large-4 column">' + building.number + '</span></div>'));
        });*/
    });
    $('#reveal_modal').foundation('open');
}

function confirmReplacing(buildingId, newBuildingId) {
    var readyResidents = $('.residentCheckbox:checkbox:checked').map(function() {
        return $(this).val();
    }).get();
    
    $.post('/residents/remove', {buildingId: buildingId, newBuildingId: newBuildingId, residents: readyResidents}, function() {
        $('#reveal_modal').foundation('close');
        alert('Success replace');
    });
}

function addOwner(buildingId) {
    $.post('/residents/get', function(data) {
        $('#reveal_modal').empty();
        $('#reveal_modal').append($('<h3 class="button large alert" data-toggle="searchResidentForm">Фільтр</h3><form style="display: none;" data-toggler data-animate="fade-in fade-out" id="searchResidentForm"><p><input type="text" name="name.fName" placeholder="ПІБ"><input type="text" name="name.mName" placeholder="по батькові"><input type="text" name="name.lName" placeholder="прізвище"></p><p><input type="date" name="birth" placeholder="дата народження"></p><p></p><h5>Судимість</h5><input type="radio" name="conviction" value="true"><label>Так</label><input type="radio" name="conviction" value="false"><label>Ні</label><input type="radio" name="conviction" value="" checked=""><label>Не важливо</label><p></p><p><input type="text" name="study" placeholder="освіта"></p><p><input type="text" name="work" placeholder="робота"></p><p></p><h5>Пенсіонер</h5><input type="radio" name="pensioner" value="true"><label>Так</label><input type="radio" name="pensioner" value="false"><label>Ні</label><input type="radio" name="pensioner" value="" checked=""><label>Не важливо</label><p></p><p><input type="text" name="passport" placeholder="Код паспорту"></p><input class="expanded button success" type="submit" value="Search"></form>'));
        var tog = new Foundation.Toggler($('#searchResidentForm'), {});
        $('#searchResidentForm').submit(function(e) {
            e.preventDefault();
            
            var searchResFormFunc2 = function (form) {
                searchResidents(form.serialize(), function (data) {
                    console.log(data.residents);
                    $('.residents-section').empty();
                    data.residents.forEach(function (resident) {
                        $('.residents-section').append('<div class="row resident-box" id="resident_' + resident._id + '"><div class="small-1 medium-1 large-1 shrink column"><button class="button toHomeBtn" onclick="confirmOwnering(\'' + resident._id + '\', \'' + buildingId + '\');"><i class="fi-check"></i></button></div><div class="small-5 medium-5 large-5 column"><a href="/residents?id=' + resident._id + '">' + resident.name.fName + ' ' + resident.name.mName + ' ' + resident.name.lName + '</a></div><div class="small-2 medium-2 large-2 column">' + new Date(resident.birth).getDate() + '.' + (new Date(resident.birth).getMonth() + 1) + '.' + new Date(resident.birth).getFullYear() + '</div><div class="small-3 medium-3 large-3 column">' + resident.passport + '</div><div class="small-1 medium-1 large-1 column"> <a class="button toHomeBtn" href="/buildings?id=' + resident.building + '"><i class="fi-home"></i></a></div></div>');
                    });
                });
            }
            
            searchResFormFunc2($(this));
        });
        $('#reveal_modal').append($('<menu class="menu expanded row">Виберіть жителя:<menu>'));
        $('#reveal_modal').append($('<div class="expanded row"><strong class="small-4 medium-4 large-4 column">ПІБ</strong><strong class="small-4 medium-4 large-4 column">Дата народження</strong><strong class="small-4 medium-4 large-4 column">Ідентифікаційний код</strong></div>'));
        $('#reveal_modal').append($('<section class="residents-section"></section>'));
        data.residents.forEach(function (resident) {
            $('.residents-section').append('<div class="row resident-box" id="resident_' + resident._id + '"><div class="small-1 medium-1 large-1 shrink column"><button class="button toHomeBtn" onclick="confirmOwnering(\'' + resident._id + '\', \'' + buildingId + '\');"><i class="fi-check"></i></button></div><div class="small-5 medium-5 large-5 column"><a href="/residents?id=' + resident._id + '">' + resident.name.fName + ' ' + resident.name.mName + ' ' + resident.name.lName + '</a></div><div class="small-2 medium-2 large-2 column">' + new Date(resident.birth).getDate() + '.' + (new Date(resident.birth).getMonth() + 1) + '.' + new Date(resident.birth).getFullYear() + '</div><div class="small-3 medium-3 large-3 column">' + resident.passport + '</div><div class="small-1 medium-1 large-1 column"> <a class="button toHomeBtn" href="/buildings?id=' + resident.building + '"><i class="fi-home"></i></a></div></div>');
        });
    });
    $('#reveal_modal').foundation('open');
}

function confirmOwnering(residentId, buildingId) {
    $.post('/addOwner', {buildingId: buildingId, residentId, residentId}, function() {
        alert('success ownering');
    });
}