// ==UserScript==
// @name           doubleClickToPinTab
// @namespace      maoanran@gmail.com
// @description    一个小脚本,实现双击锁定和解锁标签页的功能,请多指教.
// @author         anran
// @version        0.1.1.2
// @updateURL     https://j.mozest.com/ucscript/script/45.meta.js
// ==/UserScript==

(function() {
    document.getElementById("tabbrowser-tabs").ondblclick = function (event) {
        var subTab = event.originalTarget;
        while(subTab.localName != "tab") {
            subTab = subTab.parentNode;
        }
        if(subTab.pinned){
            gBrowser.unpinTab(subTab);
        } else {
            gBrowser.pinTab(subTab);
        }
    }
})();