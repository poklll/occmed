let currentForm = new Form();
$( ()=>{
     var components = JSON.parse($("#elements").attr('data-elements')).elements;
     currentForm.components = components;
     currentForm.loadEditor('#component_container');
     $('#render_container').hide();
    }
)

function addItem(type) {
    var el = new Element();
    el.type = type;
    el.draftTo('#component_container');
    window.scrollTo(0, document.body.scrollHeight);
}


function preview(el) {
    let text = $(el).text();
    currentForm.components = [];
    if (text == "Preview") {
        $('#component_container').hide();
        $('#render_container').show();
        $('#add_button').hide();
        currentForm.components = [];
        currentForm.saveEditor('#component_container');
        $('#form').val(JSON.stringify({components : currentForm.components}));
        $("#status").attr('class','badge badge-success');
        $("#status").text("SAVED");
        text = "Editor";
    }
    else {
        $('#component_container').show();
        $('#render_container').empty();
        $('#render_container').hide();
        $('#add_button').show();
        text = "Preview";
    }
    $(el).text(text);
    addTabsupport();
}


function removeItem(el) {
    $(el).parent().remove();
    unsave();
}

function save()
{
        currentForm.components = [];
        currentForm.saveEditor('#component_container');
        $('#render_container').empty();
        $('#form').val(JSON.stringify({components : currentForm.components}));
        $("#status").attr('class','badge badge-success');
        $("#status").text("SAVED");
}

function unsave(){
    $("#status").attr('class','badge badge-secondary');
    $("#status").text("UNSAVED");
}