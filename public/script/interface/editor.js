let currentForm = new Form();
let currentEditor = '';
$(() => {
    $(window).resize(function () {
        $('#result-list').width($('#group-search').width());
    });
    currentEditor = $('#editor_container');
    var formdata = $("#elements").attr('data-elements');
    if (formdata) {
        showeditor();
        var form = JSON.parse(formdata);
        console.log($("#elements").attr('data-elements'));
        currentForm.components = form.components;
        currentForm.extensions = form.extensions;
        currentForm.loadEditor('#editor_container');
        $('#render_container').hide();
        $(window).scrollTop(0);
        $('.nav-item').show();
    }
    else {
        showlist();
    }
    $('.nav-item').click(async function () {
        try {
            $('.nav-item').removeClass('active');
            $(this).addClass('active');
        }
        catch (err) { console.log(err); }
    });

    $('#form-search').keyup(() => {
        var val = $('#form-search').val().toLowerCase();
        if (val == "") {
            $('.form-list').find('.list-item').show();
        }
        else {
            $('.form-list').find('.list-item').each((index, value) => {
                var form = $(value).find('a');
                if ($(form).text().toLowerCase().startsWith(val)) {
                    $(value).show();
                }
                else {
                    $(value).hide();
                }
            });
        }
    });

    $('#group-search').on('keyup', () => {

        var val = $('#group-search').val().toLowerCase();
        if (val == "") {
            $("#result-list").hide();
            $("#group-list").hide();
            $("#group-list").find("tbody").empty();
            $('#users').find('.list-item').show();
        }
        else {
            var found = false;
            $('#users').find('.list-item').each((index, value) => {
                var form = $(value).find('p');
                if ($(form).text().toLowerCase().startsWith(val)) {
                    $(value).show();
                    found = true;
                }
                else {
                    $(value).hide();
                }
            }
            );
            if (!found) {
                var xhr = new XMLHttpRequest();
                xhr.open("GET", `/search/?keyword=${val}`);
                xhr.onload = () => {
                    $("#user-list").find("tbody").empty();
                    $("#group-list").find("tbody").empty();
                    var results = JSON.parse(xhr.responseText);
                    $("#result-list").show();
                    if (results.groups.length > 0) {
                        results.groups.forEach(result => {
                            var list = $("#group-list").find("tbody");
                            var item = $(
                                `<tr>
                            <td>${result.name}</td>
                            <td></td>
                            <td></td>
                            </tr>`
                            ).appendTo(list);
                            $(item).click(() => {
                                addgroup(result, false);
                            });
                        });
                        $("#group-list").show();
                    }
                    else {
                        $("#group-list").hide();
                    }
                };
                xhr.send();
            }
        }

    });
    $('#users').find('input').each((index, value) => {
        var enabled = $(value).attr('data-enabled');
        if (enabled == "true") {
            $(value).prop('checked', true);
        } else {
            $(value).prop('checked', false);
        }
    });

}
)

function newForm() {
    $('.form-list').hide();
    showeditor();
    $('#render_container').hide();
}

function deleteform(name) {
    let xhr = new XMLHttpRequest();
    xhr.open("DELETE", "/form/" + name);
    xhr.onload = function () {
        window.location.href = "/form_editor";
    }
    xhr.send();
}


async function selectEditor(el) {
    event.stopPropagation();
    currentEditor = $(el);
    await $('.selected').removeClass('selected');
    $(el).addClass('selected');
}


