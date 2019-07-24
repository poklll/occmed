

class Element {
    drafted
    rendered
    choices
    constructor(name, type, value) {
        this.name = name;
        this.type = type;
        this.value = value;
        if (!this.value) {
            this.value = [];
        }
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
                element = `<div class="choice_container"></div>`;
                $(element).appendTo(template);
                this.drafted = template;
                if (!this.choices) {
                    this.addChoice("");
                }
            }
            else
                if (type == "Images") {
                    var gallery = new Gallery();
                    $(gallery.element).appendTo(template);
                    var add = $('<button id="add_image" class="btn btn-dark"></button>').appendTo(template);
                    var fileinput = $('<input type="file" accept="image/*" multiple></input>').appendTo(template).css("display", "none");
                    $(add).css('width', '70%');
                    $(add).html(' <i class="fa fa-upload" aria-hidden="true"></i>');
                    $(add).click(() => {
                        fileinput.click();
                    });
                    $(fileinput).change(() => {
                        var files = $(fileinput).prop("files");
                        var formData = new FormData();
                        $.map(files, file => {
                            formData.append('file', file);
                        });
                        let xhr = new XMLHttpRequest();
                        xhr.open("POST", "/upload");
                        xhr.onload = function () {
                            var files = JSON.parse(xhr.responseText).files;
                            files.forEach(file => {
                                gallery.add(file.path);
                            });
                        }
                        xhr.send(formData);
                    });
                }
                else {
                    element = `<input type="${type}" name="" class="form-control"></input>`;
                    var input = $(element).appendTo(template);
                    if (type == "File") {
                        $(template).find('input').change(() => {
                            var file = $(input).prop("files")[0];
                            var formData = new FormData();
                            formData.append('file', file);
                            let xhr = new XMLHttpRequest();
                            xhr.open("POST", "/upload");
                            xhr.onload = function () {
                                var imgpaths = JSON.parse(xhr.responseText).paths;
                                imgpaths.forEach(imgpath => {
                                    alert(imgpath + " was uploaded");
                                });
                            }
                            xhr.send(formData);
                        });
                    }
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
        $(this.drafted).addClass("draft");
        $(this.drafted).attr('data-name', this.name);
        $(this.drafted).attr('data-type', this.type);
        this.rendered = temp;


    }
    loadTo(target) {
        this.draftTo(target);
        $(this.drafted).find('#component_name').val(this.name).trigger("change");
        if (this.choices) {
            this.choices.map(choice => {
                this.addChoice(choice);
            });
            $(this.addChoice("")).trigger('change');
            this.addChoice("");
        }

    }
    draftTo(target) {
        this.draft();
        $(this.drafted).appendTo(target);
        $(this.drafted).find("#component_name").focus();
        addTabsupport();
        autosize($('.textarea-autosize'));
    }
    draftsetup() {
        var el = this;
        $(this.drafted).find('#component_name').keypress(
            function (e) {
                if (e.which == 13) {
                    $(this).css("font-weight", "bold");
                    $(this).blur();
                    el.name = $(this).val();
                    el.render($(this).val());
                    $(el.drafted).attr('data-render', $(el.rendered).prop('outerHTML'));
                }

            }
        );
        $(this.drafted).find('#component_name').on('change',
            function () {

                $(this).css("font-weight", "bold");
                $(this).blur();
                el.name = $(this).val();
                el.render($(this).val());
                $(el.drafted).attr('data-render', $(el.rendered).prop('outerHTML'));
            }
        );
        $(this.drafted).find('#component_name').on('keydown'
            , function () {
                $(this).css("font-weight", "normal");
                unsave();
            }
        );

    }
    addChoice(choice) {
        var container = $(this.drafted).find(".choice_container");
        const element = `<div class="choice">
        <i class="fa fa-circle" aria-hidden="true"></i><input type="text"  placeholder="add choice"></input>
        </div>
        `;
        var input = $(element).appendTo(container).find('input');
        $(input).focus();
        $(input).on('change', () => {
            let html = $(container).parent().attr('data-render');
            if (html) {
                let temp = document.createElement('div');
                $(html).appendTo(temp);
                if ($(input).val() == "") {
                    if ($(input).parent().children().length > 1) {
                        removeItem(input);
                    }
                }
                else {
                    this.addChoice("");
                }

                $(container).find('.choice > input').each((index, value) => {
                    let choice = $(value).val();
                    if (choice != "") {
                        var option = document.createElement('option');
                        $(option).val(choice);
                        $(option).text(choice);
                        $(temp).find('select').append(option);
                        html = $(temp).html();
                        $(container).parent().attr('data-render-with-choices', html);
                    }
                });
            }
            else {
                alert("กรุณากรอกชื่อหัวข้อ");
                $(container).parent().find('#component_name').focus();
            }
        });
        if (choice != "") {
            $(input).val(choice);
        }

        return input
    }
    create() {
        let type = this.type;
        let element;
        let template = document.createElement('div');
        $(template).addClass('form-group render_item').html(`<label for="${this.name}" class="mb-1">${this.name}</label>`);
        $(template).attr('data-name', this.name);
        $(template).attr('data-type', type);
        if (type == "Long text") {
            element = `<textarea  name="${this.name}" class="form-control textarea-autosize" rows="1"></textarea>`;
            var textarea = $(element).appendTo(template);
            addTabsupport();
            autosize($('.textarea-autosize'));
            $(textarea).val(this.value);
        }
        else
            if (type == "Choices") {
                element = `<select name="${this.name}" class="form-control"></select>`;
                var select = $(element).appendTo(template);
                this.choices.map(choice => {
                    $(`<option value="${choice}">${choice}</option>`).appendTo(select);
                });
                $(select).val(this.value);
            }
            else
                if (type == "Images") {
                    var gallery = new Gallery();
                    var input = $(gallery.element).appendTo(template);
                    if (this.value) {
                        this.value.map(img => {
                            gallery.add(img);
                        });
                    }
                    var el = this;
                    var add = $('<button id="add_image" class="btn btn-dark"></button>').appendTo(template);
                    var fileinput = $('<input type="file" accept="image/*" multiple></input>').appendTo(template).css("display", "none");
                    $(add).css('width', '100%');
                    $(add).html(' <i class="fa fa-upload" aria-hidden="true"></i>');
                    $(add).click(() => {
                        fileinput.click();
                    });
                    $(fileinput).change(() => {
                        var files = $(fileinput).prop("files");
                        var formData = new FormData();
                        $.map(files, file => {
                            formData.append('file', file);
                        });
                        let xhr = new XMLHttpRequest();
                        xhr.open("POST", "/upload");
                        xhr.onload = function () {
                            var imgpaths = JSON.parse(xhr.responseText).files;
                            imgpaths.forEach(img => {
                                gallery.add(img.path);
                                el.value.push(img.path);
                                $(input).attr('data-value', JSON.stringify({ value: el.value }));
                            });
                        }
                        xhr.send(formData);
                    });

                }
                else {
                    element = `<input type="${this.type}" name="${this.name}" class="form-control"></input>`;
                    var input = $(element).appendTo(template);
                    var el = this;
                    if (type == "File") {
                        if (this.value) {
                            this.value.map(file => {
                                $(`<a href="${file.path}">${file.name}</a>${file.date}<hr>`).appendTo(template);
                            })
                        }
                        $(template).find('input').change(() => {
                            var file = $(input).prop("files")[0];
                            var formData = new FormData();
                            formData.append('file', file);
                            let xhr = new XMLHttpRequest();
                            xhr.open("POST", "/upload");
                            xhr.onload = function () {
                                var files = JSON.parse(xhr.responseText).files;
                                files.forEach(file => {
                                    alert(file.name + " was uploaded");
                                    $(`<a href="${file.path}">${file.name}</a><p>${file.date}</p><hr>`).appendTo(template);
                                    var val = { name: file.name, path: file.path, date: file.date };
                                    el.value.push(val);
                                    $(input).attr('data-value', JSON.stringify({ value: el.value }));

                                });
                            }
                            xhr.send(formData);
                        });

                    }
                    else {
                        $(input).val(this.value);
                    }
                }
        return template;

    }

