class Gallery {
  element
  currentimg
  constructor() {
    this.create();
  }
  create() {
    var element = document.createElement('div');
    $(element).addClass('gallery');
    this.element = element;
    return this.element;
  }
  add(file) {
    var cropper = document.createElement('div');
    $(cropper).addClass('cropper');
    cropper = $(cropper).appendTo(this.element);
    var image = $(`<img title="${file.filename}" data-file="${encodeURIComponent(JSON.stringify(file))}" class="img" data-path="${file.path}" data-driveid="${file.driveid}" src="${file.path}"></img>`).appendTo(cropper);
    var gal = this;
    $(image).click(() => {
      gal.menusetup(file,cropper);
    });
    return this.element;
  }
  show(){
    $(this.element).css('display','grid');
  }
  hide(){
    $(this.element).hide();
  }
  empty(){
    $(this.element).empty();
  }
  menusetup(file,cropper){
    var gal = this;
    var fullscreen = $('<div class="fullscreen fade-in"></div>').insertBefore('body');
    var corousel = `<div class="img_menu">
         <div><i id="left" class="fas fa-arrow-left"></i></div>
         <div><i id="right" class="fa fa-arrow-right" aria-hidden="true"></i></div>
         </div>`;
    corousel = $(corousel).appendTo(fullscreen);
    var del = `<button name="" id="" class="btn"  role="button">
    <i class="fa fa-trash" aria-hidden="true"></i><p>  delete</p></button>`;
    var menu = `<div class="img_tab"></div>`;
    menu = $(menu).appendTo(fullscreen);
    var download = `<button name="" id="" class="btn"  role="button">
    <i class="fa fa-download" aria-hidden="true"></i>download</button>`; 
    download = $(download).appendTo(menu);
    del = $(del).appendTo(menu);
    var img = `<img src="${file.path}"></img>`;
    img = $(img).appendTo(fullscreen);
    gal.currentimg = cropper;
    $(fullscreen).click(() => {
      $(fullscreen).remove();
      $(corousel).remove();
    });
    $(corousel).find('#right').click(() => {
      event.stopPropagation();
      var next = $(gal.currentimg).next().find('img').attr('data-path');
      $(img).attr('src', next);
      if ($(gal.currentimg).next().length > 0) {
        gal.currentimg = $(gal.currentimg).next();
      }
    });
    $(corousel).find('#left').click(() => {
      event.stopPropagation();
      var prev = $(gal.currentimg).prev().find('img').attr('data-path');
      $(img).attr('src', prev);
      if ($(gal.currentimg).prev().length > 0) {
        gal.currentimg = $(gal.currentimg).prev();
      }
    });
    $(del).click(()=>{
       event.stopPropagation();
       this.delete(img);
    });
    $(download).click(()=>{
       event.stopPropagation();
       this.download();
    });

  }
  delete(img){
      var gal = this;
      var id = $(this.currentimg).find('img').attr('data-driveid');
      var xhr = new XMLHttpRequest();
      xhr.open("DELETE",`/file/${id}`);
      xhr.onload = function () {
         console.log(xhr.responseText);
         var prev = $(gal.currentimg).prev().find('img').attr('data-path');
         var oldimg = gal.currentimg;
         if($(gal.currentimg).prev().length > 0)
         {  
            $(img).attr('src',prev);
         } 
         else{
            $(img).parent().remove();
         }
         gal.currentimg = $(oldimg).prev();
         $(oldimg).remove();
      };
      xhr.send();
  }
  download(){
    var path = $(this.currentimg).find('img').attr('data-path');
    window.location.href = path;
  }
}

