function showlist() {
      $('.container').hide();
      $('.form-list').show();
      $('.form-list').toggleClass('slide-in-fwd-center');
}

function showeditor() {
      $('.qr').hide();
      $('.user').hide();
      $('.container').css('display','flex');
}

function showuser() {
      $('.container').hide();
      $('.qr').hide();
      $('.user').css('display', 'flex');
      $('#result-list').width($('#group-search').width());
}

function showqr(name) {

      $('.qr').css('display', 'flex').find('img').attr('src', generateqr(name));
      $('.container').hide();
      $('.user').hide();
}