

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
        $(template).addClass('form-group editor_item').html(`<label for="" class="mb-1"></label>
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

    addinstructor(el) {
        var instructor = $(el).children('option:selected').val();
        alert(instructor);
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
                                gallery.add(image, file.name);
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
                        $(del).click(() => {
                            $(del).parent().remove();
                        });
                    }
                    else
                        if (type == 'Instructor') {
                            element = `<select class="from-control" onfocus="this.selectedIndex = -1;"></select>`;
                            var select = $(element).appendTo(template);
                            var container = $('<div></div>').appendTo(template);
                            let xhr = new XMLHttpRequest();
                            var el = this;
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
                                if (!el.value.includes(id)) {
                                    el.value.push(id);
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
                                    $(select).attr('data-value', JSON.stringify(el.value));
                                }
                                else {
                                    alert("อาจารย์ท่านนี้ถูกเลือกแล้ว");
                                }
                            });

                        }
                        else
                            if (type == "date") {
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
                                    var filename = $('<p></p>').appendTo(template);
                                    var progressbar = `<div class="progress">
                                    <div id="progressbar" class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100" style="width: 0%"></div>
                                    </div>`;
                                    progressbar = $(progressbar).appendTo(template).hide();
                                    if (this.value) {
                                        this.value.map(file => {
                                            var div = $(`<div></div>`).appendTo(template);
                                            var item = $(`<a class="filelink" href="${file.path}">${file.name}</a>`).appendTo(div);
                                            $("<hr>").insertAfter(item);
                                            var del = `<button type="button" class="close" aria-label="Close">
                                            <span aria-hidden="true">&times;</span></button>`;
                                            del = $(del).insertAfter(item);
                                            $(del).click(() => {
                                                event.stopPropagation();
                                                var path = file.path;
                                                var xhr = new XMLHttpRequest();
                                                xhr.open("DELETE", path);
                                                xhr.onload = function () {
                                                    console.log(xhr.responseText);
                                                    $(del).parent().remove();
                                                };
                                                xhr.send();
                                            });
                                        })

                                    }
                                    $(input).change(() => {
                                        $(filename).html("");
                                        var files = $(input).prop('files');
                                        $.map(files, file => {
                                            $(filename).html($(filename).html() + file.name + `<br>`);
                                        });
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
        addTabsupport();
        autosize($('.textarea-autosize'));
        return element;
    }

}


class Form {
    components = [];
    extensions = [];
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
        this.components = [];
        this.extensions = [];
        $(editor).children('.render_item').each((index, value) => {
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
                val = [];
                $(value).find(".filelink").each((index, value) => {
                    if ($(value).attr('href')) {
                        val.push({ name: $(value).text(), path: $(value).attr('href') });
                    }
                });
                var fileinput = $(value).find('input')[0];
                var files = $(fileinput).prop("files");
                if (files.length > 0) {
                    var formData = new FormData();
                    $.map(files, file => {
                        formData.append('file', file);
                    });
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
                        var files = await JSON.parse(xhr.responseText).files;
                        files.forEach(file => {
                            val.push({ name: file.name, path: file.path });
                            var div = $(`<div></div>`).appendTo(value);
                            var item = $(`<a class="filelink" href="${file.path}">${file.name}</a>`).appendTo(div);
                            $("<hr>").insertAfter(item);
                            var del = `<button type="button" class="close" aria-label="Close">
                                <span aria-hidden="true">&times;</span></button>`;
                            del = $(del).insertAfter(item);
                            $(del).click(() => {
                                event.stopPropagation();
                                var path = file.path;
                                var xhr = new XMLHttpRequest();
                                xhr.open("DELETE", path);
                                xhr.onload = function () {
                                    console.log(xhr.responseText);
                                    $(del).parent().remove();
                                };
                                xhr.send();
                            });
                            $(fileinput).val('').trigger('change');

                        });
                    }
                    xhr.send(formData);
                }
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
            this.components.push({ name: name, type: type, choices: choices, value: val });
        }
        );
        $(editor).children('.extension').each(async(index,value)=>{
            var extension = new Form($(value).attr('data-name'));
            extension.save($(value).find('.element_container')[0]);
            this.extensions.push({name: extension.name , components: extension.components});
        });
    }
    loadExtension(editor) {
        var element = new Element(this.name, 'Extension');
        var el = element.createTo(editor);
        var container = $(el).children('.element_container');
        this.load(container);
    }
    loadExtensionEditor(editor) {
        var element = new Element(this.name, 'Extension');
        element.loadTo(editor);
        var container = $(element.drafted).children('.element_container');
        this.loadEditor(container);
    }
    load(editor) {
        this.components.map(element => {
            var component = new Element(element.name, element.type, element.value);
            if (element.choices) {
                component.choices = element.choices;
            }
            component.createTo(editor);
        });
        this.extensions.map(extension => {
            var ext = new Form(extension.name);
            ext.components = extension.components;
            ext.loadExtension(editor);
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
        this.extensions.map(extension => {
            var ext = new Form(extension.name);
            ext.components = extension.components;
            ext.loadExtensionEditor(editor);
        });
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