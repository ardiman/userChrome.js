var CBIR = {
	URL: '',
	show: function () {
		var m = document.getElementById("CBIR-search");
		m.hidden = true;
		if (gContextMenu.onImage || (gContextMenu.hasBGImage && !gContextMenu.isTextSelected)) {
			CBIR.URL = gContextMenu.mediaURL || gContextMenu.imageURL || gContextMenu.bgImageURL;
			m.hidden = false;
		}
	},
	init: function () {
		(function (m) {
			m.id = "CBIR-search";
			m.hidden = true;
			m.setAttribute("oncommand", "CBIR.search()");
			m.setAttribute("label", "Web-Bildersuche");
		})(document.getElementById("context-viewimage").parentNode.insertBefore(document.createElement("menuitem"), document.getElementById("context-viewimage")));
		document.getElementById("contentAreaContextMenu").addEventListener("popupshowing", CBIR.show, false);;
	},
	search: function () {
		if (!CBIR.URL) return;
		getBrowser().selectedTab = getBrowser().addTab('http://www.tineye.com/search/?pluginver=firefox-1.0&sort=size&order=desc&url=' + encodeURIComponent(CBIR.URL));
		getBrowser().selectedTab = getBrowser().addTab('http://www.google.com/searchbyimage?image_url=' + encodeURIComponent(CBIR.URL));
	}
}
location == "chrome://browser/content/browser.xul" && CBIR.init();
