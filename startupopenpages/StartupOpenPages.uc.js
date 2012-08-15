// ==UserScript==
// @name           startupOpenPages
// @namespace      http://d.hatena.ne.jp/Cherenkov/
// @include        chrome://browser/content/browser.xul
// ==/UserScript==

(function(){

function open() {
//gBrowser.addTab("about:home");
  gBrowser.addTab("http://www.camp-firefox.de/forum");
//gBrowser.addTab("http://www.google.de/");
}
setTimeout(open,0);

})();
