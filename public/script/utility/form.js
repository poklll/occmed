

class Element {
    drafted
    rendered
    saved
    constructor(name, type, value) {
        this.name = name;
        this.type = type;
        this.value = value;
    }
    draft() {
        let type = this.type;
        let element;
        let template = document.createElement('div');
        $(template).addClass('form-group component_item').html(`<label for="" class="mb-1"></label>
        <button type="button" class="close" aria-label="Close" onclick="removeItem(this)"><span aria-hidden="true">&times;</span></button>
        <input type="text" id="component_name" class="form-control component_name" placeholder="Enter field name"></input>`);
        if (type == "Long text") {
            element = `<textarea  name="" class="form-control textarea-autosize" rows="1"></textarea>`;
            $(element).appendTo(template);
            addTabsupport();
            autosize($('.textarea-autosize'));
        }
        else
            if (type == "Choices") {
                element = `<div class="choice_container">
                       <div class="choice">
                       <i class="fa fa-circle" aria-hidden="true"></i><input type="text" placeholder="add choice" onchange="choiceInput(this)"></input>
                       </div>
                       </div>`;
                $(element).appendTo(template);
            }
            else
                if (type == "Images") {
                    var gallery = new Gallery();
                    $(gallery.element).appendTo(template);
                    var add = $('<button id="add_image" class="btn btn-dark"></button>').appendTo(template);
                    var fileinput = $('<input type="file"></input>').appendTo(template).css("display", "none");
                    $(add).css('width', '100%');
                    $(add).html(' <i class="fa fa-upload" aria-hidden="true"></i>');
                    $(add).click(() => {
                        fileinput.click();
                    });
                    $(fileinput).change(() => {
                        var file = $(fileinput).prop("files")[0];
                        var formData = new FormData();
                        formData.append('photo', file);
                        let xhr = new XMLHttpRequest();
                        xhr.open("POST", "/upload");
                        xhr.onload = function () {
                            var imgpath = xhr.responseText;
                            gallery.add("/image/"+imgpath);
                        }
                        xhr.send(formData);
                    });
                }
                else {
                    element = `<input type="${type}" name="" class="form-control"></input>`;
                    $(element).appendTo(template);
                }
        this.drafted = template;
        this.draftsetup();
        return template;
    }

    render(name) {
        let temp = $(this.drafted).clone();
        let select = document.createElement('select');
        $(temp).attr("id", name);
        $(temp).addClass("render_item");
        $(temp).removeClass("component_item");
        $(temp).find('label').attr('for', name).text(name);
        $(temp).find('input').attr('name', name);
        $(temp).find('textarea').attr('name', name);
        $(select).attr('name', name).addClass('form-control').appendTo($(temp).find('.choice_container'));
        $(temp).find('.choice').remove();
        $(temp).find('#component_name').remove();
        $(temp).find('.close').remove();
        this.rendered = temp;

    }
    load() {
        $(this.rendered).find('input').val(this.value);
        $(this.rendered).find('textarea').val(this.value);
        return this.rendered;
    }
    draftTo(target) {
        this.draft();
        $(this.drafted).appendTo(target);
        $(this.drafted).find("#component_name").focus();
    }
    draftsetup() {
        var el = this;
        $(this.drafted).find('#component_name').on('change'
            , function () {
                $(this).css("font-weight", "bold");
                $(this).blur();
                el.name = $(this).val();
                el.render($(this).val());
                $(el.drafted).addClass("draft");
                $(el.drafted).attr('data-name', el.name);
                $(el.drafted).attr('data-type', el.type);
                $(el.drafted).attr('data-render', $(el.rendered).prop('outerHTML'));
            }
        );
        $(this.drafted).find('#component_name').on('keydown'
            , function () {
                $(this).css("font-weight", "normal");
            }
        );

    }

}


class Form {
    editor
    rendered
    constructor(name) {
        this.name = name;
    }
    saveEditor(editor) {
        this.editor = $(editor).html();
    }
    save(editor) {
        this.rendered = $(editor).html();
    }
    load() {
        return this.rendered;
    }

    loadEditor() {
        return this.editor;
    }

}




