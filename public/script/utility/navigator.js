function showlist() {
      $('.container').hide();
      $('.form-list').show();
      $('.form-list').css('display', 'flex');
      $('.form-list').css('justify-content', 'center');
      $('.form-list').css('flex-direction', 'column');
      $('.form-list').css('align-items', 'center');
      $('.form-list').toggleClass('slide-in-fwd-center');
}

function showeditor() {
      $('.qr').hide();
      $('.user').hide();
      $('.container').show();
}

function showuser() {
      $('.container').hide();
      $('.qr').hide();
      $('.user').css('display', 'flex');
}

function showqr(name) {

      $('.qr').css('display', 'flex').find('img').attr('src', generateqr(name));
      $('.container').hide();
      $('.user').hide();
}