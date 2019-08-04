function readURL(event) {
  var file = event.target.files[0];
  var reader = new FileReader();

  reader.onload = function () {
    var image = reader.result;
    $('#profileimg').attr('src', image);
  }
  if (file) {
    reader.readAsDataURL(file);
  } else {
    alert("no file");
  }
}


function uploadimg() {
  var files = $('#profilepic').prop("files");
  var formData = new FormData();
  $.map(files, file => {
    formData.append('file', file);
  });
  let xhr = new XMLHttpRequest();
  xhr.open("POST", "/upload");
  xhr.onload = function () {
      var imgpaths = JSON.parse(xhr.responseText).files;
      imgpaths.forEach(img => {
        $('#img').val(img.path);
      });
      $('form').submit();
    }
  xhr.send(formData);
}

function submitform() {
  uploadimg();
}


