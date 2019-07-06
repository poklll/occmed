function addItem(type) {
    el = new Element();
    el.type = type;
    el.draftTo('#component_container');
    autosize($('.textarea-autosize'));
    addTabsupport();
    window.scrollTo(0, document.body.scrollHeight);
}

function preview(el) {
    let text = $(el).text();
    let form = new Form($('#sectionname').val());
    if (text == "Preview") {
        form.saveEditor('#component_container');
        $('#component_container').hide();
        $('#render_container').show();
        $('#add_button').hide();
        $('.draft').each((index, value) => {
            if($(value).attr("data-name") == undefined || ""){
                 let error = new message("Please enter all field name","danger");
                 error.pushTo('#message_container');
                 return
            }
            else
            {
                let html = $(value).attr("data-render");
                $(html).appendTo('#render_container');
            }
        });
  
        //form.save('#render_container');
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
    $(el).parent().parent().remove();
}

