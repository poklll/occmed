class Element {
    view
    drafted
    rendered
    choices
    comment

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
        $(template).addClass('form-group editor_item').html(`<label for="" class="mb-1"></label>
      <button type="button" class="close" aria-label="Close" onclick="removeItem(this)"><span aria-hidden="true">&times;</span></button>
      <input type="text" id="component_name" class="form-control component_name" placeholder="Enter field name"></input>`);
        if (type == "Long text") {
            element = `<div class="quill"></div>`;
            $(element).appendTo(template);
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
                            var files = JSON.parse(xhr.responseText).files;
                            files.forEach(file => {
                                gallery.add(file.path);
                            });
                        }
                        xhr.send(formData);
                    });
                }
                else
                    if (type == "Extension") {
                        $(template).removeClass('editor_item').addClass('extension');
                        $(template).find('#component_name').attr('placeholder', 'Enter extension name');
                        $('<h1>Extension</h1>').prependTo(template);
                        element = `<div class="element_container" onclick="selectEditor(this)"></div>`;
                        $(element).appendTo(template);
                    }
                    else if (type == "Instructor") {
                        element = `<select class="from-control" onfocus="this.selectedIndex = -1;"></select>`;
                        var select = $(element).appendTo(template);
                        var container = $('<div></div>').appendTo(template);
                        let xhr = new XMLHttpRequest();
                        xhr.open("GET", "/instructor");
                        xhr.onload = function () {
                            var instructors = JSON.parse(xhr.responseText);
                            instructors.map(instructor => {
                                var option = document.createElement('option');
                                $(option).val(instructor._id);
                                $(option).text(instructor.firstname);
                                $(option).appendTo(select);
                                $(template).find('#component_name').val('อาจารย์ที่ปรึกษา').trigger("change");
                            });
                        }
                        xhr.send();
                        $(select).on("change", function () {
                            var val = $(this).children('option:selected').text();
                            var id = $(this).children('option:selected').val();
                            var item = `<div class="instructor"><h2>${val}</h2>  
                             <button type="button" class="close" aria-label="Close" onclick="removeItem(this)"><span aria-hidden="true">&times;</span></button>
                             </div>`;
                            $(item).appendTo(container);
                        });
                    }
                    else
                        if (type == "Date") {
                            element = `<input type="text" name="" class="form-control"></input>`;
                            var input = $(element).appendTo(template);
                            $(input).datepicker();
                            $(input).datepicker("option", "dateFormat", "dd/mm/yy");
                        }
                        else {
                            element = `<input type="${type}" name="" class="form-control"></input>`;
                            var input = $(element).appendTo(template);
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
        $(temp).removeClass("editor_item");
        $(temp).find('label').attr('for', name).text(name);
        $(temp).find('input').attr('name', name);
        $(temp).find('textarea').attr('name', name);
        $(select).attr('name', name).addClass('form-control').appendTo($(temp).find('.choice_container'));
        $(temp).find('.choice').remove();
        $(temp).find('#component_name').remove();
        $(temp).find('.close').remove();
        if (this.type != 'Extension') {
            $(this.drafted).addClass("draft");
        }
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
        if (($(target).children('.extension').length > 0) && (this.type != 'Extension')) {
            $(this.drafted).insertBefore($(target).children('.extension').first());
        }
        else {
            $(this.drafted).appendTo(target);
        }
        $(this.drafted).find("#component_name").focus();
        var quill = $(this.drafted).find('.quill').get(0);
        this.quill = this.quillsetup(quill);
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

    addComment() {
        var comment = $(`<div class="comment"></div>`).appendTo(this.view);
        var quill = $(`<div class="quill"></div>`).appendTo(comment);
        var file = $(`<input type="file">`).appendTo(comment);
        quill = this.quillsetup($(comment).find('.quill').get(0));
    }
    quillsetup(el) {
        var toolbarOptions = [
            ["bold", "italic", "underline", "strike"], // toggled buttons
            [{ header: 1 }, { header: 2 }], // custom button values
            [{ list: "ordered" }, { list: "bullet" }],
            [{ script: "sub" }, { script: "super" }], // superscript/subscript
            [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
            [{ direction: "rtl" }], // text direction
            [{ size: ["small", false, "large", "huge"] }], // custom dropdown
            [{ color: [] }, { background: [] }], // dropdown with defaults from theme
            [{ align: [] }],
            ["clean"] // remove formatting button
        ];
        var options = {
            debug: "info",
            modules: {
                toolbar: toolbarOptions
            },
            placeholder: "กรอกข้อความที่นี่...",
            readOnly: false,
            theme: "snow"
        };
        var editor = new Quill(el, options);
        return editor;
    }
    create() {
        let type = this.type;
        let element;
        let template = document.createElement('div');
        $(template).addClass('form-group render_item').html(`<label for="${this.name}" class="mb-1">${this.name}</label>`);
        $(template).attr('data-name', this.name);
        $(template).attr('data-type', type);
        if (type == "Long text") {
            element = `<div class="quill"></div>`;
            var textarea = $(element).appendTo(template);
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
                    var progressbar = `<div class="progress">
                    <div id="progressbar" class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100" style="width: 0%"></div>
                    </div>`;
                    progressbar = $(progressbar).appendTo(template);
                    $(progressbar).hide();
                    $(add).css('width', '100%');
                    $(add).html(' <i class="fa fa-upload" aria-hidden="true"></i>');
                    $(add).click(() => {
                        fileinput.click();
                    });
                    $(fileinput).change(() => {
                        var files = $(fileinput).prop("files");
                        $.map(files, file => {
                            var reader = new FileReader();
                            reader.onload = function () {
                                var image = reader.result;
                                gallery.add({ image: image, path: image, driveid: '', filename: file, name });
                            }
                            if (file) {
                                reader.readAsDataURL(file);
                            } else {
                                alert("no file");
                            }
                        });
                    });
                }
                else
                    if (type == "Extension") {
                        $(template).removeClass('render_item').addClass('extension');
                        var del = `<button type="button" class="close" aria-label="Close">
                            <span aria-hidden="true">&times;</span></button>`;
                        element = `<div class="element_container"></div>`;
                        del = $(del).appendTo(template);
                        $(element).appendTo(template);
                    }
                    else
                        if (type == 'Instructor') {
                            element = `<select class="from-control" onfocus="this.selectedIndex = -1;"></select>`;
                            var select = $(element).appendTo(template);
                            var container = $('<div></div>').appendTo(template);
                            let xhr = new XMLHttpRequest();
                            var el = this;
                            $(select).attr('data-value', JSON.stringify(el.value));
                            var addVal = (id, val) => {
                                var item = `<div class="instructor"><h2>${val}</h2></div>`;
                                var instructor = $(item).appendTo(container);
                                var button = `<button type="button" class="close" aria-label="Close"><span aria-hidden="true">&times;</span></button>`;
                                var del = $(button).appendTo(instructor);
                                $(del).click(() => {
                                    $(instructor).remove();
                                    el.value = el.value.filter(val => {
                                        return val != id;
                                    });
                                    $(select).attr('data-value', JSON.stringify(el.value));
                                });
                            };
                            $(select).on("change", function () {
                                var val = $(this).children('option:selected').text();
                                var id = $(this).children('option:selected').val();
                                if (!el.value.includes(id)) {
                                    el.value.push(id);
                                    addVal(id, val);
                                    $(select).attr('data-value', JSON.stringify(el.value));
                                }
                                else {
                                    alert("อาจารย์ท่านนี้ถูกเลือกแล้ว");
                                }
                            });
                            xhr.open("GET", "/instructor");
                            xhr.onload = function () {
                                var instructors = JSON.parse(xhr.responseText);
                                instructors.map(instructor => {
                                    var option = document.createElement('option');
                                    $(option).val(instructor._id);
                                    $(option).text(instructor.firstname);
                                    $(option).appendTo(select);
                                    $(template).find('#component_name').val('อาจารย์ที่ปรึกษา').trigger("change");
                                });
                                for (var id of el.value) {
                                    var val = $(select).find(`option[value=${id}]`).text();
                                    addVal(id, val);
                                }
                            }
                            xhr.send();

                        }
                        else
                            if (type == "Date") {
                                element = `<input type="text" name="" class="form-control"></input>`;
                                var input = $(element).appendTo(template);
                                $(input).datepicker();
                                $(input).datepicker("option", "dateFormat", "dd/mm/yy");
                                $(input).val(this.value);
                            }
                            else {
                                var el = this;
                                if (type == "File") {
                                    element = `<input type="${this.type}" name="${this.name}" class="form-control" multiple></input>`;
                                    var input = $(element).appendTo(template);
                                    var previewGallery = new Gallery();
                                    var preview = $('<div>Preview</div>').appendTo(template);
                                    var fileList = $('<div></div>').appendTo(preview);
                                    $(preview).hide();
                                    $(previewGallery.element).addClass('preview').appendTo(preview);
                                    var gallery = new Gallery();
                                    this.gallery = gallery;
                                    $(gallery.element).appendTo(template);
                                    gallery.hide();
                                    var progressbar = `<div class="progress">
                                    <div id="progressbar" class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100" style="width: 0%"></div>
                                    </div>`;
                                    progressbar = $(progressbar).appendTo(template).hide();
                                    if (this.value) {
                                        this.value.map(file => {
                                            if (file.filetype.includes("image")) {
                                                gallery.show()
                                                gallery.add(file);
                                            }
                                            else {
                                                var div = $(`<div></div>`).appendTo(template);
                                                var item = $(`<a class="filelink" data-file="${encodeURIComponent(JSON.stringify(file))}"  href="${file.path}">${file.filename}</a>`).appendTo(div);
                                                $("<hr>").insertAfter(item);
                                                var del = `<button type="button" class="close" aria-label="Close">
                                                <span aria-hidden="true">&times;</span></button>`;
                                                del = $(del).insertAfter(item);
                                                $(del).click(() => {
                                                    event.stopPropagation();
                                                    var driveid = file.driveid;
                                                    var xhr = new XMLHttpRequest();
                                                    xhr.open("DELETE", `/file/${driveid}`);
                                                    xhr.onload = function () {
                                                        console.log(xhr.responseText);
                                                        $(del).parent().remove();
                                                    };
                                                    xhr.send();
                                                });
                                            }

                                        })

                                    }
                                    $(input).change(() => {
                                        previewGallery.empty();
                                        $(fileList).empty();
                                        $(preview).hide();
                                        var files = $(input).prop('files');
                                        if (files.length > 0) {
                                            $(preview).show();                                        
                                            $.map(files, file => {
                                                if (file.type.includes("image")) {
                                                    var reader = new FileReader();
                                                    reader.onload = function () {
                                                        var image = reader.result;
                                                        previewGallery.add({ image: image, path: image, driveid: '', filename: file.name });
                                                    }
                                                    if (file) {
                                                        reader.readAsDataURL(file);
                                                    } else {
                                                        alert("no file");
                                                    }
                                                }
                                                else{
                                                    $(fileList).append(`<li>${file.name}</li><br>`);
                                                }
                                            });
                                        }
                                    });
                                }
                                else {
                                    element = `<input type="${this.type}" name="${this.name}" class="form-control"></input>`;
                                    var input = $(element).appendTo(template);
                                    $(input).val(this.value);
                                }
                            }
        return template;

    }
    createTo(target) {
        var element = $(this.create()).appendTo(target);
        if (this.type == "Long text") {
            this.quill = this.quillsetup($(element).find('.quill').get(0));
            this.quill.setContents(this.value);
        }
        this.view = element;
        return element;
    }

    async save() {
        let thisElement = this;
        let name = this.name;
        let type = this.type;
        let tag;
        let choices = [];
        let value = this.view;
        if (type == "Choices") {
            tag = 'select';
        }
        else {
            tag = 'input';
        }
        let val
        if (type == "Long text") {
            var quill = this.quill;
            val = quill.getContents();
        }
        else
            if (type == "File") {
                val = await new Promise(resolve => {
                    var vals = [];
                    var fileinput = $(value).find('input')[0];
                    var files = $(fileinput).prop("files");
                    if (files.length > 0) {
                        var formData = new FormData();
                        for (let index = 0; index < files.length; index++) {
                            const file = files[index];
                            var user = JSON.parse($('.Form').attr('data-user'));
                            var time = moment().format("YYYYMMDD-HHmm");
                            var version = parseInt($('.Form').attr('data-version'));
                            var filename = `${user.firstname.substr(0, 4)}_${user.lastname.substr(0, 4)}_${time}_v${version + 1}_${index + 1}`;
                            formData.append('file', file, filename);
                        }
                        let xhr = new XMLHttpRequest();
                        xhr.open("POST", "/upload");
                        $(value).find('.progress').show();
                        xhr.upload.onprogress = function (e) {
                            var percentComplete = Math.ceil((e.loaded / e.total) * 100);
                            $(value).find("#progressbar").css("width", percentComplete + "%");
                            if (percentComplete == 100) {
                                setTimeout(() => {
                                    $(value).find("#progressbar").css("width", "0%");
                                    $(value).find(".progress").hide();
                                }, 500);
                            };
                        };
                        xhr.onload = async function () {
                            var files = await JSON.parse(xhr.responseText);
                            files.forEach(file => {
                                vals.push(file);
                                if (file.filetype.includes("image")) {
                                    thisElement.gallery.show();
                                    thisElement.gallery.add(file);
                                }
                                else {
                                    var div = $(`<div></div>`).appendTo(value);
                                    var item = $(`<a class="filelink" href="${file.path}">${file.filename}</a>`).appendTo(div);
                                    $("<hr>").insertAfter(item);
                                    var del = `<button type="button" class="close" aria-label="Close">
                                <span aria-hidden="true">&times;</span></button>`;
                                    del = $(del).insertAfter(item);
                                    $(del).click(() => {
                                        event.stopPropagation();
                                        var driveid = file.driveid;
                                        var xhr = new XMLHttpRequest();
                                        xhr.open("DELETE", `/file/${driveid}`);
                                        xhr.onload = function () {
                                            console.log(xhr.responseText);
                                            $(del).parent().remove();
                                        };
                                        xhr.send();
                                    });
                                }
                                $(fileinput).val('').change();
                                resolve(vals);
                            });

                        }
                        xhr.send(formData);
                    } else {
                        resolve(vals);
                    }
                })
            }
            else if (type == "Images") {
                val = [];
                var files = [];
                $(value).find('img').each((index, value) => {

                    if ($(value).attr('data-name') != "undefined") {
                        files.push({ name: $(value).attr('data-name'), path: $(value).attr('src'), img: value });
                    }
                    else {
                        val.push($(value).attr('src'));
                    }

                });
                var formData = new FormData();
                if (files.length > 0) {
                    $.map(files, file => {
                        formData.append('file', dataURItoBlob(file.path), file.name);
                    });
                    let xhr = new XMLHttpRequest();
                    xhr.open("POST", "/upload", true);
                    $(value).find('.progress').show();
                    xhr.upload.onprogress = function (e) {
                        var percentComplete = Math.ceil((e.loaded / e.total) * 100);
                        $(value).find("#progressbar").css("width", percentComplete + "%");
                        if (percentComplete == 100) {
                            setTimeout(() => {
                                $(value).find("#progressbar").css("width", "0%");
                                $(value).find(".progress").hide();
                            }, 500);
                        };
                    };
                    xhr.onload = async function () {
                        var imgpaths = await JSON.parse(xhr.responseText).files;
                        imgpaths.forEach((img, index) => {
                            val.push(img.path);
                            $(files[index].img).attr('src', img.path);
                            $(files[index].img).attr('data-name', "undefined");
                            setTimeout(() => {
                                $(files[index].img).css('opacity', '0.5');
                            }, 200 * (index + 1));
                            setTimeout(() => {
                                $(files[index].img).css('opacity', '1');
                            }, 300 * (index + 1));
                        });
                    }
                    xhr.send(formData);
                }

            }
            else if (type == "Instructor") {
                if ($(value).find('select').attr("data-value")) {
                    val = JSON.parse($(value).find('select').attr("data-value"));
                }
            } else {
                val = $(value).find(tag).val();
            }
        $(value).find('option').each((index, value) => {
            if (value) {
                choices.push($(value).val());
            }
        });
        let component = { name: name, type: type, choices: choices, value: val };
        return component;
    }
}


class Form {
    container;
    components = [];
    elements = [];
    extensions = [];
    extensionForm = [];
    constructor(name) {
        this.name = name;
    }
    saveEditor(editor) {
        let htmls = [];
        $(editor).children('.draft').each((index, value) => {
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
            htmls.push(html);
            var temp = document.createElement('div');
            var element = $(html).appendTo(temp);
            $(element).find('option').each((index, value) => {
                choice.push($(value).val());
            });
            // $(element).remove();
            this.components.push({ name: name, type: type, choices: choice, value: "" });
        }
        );
        $(editor).children('.extension').each((index, value) => {
            var extension = new Form($(value).attr('data-name'));
            var container = $(value).children('.element_container');
            var html = extension.saveEditor(container);
            var temp = document.createElement('div');
            var div = $(`<div class="element_container"><h1>${extension.name}</h1></div>`).appendTo(temp);
            $(div).append(html);
            htmls.push($(temp).html());
            this.extensions.push({ name: extension.name, components: extension.components });
        });
        return htmls;

    }
    saveEditorTo(editor, target) {
        this.saveEditor(editor).map(html => {
            $(html).appendTo(target);
        });
    }
    save(editor) {
        var thisForm = this;
        var saveComponents = new Promise(async function (resolve) {
            var components = [];
            for (var [index, value] of $(editor).children('.render_item').toArray().entries()) {
                let component = await thisForm.elements[index].save();
                components.push(component);
            }
            resolve(components);
        });
        var saveExtension = new Promise(async function (resolve) {
            var extensions = [];
            for (var [index, value] of thisForm.extensionForm.entries()) {
                var extension = value;
                extension.name = $(extension.element).attr('data-name');
                extension = await extension.components.save(extension.container);
                extensions.push({ name: extension.name, components: extension.components });
            }
            resolve(extensions);
        });
        return new Promise(resolve => {
            Promise.all([saveComponents, saveExtension]).then(values => {
                thisForm.components = values[0];
                thisForm.extensions = values[1];
                thisForm.extensionForm = [];
                resolve(thisForm);
            });
        });
    }
    loadExtension(editor) {
        var element = new Element(this.name, 'Extension');
        var el = element.createTo(editor);
        var container = $(el).children('.element_container');
        this.load(container);
        return { components: this, element: el, container: container };
    }
    loadExtensionEditor(editor) {
        var element = new Element(this.name, 'Extension');
        element.loadTo(editor);
        var container = $(element.drafted).children('.element_container');
        this.loadEditor(container);
    }
    load(editor) {
        var form = this;
        this.container = editor;
        this.components.map(element => {
            var component = new Element(element.name, element.type, element.value);
            if (element.choices) {
                component.choices = element.choices;
            }
            component.createTo(editor);
            form.elements.push(component);
        });
        if (this.extensions.length > 0) {
            this.extensions.map(extension => {
                var ext = new Form(extension.name);
                ext.components = extension.components;
                ext = ext.loadExtension(editor);
                var extensions = form.extensionForm;
                if (extensions.length > 0) {
                    ext.index = form.extensionForm[extensions.length - 1].index + 1;
                } else {
                    ext.index = 0;
                }
                form.extensionForm.push(ext);
                $(ext.element).find('.close').click(() => {
                    $(ext.element).remove();
                    var index = form.extensionForm.findIndex(x => x.index === ext.index);
                    form.extensionForm.splice(index, 1);
                });
            });
        }
    }
    loadEditor(editor) {
        this.components.map(element => {
            var component = new Element(element.name, element.type);
            if (element.choices) {
                component.choices = element.choices;
            }
            component.loadTo(editor);
        });
        this.extensions.map(extension => {
            var ext = new Form(extension.name);
            ext.components = extension.components;
            ext.loadExtensionEditor(editor);
        });
    }
    activateCommentingMode() {
        $(this.container).find("input,select").prop("disabled", true);
        $(this.container).find(".ql-editor").attr("contenteditable", false);
        $(this.container).find(".ql-toolbar").hide();
        $('.extension-panel').hide();
        for (let index = 0; index < this.elements.length; index++) {
            const element = this.elements[index];
            $(element.view).click(function () {
                if ($(element.view).find('.comment').toArray().length == 0) {
                    element.addComment();
                }
            });
        }
    }
}


function dataURItoBlob(dataURI) {
    // convert base64/URLEncoded data component to raw binary data held in a string
    var byteString;
    if (dataURI.split(',')[0].indexOf('base64') >= 0)
        byteString = atob(dataURI.split(',')[1]);
    else
        byteString = unescape(dataURI.split(',')[1]);

    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    // write the bytes of the string to a typed array
    var ia = new Uint8Array(byteString.length);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ia], { type: mimeString });
}