function preview(el) {
    let text = $(el).text();
    if (text == "Preview") {
        $('#editor_container').hide();
        $('#render_container').show();
        $('#add_button').hide();
        currentForm.components = [];
        currentForm.extensions = [];
        currentForm.saveEditorTo('#editor_container', '#render_container');
        $('.element_container').css('border', '0');
        $('#form').val(JSON.stringify({ components: currentForm.components, extensions: currentForm.extensions }));
        $("#status").attr('class', 'badge badge-success');
        $("#status").text("SAVED");
        text = "Editor";
    }
    else {
        $('#editor_container').show();
        $('.element_container').css('border', '0.5px dashed black');
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

function save() {
    currentForm.components = [];
    currentForm.extensions = [];
    currentForm.saveEditor('#editor_container');
    $('#render_container').empty();
    $('#form').val(JSON.stringify({ components: currentForm.components, extensions: currentForm.extensions }));
    $("#status").attr('class', 'badge badge-success');
    $("#status").text("SAVED");
}



function addItem(type) {
    var el = new Element();
    el.type = type;
    el.draftTo(currentEditor);
}

function addgroup(group, io) {
    $('#result-list').hide();
    $('#users').find('.list-item').show();
    $('#group-search').val("");
    var item = $(`
    <div class="list-item list-group-item list-group-item-action group" >
    <div style="display: flex; justify-content: center; align-items: center;">
        <i style="margin-right: 20px; display: none;" class="fa fa-times" aria-hidden="true"></i>
        <p>${group.name}</p>
    </div>
    <div style="display: flex; align-items: center">
    <label class="switch">
        <input name="enable"  type="checkbox" onchange="checkbox(this,'${group._id}')">
        <span></span>
    </label>
    <button style="margin-left: 10px" class="btn btn-secondary"><i class="fa fa-trash"
      aria-hidden="true"></i></button>
    </div>
    </div> 
    `).appendTo('#users');
    $(item).find('button').on('click', () => deletegroup(JSON.stringify(group), false));
    $(item).find('input').prop('checked', true);
    if (!io) {
        var formData = new FormData();
        formData.append('group', group._id);
        var xhr = new XMLHttpRequest();
        xhr.open("POST", `/form/${$('#_id').val()}/?action=adduser`);
        xhr.onload = () => {
            var msg = new message(`กลุ่ม ${group.name} ถูกเพิ่มในผู้ใช้งานแบบฟอร์มแล้ว`, 'success');
            msg = $(msg.create()).appendTo('.messages');
            setTimeout(() => {
                $(msg).remove();
            }, 2000);
        };
        xhr.send(formData);
    }
    else {
        var msg = new message(`กลุ่ม ${group.name} ถูกเพิ่มในผู้ใช้งานแบบฟอร์มแล้ว`, 'success');
        msg = $(msg.create()).appendTo('.messages');
        setTimeout(() => {
            $(msg).remove();
        }, 2000);
    }
}

function deletegroup(group, io) {
    group = JSON.parse(group);
    if (!io) {
        var formData = new FormData();
        formData.append('group', group._id);
        var xhr = new XMLHttpRequest();
        xhr.open("POST", `/form/${$('#_id').val()}/?action=deleteuser`);
        xhr.onload = () => {
            $('#users').find('.list-item').each((index, value) => {
                if ($(value).find('p').text() == group.name) {
                    $(value).remove();
                }
            });
            var msg = new message(`กลุ่ม ${group.name} ถูกลบจากผู้ใช้งานแบบฟอร์มแล้ว`, 'success');
            msg = $(msg.create()).appendTo('.messages');
            setTimeout(() => {
                $(msg).remove();
            }, 2000);
        };
        xhr.send(formData);
    }
    else {
        var msg = new message(`กลุ่ม ${group.name} ถูกลบจากผู้ใช้งานแบบฟอร์มแล้ว`, 'success');
        msg = $(msg.create()).appendTo('.messages');
        setTimeout(() => {
            $(msg).remove();
        }, 2000);
    }
}
function checkbox(el,id) {
    var checked = $(el).prop('checked');
    var formData = new FormData();
    formData.append('group',id);
    var action;
    if (checked) {
        action = 'enableuser';
    } else {
        action = 'disableuser';
    }
    var xhr = new XMLHttpRequest();
    xhr.open("POST",`/form/${$('#_id').val()}/?action=${action}`);
    xhr.onload = ()=>{
        var msg = new message(xhr.responseText, 'success');
        msg = $(msg.create()).appendTo('.messages');
        setTimeout(() => {
            $(msg).remove();
        }, 2000);
    };
    xhr.send(formData);
}


function unsave() {
    $("#status").attr('class', 'badge badge-warning');
    $("#status").text("UNSAVED");
}


