location == "chrome://browser/content/browser.xul" && gBrowser.mPanelContainer.addEventListener("drop", function (event) {
	event.dataTransfer.files.length >1 && gBrowser.loadTabs(Array.map(event.dataTransfer.files, function (file) {
		return file.mozFullPath
	}), false, true)
}, false)