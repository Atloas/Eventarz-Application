$(document).ready(function() {
    $("#locales").change(function () {
        var selectedOption = $('#locales').val();
        if (selectedOption != ''){
            var href = window.location.href;
            if (href.includes('?')) {
                var base = href.substring(0, href.indexOf('?'));
                if (href.includes('?uuid=') || href.includes('?name=')) {
                    var query = href.match(/\?(uuid|name)=.+?(&|$)/g)[0];
                    var lang;
                    if (query.includes('&')) {
                        lang = 'lang=';
                    }
                    else {
                        lang = '&lang=';
                    }
                    window.location.replace(base + query + lang + selectedOption);
                }
                else {
                    window.location.replace(base + '?lang=' + selectedOption);
                }
            }
            else {
                window.location.replace(window.location.href + '?lang=' + selectedOption);
            }
        }
    });
});