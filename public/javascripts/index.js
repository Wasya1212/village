$(document).ready(function() {
  var $_main_menu = $('#header .top-bar');
  var $_menu_container = $_main_menu.parent();

  var menu_y = $_main_menu.offset().top;
  var menu_h = $_main_menu.height();

  $(window).on('scroll', function(e) {
    if ($(this).scrollTop() >= menu_y) {
      if ($_main_menu.attr('position') != 'fixed') {
        $_main_menu.attr({ 'position': 'fixed' });
        $_menu_container.height(menu_h);
      }
    } else {
      $_main_menu.removeAttr('position');
      $_menu_container.css('height', 'auto');
    }
  });
});

var $reveal = $('#reveal');
var $createPostForm = $('#createPostForm');

$reveal.on('closed.zf.reveal', function() {
    clearPostForm($createPostForm);
});

function deletePost(postId) {
    $.post('/post/delete', {postId: postId}, function() {
        $('#post_preview_' + postId).remove();
    });
}

function changeDocument(personId) {
    $('.reveal').empty();

    $('.reveal').append($('<div class="uploading-box"><label for="fileUpload" class="button">Виберіть файл...</label><input type="file" id="fileUpload" class="show-for-sr"><button class="button" type="button" onclick="addDocument($(\'#fileUpload\'), \'' + personId + '\');">Надіслати</button></div>'));

    $('.reveal').foundation('open');
}

function addDocument(documentInput, residentId) {
    var formData = new FormData()

    formData.append('residentId', residentId);
    formData.append('document', documentInput[0].files[0]);

    $.ajax({
        url: '/addDocument',
        method: 'POST',
        dataType: 'json',
        contentType: false,
        processData: false,
        data: formData,
        success: function(data) {
            alert('success send document to the server');
        }
    });
}

function makeDeath(personId) {
    $.post('/makeDeath', {id: personId}, function(results) {
        alert('success make death');
    });
}

function searchBuildings(params, callback) {
    $.post('/buildings/get', params, callback);
}

$('#searchBuildingForm').submit(function(e) {
    e.preventDefault();

    searchBuildings($(this).serialize(), function (results) {
        $('.buildings-section').empty();
        printBuildings(results.buildings);
    });
});

function searchResidents(params, callback) {
    $.post('/residents/get', params, callback);
}

$('#searchResidentForm').submit(function(e) {
    e.preventDefault();

    searchResFormFunc($(this));
});

function searchResFormFunc(form) {
    searchResidents(form.serialize(), function (results) {
        console.log(results.residents);
        $('.residents-section').empty();
        printResidents(results.residents, function(building) {
            $('.buildings-section').append('<div class="row building-box" id="building_' + i + '"><div class="small-1 medium-1 large-1 shrink column">' + i + '</div><a href="/buildings?id=' + building._id + '"><div class="small-1 medium-1 large-1 column">' + building.number + '</div></a><div class="small-4 medium-4 large-4 column"><ul class="dropdown menu" data-dropdown-menu="dps9mv-dropdown-menu" role="menubar"><li role="menuitem" class="is-dropdown-submenu-parent opens-right" aria-haspopup="true" aria-label="Owners"><a href="#">Owners</a><ul class="menu submenu is-dropdown-submenu first-sub vertical" data-submenu="" role="menu"><li role="menuitem" class="is-submenu-item is-dropdown-submenu-item"><a href="#">owner-4</a></li><li role="menuitem" class="is-submenu-item is-dropdown-submenu-item"><a href="#">owner-4</a></li><li role="menuitem" class="is-submenu-item is-dropdown-submenu-item"><a href="#">owner-4</a></li><li role="menuitem" class="is-submenu-item is-dropdown-submenu-item"><a href="#">owner-4</a></li><li role="menuitem" class="is-submenu-item is-dropdown-submenu-item"><a href="#">owner-4</a></li></ul></li></ul></div><div class="small-2 medium-2 large-2 column">' + (building.area + building.sgArea + building.businessArea + building.forestArea) + '</div><div class="small-4 medium-4 large-4 column">' + building.village + ' ' + building.street + '</div></div>');
        });
    });
}

