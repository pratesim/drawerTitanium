Ti.API.debug("newUser Controller");

$.ok.addEventListener('click',function(evt){
   alert("Cliccato su OK");
});

$.cancel.addEventListener('click',function(evt){
    $.newUser.close();
});

$.newUser.open();
