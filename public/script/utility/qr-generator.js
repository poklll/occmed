
function generateqr() {
    var code = $('#qr').val();
    var image =  `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${code}`;
    $('#myqr').attr('src',image);
}