// ==UserScript==
// @name           mousescroll-closetab
// @namespace      zhaibr@163.com
// @description    mousescroll-closetab
// @version        1.2012.1126.1
// @updateURL      https://j.mozest.com/ucscript/script/87.meta.js
// ==/UserScript==
 var time = 1;
 gBrowser.mTabContainer.addEventListener('DOMMouseScroll', function(event) {
   if (event.target.localName == "tab"){
     if(time){
       gBrowser.removeTab(event.target);
       event.stopPropagation();
       event.preventDefault();
       time = 0;
       setTimeout('time=1',400);
     }
   }
 }, true);