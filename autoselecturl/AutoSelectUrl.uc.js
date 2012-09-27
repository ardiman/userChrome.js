function hook(e){
    e.target.removeEventListener("mouseover",sel,false);
    e.target.removeEventListener("mouseout",blu,false);
    e.target.addEventListener("click",clicker,false);
    document.addEventListener("mouseover",mover,false);
}
function sel(e){ 
    e.target.select();
}
function blu(e){
    e.target.blur();
}
function urlkeydown(e){
    e.target.removeEventListener(e.type, arguments.callee, false);
    hook(e);
}
function urlclick(e){
    if(e.button!=0){
        e.target.removeEventListener(e.type, arguments.callee, false);
        hook(e);
    }
}
function clicker(e){
    if(e.button==0){
        e.target.removeEventListener("click", arguments.callee, false);
        document.removeEventListener("mouseover", mover, false);
        init();
    }
}
function mover(e){
    if(e.target.id!="urlbar"){
        document.removeEventListener("mouseover", arguments.callee, false);
        document.getElementById("urlbar").removeEventListener("click", clicker, false);
        init();
    }
}
function init(){
    var urlbar = document.getElementById("urlbar");
    urlbar.addEventListener("mouseover",sel,false);
    urlbar.addEventListener("mouseout",blu,false);
    urlbar.addEventListener("keydown",urlkeydown, false);
    urlbar.addEventListener("click",urlclick, false);
}
init();

document.getElementById("searchbar").addEventListener("mouseover",
    function(e) { document.getAnonymousElementByAttribute(document
    .getElementById("searchbar"), "class", "searchbar-textbox").
    select(); }, false);
	