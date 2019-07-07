

class Element {
    draft
    rendered
    saved
    constructor(name, type, value) {
        this.name = name;
        this.type = type;
        this.value = value;
    }
    createprototype() {
        let type = this.type;
        let element;
        if (type == "Long text") {
            element = `<div class="form-group component_item" id="">
            <label for="" class="mb-1"></label>
            <button type="button" class="close" aria-label="Close" onclick="removeItem(this)">
            <span aria-hidden="true">&times;</span>
            </button>
            <input type="text" id="component_name" class="form-control component_name" placeholder="Enter field name"></input>
            <textarea  name="" class="form-control textarea-autosize" rows="1"></textarea>
            </div>`;

        } 
        else 
            if (type == "Choices") {
                element = `<div class="form-group component_item" id="">
            <label for="" class="mb-1"></label>
            <button type="button" class="close" aria-label="Close" onclick="removeItem(this)">
            <span aria-hidden="true">&times;</span>
            </button>
            <input type="text" id="component_name" class="form-control component_name" placeholder="Enter field name"></input>
            <div class="choice_container">
            <div class="choice">
            <i class="fa fa-circle" aria-hidden="true"></i><input type="text" placeholder="add choice" onchange="choiceInput(this)"></input>
            </div>
            </div>
          
            </div>`;
            }
            else {
            element = `<div class="form-group component_item" id="">
            <label for="" class="mb-1"></label>
            <button type="button" class="close" aria-label="Close" onclick="removeItem(this)">
            <span aria-hidden="true">&times;</span>
            </button>
            <input type="text" id="component_name" class="form-control component_name" placeholder="Enter field name"></input>
            <input type="${type}" name="" class="form-control"></input>
            </div>`;
            }
        this.draft = element;
        return element;
    }

    render(name) {
        let item = $(this.draft);
        let temp = document.createElement('div');
        let select = document.createElement('select');
        $(item).appendTo(temp);
        $(temp).find(".component_item").attr("id", name);
        $(temp).find(".component_item").addClass("render_item");
        $(temp).find(".component_item").removeClass("component_item");
        $(temp).find('label').attr('for', name);
        $(temp).find('label').text(name);
        $(temp).find('input').attr('name', name);
        $(temp).find('textarea').attr('name', name);
        $(select).attr('name',name);
        $(select).addClass('form-control');
        $(select).appendTo($(temp).find('.choice_container'));
        $(temp).find('.choice').remove();
        $(temp).find('#component_name').remove();
        $(temp).find('.close').remove();
        this.rendered = $(temp).html();

    }
    load() {
        let temp = document.createElement('div');
        $(this.rendered).appendTo(temp);
        $(temp).find('input').val(this.value);
        $(temp).find('textarea').val(this.value);
        return $(temp).html();
    }
    draftTo(target) {
        this.createprototype();
        el = this;
        let temp = document.createElement('div');
        $(this.draft).appendTo(temp);
        $(temp).find('#component_name').on('change'
            , function () {
                    $(this).css("font-weight", "bold");
                    $(this).blur();
                    el.name = $(this).val();
                    el.render($(this).val());
                    $(temp).addClass("draft");
                    $(temp).attr('data-name', el.name);
                    $(temp).attr('data-type', el.type);
                    $(temp).attr('data-render', el.rendered);
            }
        );
        $(temp).find('#component_name').on('keydown'
            , function () {
                $(this).css("font-weight", "normal");
            }
        );
        $(temp).appendTo(target);
        $(temp).find("#component_name").focus();

    }
    addTo(target){
        el = this;
        let temp = document.createElement('div');
        $(this.rendered).appendTo(temp);
        $(temp).find('form-control').on('change'
        , function () {
        
                $(this).css("font-weight", "bold");
                $(this).blur();
                el.name = $(this).val();
                el.render($(this).val());
                $(temp).addClass("draft");
                $(temp).attr('data-name', el.name);
                $(temp).attr('data-type', el.type);

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
        $(editor).find(".draft").each((index, value) => {
            this.editor = [];
            let name = $(value).attr('data-name');
            let type = $(value).attr('data-type');
            let el = new Element(name,type);
            el.createprototype();

        });
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




