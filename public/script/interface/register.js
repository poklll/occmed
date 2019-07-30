var currentimg;

function readURL(input) {
          if(currentimg){
            deleteimg(currentimg);
          }
          uploadimg($(input));
  }
  
  function uploadimg(fileinput){
    var files = $(fileinput).prop("files");
    var formData = new FormData();
    $.map(files, file => {
        formData.append('file', file);
    });
    let xhr = new XMLHttpRequest();
    xhr.open("POST", "/upload");
    xhr.onload = function () {
        var imgpaths = JSON.parse(xhr.responseText).files;
        imgpaths.forEach(img => {
            currentimg = img.path;
            $('#img').val(img.path);
            $('#profileimg').attr('src', img.path);
        });
    }
    xhr.send(formData);
  }

  function deleteimg(path){
    let xhr = new XMLHttpRequest();
    xhr.open("DELETE",path);
    xhr.onload = function () {
          console.log('del img done');
    }
    xhr.send();

  }


