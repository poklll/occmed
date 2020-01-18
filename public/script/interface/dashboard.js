$(() => {
    $(".request-item").click(function () {
        $('.form').empty();
        showForm($(this));
    });
    $('.nav-item').click(async function () {
        try {
            $('.nav-item').removeClass('active');
            $(this).addClass('active');
        }
        catch (err) { console.log(err); }
    });
}
);


async function showForm(el) {
    if($(el).hasClass('selected')){
        $('.request>.request-item').not(el).show();  
        $('.Form').hide();
    }
    else {
        var form = await getForm();
        form.load('.Form>.card-body');
        $('.Form').show();
        $('.request>.request-item').not(el).hide();
    }
    $(el).toggleClass('selected');
}

function getForm() {
    return new Promise(resolve => {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', '/requirement/5d6bd7fac10cd8060c350539');
        xhr.onload = () => {
            var formdata = JSON.parse(xhr.responseText);
            var form = new Form();
            form.components = formdata.form;
            form.extensions = formdata.extensions;
            resolve(form);
        }
        xhr.send();
    });
}
function showcontent(){
    $('#search').show();
    $('.content').show();
    $('.qr').hide();
}
function showqr(link){
    $('#search').hide();
    $('.content').hide();
    $('.qr').css('display', 'flex').find('img').attr('src', generateqr(link));
}