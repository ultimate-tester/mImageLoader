(function ($) {
    $.fn.mImageLoader = function (url, next, options) {
        var settings = $.extend({
            attribute: 'auto',
            type: 'image/png'
        }, options);

        var tag = $(this);
        var tagName = tag.prop("tagName").toLowerCase();
        settings.attribute = (settings.attribute == 'auto' ? ((tagName == 'img' || tagName == 'input') ? 'src' : ((tagName == 'object') ? 'data' : 'style')) : settings.attribute);

        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.responseType = 'blob';
        xhr.onload = function (e) {
            if (xhr.readyState == 4 && xhr.status == 200) {
                var returnedBlob = new Blob([xhr.response], {type: settings.type});
                var reader = new FileReader();
                reader.onload = function (e) {
                    var returnedURL = e.target.result;
                    var returnedBase64 = returnedURL.replace(/^[^,]+,/, '');
                    var base64DataUrl = 'data:image/png;base64,' + returnedBase64;

                    if (settings.attribute == 'style') {
                        tag.css('background-image', 'url(' + base64DataUrl + ')');
                    } else {
                        tag.attr(settings.attribute, base64DataUrl);
                    }

                    next(this);
                };

                reader.readAsDataURL(returnedBlob);
            }
        };

        xhr.send();
    };
}(jQuery));