function searchBuiFormFunc(form) {
    searchResidents(form.serialize(), function (results) {
        console.log(results.residents);
        $('.residents-section').empty();
        printBuildings(results.residents, function(building) {
            $('.buildings-section').append('<div class="row building-box" id="building_' + i + '"><div class="small-1 medium-1 large-1 shrink column">' + i + '</div><a href="/buildings?id=' + building._id + '"><div class="small-1 medium-1 large-1 column">' + building.number + '</div></a><div class="small-4 medium-4 large-4 column"><ul class="dropdown menu" data-dropdown-menu="dps9mv-dropdown-menu" role="menubar"><li role="menuitem" class="is-dropdown-submenu-parent opens-right" aria-haspopup="true" aria-label="Owners"><a href="#">Owners</a><ul class="menu submenu is-dropdown-submenu first-sub vertical" data-submenu="" role="menu"><li role="menuitem" class="is-submenu-item is-dropdown-submenu-item"><a href="#">owner-4</a></li><li role="menuitem" class="is-submenu-item is-dropdown-submenu-item"><a href="#">owner-4</a></li><li role="menuitem" class="is-submenu-item is-dropdown-submenu-item"><a href="#">owner-4</a></li><li role="menuitem" class="is-submenu-item is-dropdown-submenu-item"><a href="#">owner-4</a></li><li role="menuitem" class="is-submenu-item is-dropdown-submenu-item"><a href="#">owner-4</a></li></ul></li></ul></div><div class="small-2 medium-2 large-2 column">' + (building.area + building.sgArea + building.businessArea + building.forestArea) + '</div><div class="small-4 medium-4 large-4 column">' + building.village + ' ' + building.street + '</div></div>');
        });
    });
}

function printBuildings(buildings) {
    var i = 1;

    buildings.forEach(function(building) {
        try {
            $('.buildings-section').append('<div class="row building-box" id="building_' + i + '"><div class="small-1 medium-1 large-1 shrink column">' + i + '</div><a href="/buildings?id=' + building._id + '"><div class="small-1 medium-1 large-1 column">' + building.number + '</div></a><div class="small-4 medium-4 large-4 column"><ul class="dropdown menu" data-dropdown-menu="dps9mv-dropdown-menu" role="menubar"><li role="menuitem" class="is-dropdown-submenu-parent opens-right" aria-haspopup="true" aria-label="Owners"><a href="#">Owners</a><ul class="menu submenu is-dropdown-submenu first-sub vertical" data-submenu="" role="menu"><li role="menuitem" class="is-submenu-item is-dropdown-submenu-item"><a href="#">owner-4</a></li><li role="menuitem" class="is-submenu-item is-dropdown-submenu-item"><a href="#">owner-4</a></li><li role="menuitem" class="is-submenu-item is-dropdown-submenu-item"><a href="#">owner-4</a></li><li role="menuitem" class="is-submenu-item is-dropdown-submenu-item"><a href="#">owner-4</a></li><li role="menuitem" class="is-submenu-item is-dropdown-submenu-item"><a href="#">owner-4</a></li></ul></li></ul></div><div class="small-2 medium-2 large-2 column">' + (building.area + building.sgArea + building.businessArea + building.forestArea) + '</div><div class="small-4 medium-4 large-4 column">' + building.village + ' ' + building.street + '</div></div>');
        } catch (e) {
            console.error(e.message);
        }
        i++;
    });
}

function printResidents(residents) {
    var i = 1;

    residents.forEach(function(resident) {
        try {
            $('.residents-section').append('<div class="row resident-box" id="resident_' + resident._id + '"><div class="small-1 medium-1 large-1 shrink column">' + i + '</div><div class="small-5 medium-5 large-5 column"><a href="/residents?id=' + resident._id + '">' + resident.name.fName + ' ' + resident.name.mName + ' ' + resident.name.lName + '</a></div><div class="small-2 medium-2 large-2 column">' + new Date(resident.birth).getDate() + '.' + (new Date(resident.birth).getMonth() + 1) + '.' + new Date(resident.birth).getFullYear() + '</div><div class="small-3 medium-3 large-3 column">' + resident.passport + '</div><div class="small-1 medium-1 large-1 column"> <a class="button toHomeBtn" href="/buildings?id=' + resident.building + '"><i class="fi-home"></i></a></div></div>');
        } catch (e) {
            console.error(e.message);
        }
        i++;
    });
}

$('#createUserForm').submit(function(e) {
    e.preventDefault();

    var $form = $(this);
    var username = $('#create_user_username_input').val(),
        password = $('#create_user_password_input').val();

    $.ajax({
        url: '/registrate',
        dataType: 'json',
        method: 'POST',
        data: $form.serialize(),
        beforeSend: function() {
            console.log('username: ' + username);
            console.log('password: ' + password);
        },
        success: function(result) {
            console.log('You registrated a new user');
        }
    });

    return false;
});

