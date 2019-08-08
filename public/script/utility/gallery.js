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
          $(copy).remove();
        }, 500)
      })

     }
      

}

