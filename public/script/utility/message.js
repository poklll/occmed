
class message{
    html
    constructor(message,type){
        this.message = message;
        this.type =type;
        this.create();
    }
    create(){
        var element = `<div style="color: white;" id="message" class="alert alert-${this.type} alert-dismissible fade show" role="alert">
        ${this.message}
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
            <span aria-hidden="true">&times;</span>
        </button>
        </div>`;
        this.html = element;
        return this.html
    }
    pushTo(target){
       var msg =  $(this.create()).appendTo(target);
       setTimeout(() => {
        $(msg).remove();
      }, 2000);
    }
    pushAfter(target){
        $(this.html).insertAfter(target);
    }
    pushBefore(target){
        $(this.html).insertBefore(target);
    }
}