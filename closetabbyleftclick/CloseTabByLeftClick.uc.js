(document.getElementById("tabbrowser-tabs") || gBrowser.mTabBox).addEventListener('click', function (e) {
	e.button == 0 && e.originalTarget.localName != 'toolbarbutton' && e.target.localName == 'tab' && ((gBrowser.mTabs.length > 1 || gBrowser.mPrefs.getBoolPref("browser.tabs.closeWindowWithLastTab")) ? gBrowser.removeTab(e.target) : (content.location = "about:blank"));
}, false)
