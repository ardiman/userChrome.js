// ==UserScript==
// @name          CopyTabURL.uc.js
// @description   Tab Url über das TabKontextmenü in die Zwischenablage kopieren
// @include       main
// @charset       UTF-8
// @version       2016/01/13 Um beim Start die Menüposition zu ändern, Separator eingefügt.
// ==/UserScript==
(function(doc) {
	var node = doc.getElementById("tabContextMenu");
	var mi = doc.createElement("menuitem");
	mi.setAttribute("id", "copytaburl");
	mi.setAttribute("label", "Tab URL kopieren");
	mi.addEventListener('command', (event) => {
		var tab = TabContextMenu.contextTab;
		var curURL = tab.linkedBrowser.currentURI.spec;
		var cb = Cc['@mozilla.org/widget/clipboardhelper;1']
						.getService(Ci.nsIClipboardHelper);
		cb.copyString(curURL);
	});
	node.insertBefore(mi, node.firstChild);

	if (!sep) {
		var sep = doc.createElement('menuseparator');
		sep.setAttribute('id', 'copytaburl-sep');
		var insPos = doc.getElementById('copytaburl');
		node.insertBefore(sep, insPos.nextSibling);
	}
}(document));
