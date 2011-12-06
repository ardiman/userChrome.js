location == "chrome://mozapps/content/downloads/unknownContentType.xul" && (function (s) {
	var saveAndOpen = document.getAnonymousElementByAttribute(document.querySelector("*"), "dlgtype", "extra2");
	saveAndOpen.parentNode.insertBefore(saveAndOpen,document.documentElement.getButton("accept").nextSibling);
	saveAndOpen.setAttribute("hidden", "false");
	saveAndOpen.setAttribute("label", "Speichern & Öffnen");
	saveAndOpen.setAttribute("oncommand", 'Components.classes["@mozilla.org/browser/browserglue;1"].getService(Components.interfaces.nsIBrowserGlue).getMostRecentBrowserWindow().saveAndOpen.urls.push(dialog.mLauncher.source.asciiSpec);document.querySelector("#save").click();document.documentElement.getButton("accept").disabled=0;document.documentElement.getButton("accept").click()')
})()

location == "chrome://browser/content/browser.xul" && (function () {
	saveAndOpen = {
		urls: [],
		onStateChange: function (prog, req, flags, status, dl) {
			if (flags == 327696 && !! ~this.urls.indexOf(dl.source.spec)) {
				this.urls[this.urls.indexOf(dl.source.spec)] = "";
				Cc["@mozilla.org/download-manager;1"].getService(Ci.nsIDownloadManager).getDownload(Cc["@mozilla.org/download-manager;1"].getService(Ci.nsIDownloadManager).DBConnection.lastInsertRowID).targetFile.launch();
			}
		},
		onSecurityChange: function (prog, req, state, dl) {},
		onProgressChange: function (prog, req, prog, progMax, tProg, tProgMax, dl) {},
		onDownloadStateChange: function (state, dl) {}
	}
	Components.classes["@mozilla.org/download-manager;1"].getService(Components.interfaces.nsIDownloadManager).addListener(saveAndOpen);
})()