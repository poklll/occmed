var temp = [];
$(document).ready(() => {

  $(".section h4").each((index,value) => {
      $(".section").eq(index).click(()=>{
        getitem($(value).text());
      });  
  })
  
});

function getitem(name) {
  var res;
  var req = new XMLHttpRequest;
  var section = "/"+name;
  req.open("GET",section,true);
  req.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      res = JSON.parse(this.responseText);
      alert((res.item)[0].Job_description);
    }
  };
  req.send();
}



function wordsearch() {
  
}