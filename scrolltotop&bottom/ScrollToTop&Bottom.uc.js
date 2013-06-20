// ==UserScript==
// @name           scrollTotop&bottom
// @namespace     scrollTotop&bottom@zhaibr
// @description    scrollTotop&bottom
// @version       1.2012.1222.1
// @updateURL     https://j.mozest.com/ucscript/script/90.meta.js
// ==/UserScript==

(function(){
var content = document.getElementById("content"); 
content.addEventListener("DOMMouseScroll", function(e) {
	    if(e.clientX >window.content.document.documentElement.clientWidth-50){
	        if (e.detail>0)goDoCommand("cmd_scrollBottom");
			else goDoCommand("cmd_scrollTop");
		}
	})
})();
