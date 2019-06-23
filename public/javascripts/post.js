function changeDescription(postId) {
    $.post('getPost', {id: postId}, function(post) {
        var text = post.text;
        
        post.imagesIndexes.forEach(function(image) {
            var imgCode = "&&-img_" + image + "-&&";
            var regexp = new RegExp(imgCode, "g");
            var textImg = '<img src="uploads/' + post.photos[image - 1] + '">';
            
            console.log(textImg)
            
            text = text.replace(regexp, textImg);
        });
        
        $('.main-description-box .description').html(text);
        console.log('success getting post');
    });
}