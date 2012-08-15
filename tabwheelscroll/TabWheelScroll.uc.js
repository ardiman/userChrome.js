// ==UserScript==
// @name           Tab Wheel Scroll
// @namespace      http://d.hatena.ne.jp/Cherenkov/
// @description    ???????????
// @include        chrome://browser/content/browser.xul
// ==/UserScript==

(function(){
gBrowser.mTabContainer.addEventListener("DOMMouseScroll", function(event){
	this.advanceSelectedTab(event.detail > 0 ? +1 : -1, true);
}, true);
})();