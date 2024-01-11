$(document).ready(function() {
    checkWindowSize();
    $('#btn').on('click', function() {
        $(this).html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Processing');
        $(this).prop('disabled', true);
        $('#shoppingForm').submit();
    });
    $(window).bind("pageshow", function(event) {
        if (event.originalEvent.persisted) {
            window.location.reload(); 
        }
    });

    function checkWindowSize() {
        
        var windowWidth = $(window).width();
        if (windowWidth <= maxPhoneSize) {
            $('#footer').css("visibility", "hidden");
        } else {
            $('#footer').css("visibility", "visible");
        }
    };
    
    $(window).resize(function () {
        checkWindowSize();
    });

});
