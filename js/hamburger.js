$(document).ready(function() {
    $('#hamburger').click(function() {
        $(this).toggleClass('open');
        $('#nav-links').toggleClass('active');
    });

    $('#nav-links a').click(function() {
        $('#hamburger').removeClass('open');
        $('#nav-links').removeClass('active');
    });
});
