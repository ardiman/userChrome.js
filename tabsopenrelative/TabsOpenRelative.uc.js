/* TabsOpenRelative.uc.js */

(function() {
try {
if(!gBrowser) return;
}catch(e) {
return;
}

gBrowser.tabContainer.addEventListener("TabOpen", tabOpenHandler, false);

function tabOpenHandler(event) {
var tab = event.target;
gBrowser.moveTabTo(tab, gBrowser.mCurrentTab._tPos + 1);
}

})();
