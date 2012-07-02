location == "chrome://browser/content/browser.xul" && (document.getElementById("tabbrowser-tabs") || gBrowser.mTabBox).addEventListener('click', function (e) {
	e.button == 1 && e.originalTarget.localName == "box" && ((Application.version[0] > 3 && gBrowser.removeTab(gBrowser.mCurrentTab)) & undoCloseTab());
}, false)