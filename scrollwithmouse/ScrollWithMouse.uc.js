// ==UserScript==
// @name               ScrollWithMouse.uc.js
// @namespace          ScrollWithMouse@gmail.com
// @description        免点击鼠标拖动，来自Mozest.com社区
// ==/UserScript==
(function(){
    var speed = 1;
    var scrollMode = 0;
    var scrollStartSWTM = -1;         
    function mouseScroll(event) {
        if (scrollStartSWTM != -1){
            var document = window.content.document;
            if(document.body instanceof HTMLFrameSetElement) {
                document = window.content.frames[0].document; } 
            var factor = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight) / window.content.innerHeight;                        
            var delta = speed*factor*(event.screenY - scrollStartSWTM);
            document.body.scrollTop += delta;
            document.documentElement.scrollTop += delta;
        }
        scrollStartSWTM = event.screenY;
    }

    function startScroll() {
            if(!scrollMode){
        scrollMode = 1;
        window.addEventListener('mousemove', mouseScroll, true)}}        
    function stopScroll() {
        if(scrollMode){
                scrollMode = 0;
        scrollStartSWTM = -1;
        window.removeEventListener('mousemove', mouseScroll, true)}}
                
        var content=document.getElementById("content")
    content.addEventListener("mousemove", function(e)  {                                                              
            if (e.clientX > window.content.document.documentElement.clientWidth){startScroll();}
                        },false);
        content.addEventListener("mouseout", function(e) {stopScroll();},false);
})();
