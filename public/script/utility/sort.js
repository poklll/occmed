var sort = false;
function sortableEnable(container) {
    $(container).sortable();
    $(container).sortable("option", "disabled", false);
    // ^^^ this is required otherwise re-enabling sortable will not work!
    $(container).disableSelection();
    return false;
}

function sortableDisable(container) {
    $(container).sortable("disable");
    return false;
}

function togglesort(button, container) {
    if (sort) {
        sortableDisable(container);
        $(button).attr('class','btn btn btn-outline-info');
    } else {
        sortableEnable(container);
        $(button).attr('class','btn btn-primary');
    }
    sort = !sort;
}