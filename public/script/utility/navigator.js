var temp = [];
$(document).onReady(()=>{
  $('.section h4').each(function(index){
    temp.push($('.section')[index]);
});
});
function home()
{   
      sections.map(item => {
           alert(item.name);
      });
}


function wordsearch()
{    var keyword = $('#search').val();
if(keyword)
{
  $('.section h4').each(function(index){
          if (($(this).text()).includes(keyword)){
  
          }
          else
          {  
            $('.section')[index].remove();
          }
  });
}
else{
    $(".item-container").empty();
    temp.map((item)=>{
      $(".item-container").append(item);
    })
    
}

}