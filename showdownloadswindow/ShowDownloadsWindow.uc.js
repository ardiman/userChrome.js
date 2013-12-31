// ==UserScript==
// @name           show_downloads_window.uc.js
// @include        chrome://browser/content/browser.xul
// ==/UserScript==
(function(){

var func = DownloadsCommon.getData(window)._updateDataItemState.toString();
func = func.replace(
	'this._notifyDownloadEvent("start");',
	'$& BrowserDownloadsUI();'
)
.replace(
  'this._notifyDownloadEvent("finish");',
  '$& \
  setTimeout(function(){ \
    var mediator = Components.classes["@mozilla.org/appshell/window-mediator;1"] \
                   .getService(Components.interfaces.nsIWindowMediator); \
    var enumerator = mediator.getEnumerator(null); \
    while(enumerator.hasMoreElements()) { \
      var win = enumerator.getNext(); \
      if (win.location == "chrome://browser/content/places/places.xul") { \
        win.close(); \
      } \
    } \
  }, 1000);'
);
eval("DownloadsCommon.getData(window)._updateDataItemState = "+ func);

})();
