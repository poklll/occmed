
function generateqr(code) {
    var image =  `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${code}`;
    return image;
}