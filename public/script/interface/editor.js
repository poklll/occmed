let currentForm = new Form();
let currentEditor = '';
$(() => {
    currentEditor = $('#editor_container');
    var formdata = $("#elements").attr('data-elements');
    if (formdata) {
        var form = JSON.parse(formdata);
        console.log($("#elements").attr('data-elements'));
        currentForm.components = form.components;
        currentForm.extensions = form.extensions;
        currentForm.loadEditor('#editor_container');
        $(currentEditor).sortable();
        $(currentEditor ).disableSelection();
        $('#render_container').hide();
        $(window).scrollTop(0);
        $('.nav-item').show();
        
    }
    else {
        $('.container').hide();
        $('.navbar-toggler').hide();
        showlist();
    }
  $('.nav-item').click(async function(){
      try{
        $('.nav-item').removeClass('active');
        $(this).addClass('active');
      }
      catch(err){console.log(err);}
  });
}
)

function newForm() {
    setTimeout(() => {
        $('.form-list').hide();
        $('.container').show();
        $('#render_container').hide();
        $('.container').toggleClass('slide-in-fwd-center');
    }, 500);

}

function deleteform(name) {
    let xhr = new XMLHttpRequest();
    xhr.open("DELETE", "/form/" + name);
    xhr.onload = function () {
        alert(`${name} has been deleted`);
        window.location.href = "/form_editor";
    }
    xhr.send();
}


async function selectEditor(el){
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
        currentForm.saveEditorTo('#editor_container','#render_container');
        $('.element_container').css('border','0');
        $('#form').val(JSON.stringify({ components: currentForm.components,extensions: currentForm.extensions }));
        $("#status").attr('class', 'badge badge-success');
        $("#status").text("SAVED");
        text = "Editor";
    }
    else {
        $('#editor_container').show();
        $('.element_container').css('border','0.5px dashed black');
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
    $('#form').val(JSON.stringify({ components: currentForm.components , extensions: currentForm.extensions }));
    $("#status").attr('class', 'badge badge-success');
    $("#status").text("SAVED");
}



function addItem(type) {
    var el = new Element();
    el.type = type;
    el.draftTo(currentEditor);
}


function unsave() {
    $("#status").attr('class', 'badge badge-secondary');
    $("#status").text("UNSAVED");
}


