
/**
 * Not valid file extention
 */
var getUnsupportedFileExtension = function() {
    return ['php', 'js', 'css', 'asp', 'rb', 'htaccess', 'htpasswd', 'html'];
}


/**
 * Sorting (By key)
 */
function sortByKey(array, key) {
    return array.sort(function(a, b) {
        var x = a[key];
        var y = b[key];
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
}


/**
 * Key down event
 */
$('body').on('keydown', '.disable-enter input[type="text"], .disable-enter input[type="password"]', function(event) {
    if (event.keyCode == 13) {
        return false;
    }
});


/**
 * Time Since
 */
var timeSince = function(date, postPrix, options) {

    if (!postPrix) {
        postPrix = 'ago';
    }

    var seconds = Math.floor((currentServerTime - date) / 1000);

    var interval = Math.floor(seconds / 31536000);
    if (interval >= 1) {
        return interval + " years " + postPrix;
    }
    interval = Math.floor(seconds / 2592000);
    if (interval >= 1) {
        return interval + " month " + postPrix;
    }
    interval = Math.floor(seconds / 86400);
    if (interval >= 1) {
        if (options && options.incDay) {
            return (interval + parseInt(options.incDay)) + " days " + postPrix;
        } else {
            return (interval) + " days " + postPrix;
        }
    }
    interval = Math.floor(seconds / 3600);
    if (interval >= 1) {
        return interval + " hours " + postPrix;
    }

    interval = Math.floor(seconds / 60);
    if (interval >= 1) {
        return interval + " mins " + postPrix;
    }

    return " few seconds " + postPrix;
}


/**
 * Convert To <BR>
 */
var convertToBR = function(value) {
    if (value && (typeof value) == 'string') {
        return value.replace(/\n/g, "<br />");
    }
    return '';
}


/**
 * Track Visitor
 */
var trackVisitor = function() {
    try {
        if (serverSessionId) {
            $.ajax({
                type: "POST",
                url: socketURL + "api/user-visit",
                data: {
                    user_id: '',
                    session_id: serverSessionId,
                    site_mgmt_id: activeSiteManager._id,
                }
            }).done(function(msg) {});
        }
    } catch (err) {}
}

// Track Visitor
trackVisitor();


/**
 * Unique id
 */
var getUID = function() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
    });
}


/**
 * manage summernote modal close event
 */
$('body').on('click', '.note-editor .note-icon-picture, .note-editor .note-icon-link', function() {
    $('.note-editor .modal.in button[data-dismiss="modal"]').remove();
    $('.note-editor .modal.in .custom-link-close').remove();
    $('.note-editor .modal.in .modal-header h4').before('<button type="button" class="close custom-link-close" aria-label="Close"><span aria-hidden="true">×</span></button>');

    setTimeout(function() {
        if ($('.modal.in .note-editor .modal').hasClass('in')) {

            $(".note-editor .modal.in .custom-link-close").click(function() {

                console.log('when user CLick on link btn close sign....?');
                $('.note-editor .modal.in').modal('hide');

                $("body").addClass('modal-open');
                setTimeout(function() {
                    $("body").addClass('modal-open');
                }, 800);
            });
        } else {

            $(".note-editor .modal.in .custom-link-close").click(function() {
                $('.note-editor .modal.in').modal('hide');
            });
        }
    }, 1000);
});
