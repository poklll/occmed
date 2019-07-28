class Gallery
{    element
     constructor(){
          this.create();
     }
     create(){
        var element = document.createElement('div');
        $(element).addClass('gallery');
        this.element = element;
        return this.element;     
     }
     add(path){
       var image = document.createElement('img');
       $(image).addClass('img-w');
       $(image).attr('src',path);
       $(image).appendTo(this.element);
       $(image).wrap("<div class='img-c'></div>");
       let imgSrc = path;
       $(image).parent().css('background-image', 'url(' + imgSrc + ')');
       var imgc = $(image).parent();
       $(imgc).height($(imgc).width());
       var del = $('<button id="del_image" class="btn btn-danger del-gl"></button>').appendTo(imgc);
       $(del).css('width', '30%');
       $(del).html('<i class="fa fa-trash" aria-hidden="true"></i>');
       $(del).click(()=>{
            $(imgc).remove();
           alert(path);
           let xhr = new XMLHttpRequest();
                      xhr.open("DELETE",path);
                      xhr.onload = function () {
                            alert('image was removed');
                      }
                      xhr.send();

       });
       this.refresh();
       return this.element;
     }
     refresh(){
        var gal = this.element;
      $(this.element).find(".img-c").click(function() {
        let w = $(this).outerWidth();
        let h = $(this).outerHeight();
        let x = $(this).offset().left;
        let y = $(this).offset().top;
        $(gal).find(".img-w").css("object-fit","contain");
        $(".active").not($(this)).remove();
        let copy = $(this).clone();
        copy.insertAfter($(this)).height(h).width(w).delay(500).addClass("active");
        $(".active").css('top', y - 8);
        $(".active").css('left', x - 8);
        $(copy).find('#del_image').remove();
        var next = $('<div class="gal-nav"></dav>');
        $(copy).css('display','flex');

          setTimeout(function() {
        copy.addClass("positioned");
      }, 0)
        
      }); 

      $(document).on("click", ".img-c.active", function() {
        let copy = $(this);
        copy.removeClass("positioned active").addClass("postactive");
        $(gal).find(".img-w").css("object-fit","cover");
        setTimeout(function() {
          copy.remove();
        }, 500)
      })

     }
      

}