$createPostForm.on('submit', function(e) {
    e.preventDefault();

    var $additionalImages = $('.imageUploadingContainer input[type="file"]');
    var $additionalLinks = $('.links-block input[type="text"]');
    var $additionalAuthors = $('.additional-author');

    var previewImage = $('#post_photo_upload')[0].files[0] || undefined;
    var title = $('#post_title_input').val();
    var description = $('#post_description_textarea').val();
    var size = $('input[name="postSize"]:checked').val();
    var tagName = $('select.post-tag_name').val();
    var additionalImages = [];
    var additionalLinks = [];
    var additionalAuthors = [];

    for (var i = 0, pictureIndex = 0; i < $additionalImages.length; i++) {
        if ($additionalImages[i].files[0]) {
            additionalImages.push($additionalImages[i].files[0]);
            additionalImages[pictureIndex++].index = i + 1;
        }
    }

    additionalLinks = $additionalLinks.map(function() {
        if ($(this).val() != '')
            return $(this).val();
    }).get();

    additionalAuthors = $additionalAuthors.map(function() {
        if ($(this).val() != '')
            return $(this).val();
    }).get();

    var formData = new FormData();

    console.log(previewImage);
    formData.append('preview', previewImage);
    formData.append('title', title);
    formData.append('description', description);
    formData.append('size', size);
    formData.append('tag_name', tagName);
    formData.append('authors', additionalAuthors);
    formData.append('links', additionalLinks);
    formData.append('images', additionalImages.map(function(image) {
        return image.index;
    }));

    additionalImages.forEach(function(image) {
        formData.append('image_' + image.index, image);
    });

    $.ajax({
        url: '/post',
        method: 'POST',
        contentType: false,
        processData: false,
        dataType: 'json',
        data: formData,
        beforeSend: function() {
            console.log('Send post request to the server');
        },
        success: function(data) {
            console.log('Success request to the server!');
            $('.reveal').foundation('close');
            window.location.reload(true);
        }
    });
})

changeImage($('#post_photo_upload'), function(e) {
    $('.previewPostImage').css({
        'background-image' : 'url("' + e.target.result + '")',
        'height' : '150px'
    });
});

function createPost() {
    $reveal.foundation('open');
}

function clearPostForm(form) {
    $('.links-block', form).empty();
    $('.authors-block', form).empty();
    $('.uploaded-post-content-images').empty();

    $('#post_title_input', form).val('');
    $('#post_description_textarea', form).val('');

    $('.addPhoto').attr('onclick', 'addImageTo(1); return false;');
    $('.addLink').attr('onclick', 'addLinkInput(1);');
    $('.addAuthor').attr('onclick', 'addAuthorInput(1);');
}

function changeImage(uploadBtn, callback) {
    uploadBtn.change(function() {
        if (this.files && this.files[0]) {
            var reader = new FileReader();

            reader.onload = function(e) {
                callback(e);
            };

            reader.readAsDataURL(this.files[0]);
        }
    });
}

function addImageTo() {
    var $dectriptionText = $('#post_description_textarea'),
        $uploadingContainer = $('.uploaded-post-content-images');

    let picturesCount = getFuncParams($('.addPhoto'), 'onclick');
    let cc = picturesCount;
    let imgCode = '&&-img_' + picturesCount + '-&&';

    $uploadingContainer.append('<li class="imageUploadingContainer"><input type="file" class="show-for-sr" name="additionalImage' + picturesCount + '" id="additionalImage' + picturesCount + '"><label class="button hollow uploadImage' + picturesCount + 'Btn" for="additionalImage' + picturesCount + '">no image</label></li>');
    $dectriptionText.val($dectriptionText.val() + imgCode);

    changeImage($('#additionalImage' + picturesCount), function(e) {
        $('.uploadImage' + cc +'Btn').css({
            'background-image' : 'url("' + e.target.result + '")',
            'background-size' : 'contain',
            'background-repeat' : 'no-repeat',
            'background-position' : 'center center'
        }).text('').attr('image-code', imgCode);
    });

    $('.uploadImage' + picturesCount + 'Btn').click();
    $('.addPhoto').attr('onclick', 'addImageTo(' + ++picturesCount + '); return false;');
}

function reset_form_element(element) {
    element.wrap('<form>').parent('form').trigger('reset');
    element.unwrap();
}

function addAuthorInput(element) {
    let authorCount = getFuncParams($('.addAuthor'), 'onclick');

    $('.additional-info-block .authors-block').append('<input type="text" name="additionalAuthor' + authorCount + '" id="additional_author_' + authorCount + '" class="additional-author" placeholder="additional author ' + authorCount +  '">');
    $('.addAuthor').attr('onclick', 'addAuthorInput(' + ++authorCount + ');');
}

function addLinkInput(element) {
    let linkCount = getFuncParams($('.addLink'), 'onclick');

    $('.additional-info-block .links-block').append('<input type="text" name="additionalLink' + linkCount + '" id="additional_link_' + linkCount + '" class="additional-link" placeholder="additional link ' + linkCount +  '">');
    $('.addLink').attr('onclick', 'addLinkInput(' + ++linkCount + ');');
}

function getFuncParams(element, attribute) {
    return element.attr(attribute).split('(')[1].split(')')[0];
}
