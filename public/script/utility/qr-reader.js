var qrimage;


function camerainput(event)
{
  var file    = event.target.files[0];
  var reader  = new FileReader();
  
  reader.onload = function () {
    qrimage = reader.result;
     var image = document.createElement('img');
     image.src = qrimage;
     qrread(image);
  }
  
  if (file) {
    reader.readAsDataURL(file);
  } else {
    alert("no file");
  }

}


function qrread(img)
{
  QCodeDecoder().decodeFromImage(img, function (err, result) {
  alert(result);
});
}
