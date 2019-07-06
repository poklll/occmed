HTMLTextAreaElement.prototype.getCaretPosition = function () { //return the caret position of the textarea
    return this.selectionStart;
};
HTMLTextAreaElement.prototype.setCaretPosition = function (position) { //change the caret position of the textarea
    this.selectionStart = position;
    this.selectionEnd = position;
    this.focus();
};
HTMLTextAreaElement.prototype.hasSelection = function () { //if the textarea has selection then return true
    if (this.selectionStart == this.selectionEnd) {
        return false;
    } else {
        return true;
    }
};
HTMLTextAreaElement.prototype.getSelectedText = function () { //return the selection text
    return this.value.substring(this.selectionStart, this.selectionEnd);
};
HTMLTextAreaElement.prototype.setSelection = function (start, end) { //change the selection area of the textarea
    this.selectionStart = start;
    this.selectionEnd = end;
    this.focus();
};

function addTabsupport(){
      $('textarea').each((index,value)=>{
            $(value).on('keydown',(event)=>{
                if (event.keyCode == 9) { //tab was pressed
                    var newCaretPosition;
                    newCaretPosition = value.getCaretPosition() + "    ".length;
                    value.value = value.value.substring(0, value.getCaretPosition()) + "    " + value.value.substring(value.getCaretPosition(), value.value.length);
                    value.setCaretPosition(newCaretPosition);
                    return false;
                }
                if(event.keyCode == 8){ //backspace
                    if (value.value.substring(value.getCaretPosition() - 4, value.getCaretPosition()) == "    ") { //it's a tab space
                        var newCaretPosition;
                        newCaretPosition = value.getCaretPosition() - 3;
                        value.value = value.value.substring(0, value.getCaretPosition() - 3) + value.value.substring(value.getCaretPosition(), value.value.length);
                        value.setCaretPosition(newCaretPosition);
                    }
                }
              });
      });
}

