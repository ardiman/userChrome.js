location == "chrome://browser/content/browser.xul" && (function () {
	(document.getElementById("tabbrowser-tabs") || gBrowser.mTabBox).addEventListener('click', function (e) {
		e.button == 0 && e.originalTarget.localName == "box" && BrowserOpenTab()
	}, false)
})()