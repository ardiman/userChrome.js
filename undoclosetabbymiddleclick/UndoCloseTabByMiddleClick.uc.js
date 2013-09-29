location == "chrome://browser/content/browser.xul" && (document.getElementById("tabbrowser-tabs") || gBrowser.mTabBox).addEventListener('click', function (event) {
   event.button == 1 && event.originalTarget.localName === "box" && ((parseInt(Application.version) > 3 && gBrowser.removeTab(gBrowser.mCurrentTab)) & undoCloseTab());
}, false)