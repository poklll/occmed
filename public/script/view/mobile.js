
var viewportHeight;
var viewportWidth;
var profilemargin;

$(document).ready(function () {
    viewportHeight = $(window).height();
    viewportWidth = $(window).width();

});
$(window).resize(function () {

});


function searcheffect(visibility) {
    $('#top-nav').css("visibility",visibility);
}