    createTo(target) {
        $(this.create()).appendTo(target);
        addTabsupport();
        autosize($('.textarea-autosize'));
    }

}


class Form {
    components = [];
    constructor(name) {
        this.name = name;
    }
    saveEditor(editor) {
        $(editor).find('.draft').each((index, value) => {
            let html;
            let choices = $(value).attr("data-render-with-choices");
            let name = $(value).attr("data-name");
            let type = $(value).attr("data-type");
            let choice = [];
            if (choices) {
                html = choices;
            }
            else {
                html = $(value).attr("data-render");
            }

            var element = $(html).appendTo('#render_container');
            $(element).find('option').each((index, value) => {
                choice.push($(value).val());
            });
            // $(element).remove();
            this.components.push({ name: name, type: type, choices: choice, value: "" });
        }
        );
    }
    save(editor) {
        this.components = [];
        $(editor).find('.render_item').each((index, value) => {
            let name = $(value).attr("data-name");
            let type = $(value).attr("data-type");
            let tag;
            let choices = [];
            if (type == "Long text") {
                tag = 'textarea';
            }
            else if (type == "Choices") {
                tag = 'select';
            }
            else {
                tag = 'input';
            }
            let val
            if (type == "File") {
                if ($(value).find(tag).attr("data-value")) {
                    val = JSON.parse($(value).find(tag).attr("data-value"));
                }
            }
            else if (type == "Images") {
                if ($(value).find('.gallery').attr("data-value")) {
                    val = JSON.parse($(value).find('.gallery').attr("data-value"));
                }
            }
            else {
                val = $(value).find(tag).val();
            }
            $(value).find('option').each((index, value) => {
                if (value) {
                    choices.push($(value).val());
                }
            });
            this.components.push({ name: name, type: type, choices: choices, value: val });
        }
        );
    }
    load(editor) {
        this.components.map(element => {
            var component = new Element(element.name, element.type, element.value);
            if (element.choices) {
                component.choices = element.choices;
            }
            component.createTo(editor);
        });
    }
    loadEditor(editor) {
        this.components.map(element => {
            var component = new Element(element.name, element.type);
            if (element.choices) {
                component.choices = element.choices;
            }
            component.loadTo(editor);
        });
    }

}


