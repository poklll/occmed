let choices = [];

function addItem(type) {
  
        type = $("#component_type").val();
        element = createElement(name, type);
        $(element).appendTo("#component_container");
        autosize($('.textarea-autosize'));
        $("#component_name").val("");
}

function addChoice() {
    name = $("#component_name").val();
    if(!name)
    {
        errorAlert("Please enter component name");
    }
    else
    {
        choice = $("#choice_name").val();
        item = createChoice(name, choice);
        $(item).appendTo("#choice_container");
    }
}
function removeItem(el) {
    $(el).parent().remove();
}

function createElement(name, type) {
    let element;
    if (type == "Long text") {
        element = `<div class="form-group component_item" id="${name}">
        <label for="${name}" class="mb-1">${name}</label>
        <button type="button" class="close" aria-label="Close" onclick="removeItem(this)">
        <span aria-hidden="true">&times;</span>
        </button>
        <textarea  name="${name}" class="form-control textarea-autosize" rows="1"></textarea>
        </div>`;

    }
    else
        if (type == "Choices") {
            element = `<div class="form-group component_item" id="${name}">
        <label for="${name}" class="mb-1">${name}</label>
        <button type="button" class="close" aria-label="Close" onclick="removeItem(this)">
        <span aria-hidden="true">&times;</span>
        </button>
         ${getAllChoices(name)}
        </div>`;
        }
        else {
            element = `<div class="form-group component_item" id="${name}">
        <label for="${name}" class="mb-1">${name}</label>
        <button type="button" class="close" aria-label="Close" onclick="removeItem(this)">
        <span aria-hidden="true">&times;</span>
        </button>
        <input type="${type}" name="${name}" class="form-control"></input>
        </div>`;
        }
    return element;
}

function showChoiceEditor(el) {
    if ($(el).val() == "Choices") {
        $("#choice_editor").css("display", "inline");
    }
    else {
        $("#choice_editor").css("display", "none");
    }
}



function getAllChoices(name) {
    let item = "";
    if (choices) {
        choices.map(choice => {
            item += createChoice(name, choice);
        });
    }
    return item;
}

function createChoice(name, choice) {
    item = `<div class="custom-control custom-radio">
                  <input type="radio" class="custom-control-input" id="${choice}" name="${name}" value="${choice}">
                  <label class="custom-control-label" for="${choice}">${choice}</label>
                  <button type="button" class="close ml-2" aria-label="Close" onclick="removeItem(this)">
                  <span aria-hidden="true">&times;</span>
                  </button>
                </div>`;
    return item;
}

function saveForm() {

}

function preview() {
     
}


function errorAlert(message) {
    alert =`<div style="color: white;" id="message" class="alert alert-danger alert-dismissible fade show" role="alert">
        ${message}
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
            <span aria-hidden="true">&times;</span>
        </button>
    </div>`;
    $(alert).insertBefore('#component_container');

}