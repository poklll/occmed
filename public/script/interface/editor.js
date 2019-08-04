let currentForm = new Form();
$(() => {
    var elements = $("#elements").attr('data-elements');
    if (elements) {
        var components = JSON.parse(elements).elements;
        console.log($("#elements").attr('data-elements'));
        currentForm.components = components;
        currentForm.loadEditor('#component_container');
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
        $('.container').toggleClass('slide-in-fwd-center');
    }, 500);

}

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
        $('#form').val(JSON.stringify({ components: currentForm.components }));
        $("#status").attr('class', 'badge badge-success');
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

function save() {
    currentForm.components = [];
    currentForm.saveEditor('#component_container');
    $('#render_container').empty();
    $('#form').val(JSON.stringify({ components: currentForm.components }));
    $("#status").attr('class', 'badge badge-success');
    $("#status").text("SAVED");
}

function unsave() {
    $("#status").attr('class', 'badge badge-secondary');
    $("#status").text("UNSAVED");
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

function searchuser(input){
    let filter = $(input).val().toUpperCase();
    $('#searchlist').find('.searchitem').each((index,value)=>{
        if($(value).text().toUpperCase().indexOf(filter)> -1){
               $(value).show();
        }
        else{
               $(value).hide();
        }
    })
}