// ==UserScript==
// @name           navBarInBottom.uc.js
// @namespace      http://www.slimeden.com
// @author         Xiao Shan
// @description    move nav-bar to the bottom
// @version        0.0.2 - 20110315
// ==/UserScript==
(function() {
    var navBar = document.getElementById('nav-bar');
    var browserArea = document.getElementById('browser');
    browserArea.parentNode.insertBefore(navBar, browserArea.nextSibling);    

    try {
        eval("onViewToolbarsPopupShowing = " + onViewToolbarsPopupShowing.toString().replace(/toolbarNodes\.push/, 'toolbarNodes.push(document.getElementById("nav-bar"));$&'));
    }catch(e){}
})();
