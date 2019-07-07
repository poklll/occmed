let saved = false;

function addItem(type) {
    el = new Element();
    el.type = type;
    el.draftTo('#component_container');
    autosize($('.textarea-autosize'));
    addTabsupport();
    window.scrollTo(0, document.body.scrollHeight);
}

function addChoice(el){
    $(el).parent().parent().append(
        `<div class="choice">
        <i class="fa fa-circle" aria-hidden="true"></i><input type="text"  placeholder="add choice" onchange="choiceInput(this)"></input>
        </div>
        `
    );
    $(el).parent().next().find('input').focus();
}

function choiceInput(el){
    let choices = $(el).parent().parent();
    let html = $(el).parent().parent().parent().parent().attr('data-render');
    let temp = document.createElement('div');
    $(html).appendTo(temp);
    if($(el).val()==""){
        if($(el).parent().children().length > 1){
            removeChoice(el);
        }
    }
    else
    {
        addChoice(el);
    }

    $(choices).find('.choice > input').each((index,value)=>{
            let choice = $(value).val();
            if(choice != "")
            {
                var option = document.createElement('option');
                $(option).val(choice);
                $(option).text(choice);
                $(temp).find('select').append(option);
                html = $(temp).html();
                $(choices).parent().parent().attr('data-render-with-choices',html);
            } 
    });
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
            {   let html;
                let choices = $(value).attr("data-render-with-choices");
                if(choices)
                {
                    html = choices;
                }
                else
                {
                    html = $(value).attr("data-render");
                }
                $(html).appendTo('#render_container');
            }
        });

        var status = saved ? 'badge badge-succcess' : 'badge badge-secondary';
        $("#status").addClass(status);
        saved = !saved;
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

function removeChoice(el) {
    $(el).parent().remove();
}

