let choices = [];

function additem() {
    name = $("#component_name").val();
    type = $("#component_type").val();
    element = createElement(name, type);
    $(element).appendTo("#component_container");
    autosize($('.textarea-autosize'));
}

function removeitem(el) {
    $(el).parent().remove();
}

function createElement(name, type) {
    let element;
    if (type == "Long text") {
        element = `<div class="form-group component_item" id="${name}">
        <label for="${name}" class="mb-1">${name}</label>
        <button type="button" class="close" aria-label="Close" onclick="removeitem(this)">
        <span aria-hidden="true">&times;</span>
        </button>
        <textarea  name="${name}" class="form-control textarea-autosize" rows="1"></textarea>
        </div>`;
     
    }
    else
    if (type == "Choices") {
        element = `<div class="form-group component_item" id="${name}">
        <label for="${name}" class="mb-1">${name}</label>
        <button type="button" class="close" aria-label="Close" onclick="removeitem(this)">
        <span aria-hidden="true">&times;</span>
        </button>
        <input type="${type}" name="${name}" class="form-control"></input>
        </div>`;
    }
    else 
    {
        element = `<div class="form-group component_item" id="${name}">
        <label for="${name}" class="mb-1">${name}</label>
        <button type="button" class="close" aria-label="Close" onclick="removeitem(this)">
        <span aria-hidden="true">&times;</span>
        </button>
        <input type="${type}" name="${name}" class="form-control"></input>
        </div>`;
    }
    return element;
}