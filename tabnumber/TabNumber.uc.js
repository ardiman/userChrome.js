function numExt() {
	var tabs = document.getElementById("content").mTabs;
	var count = tabs.length;
	var doc = null;
	for (var i = 0; i < count; i++) {
		doc = tabs[i].label.replace(/^\d+  \u202D/, '');
		tabs[i].label = (i + 1) + "  \u202D" + doc;
	}
}
if (location == "chrome://browser/content/browser.xul"){
window.addEventListener("TabOpen", function () { window.setTimeout(numExt, 5); }, false);
window.addEventListener("TabClose", function () { window.setTimeout(numExt, 5); }, false);
gBrowser.addEventListener("load", function(){window.setTimeout(numExt, 5);}, true);
}