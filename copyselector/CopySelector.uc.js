// ==UserScript==
// @name           copySelector
// @description    Stylish から拝借
// @namespace      http://d.hatena.ne.jp/Griever/
// @author         Griever
// @include        chrome://inspector/content/inspector.xul
// @compatibility  Firefox 4, Firefox 9
// @version        0.0.1a
// @note           V.0.0.1a umgeht Fehler, falls pane==null
// ==/UserScript==

setTimeout(function() {
	var pane = document.getElementById("bxDocPanel");
	if (pane==null) return;  // in nicht DomI-Fenstern aussteigen
	var iframe = pane.mIFrameEl;
	var win = iframe.contentWindow;
	var doc = iframe.contentDocument;

	if (win.stylishDomi) return;

	win.stylishDomi = {
		generateSelectors: function(event) {
			var node = win.viewer.selectedNode;
			if (!(node instanceof Element)) {
				return;
			}
			var popup = event.target;
			var idmenu = doc.getElementById("copy-selector-id");
			var classmenu = doc.getElementById("copy-selector-class");

			// id selector
			if (node.hasAttribute("id")) {
				idmenu.setAttribute("label", "#" + node.getAttribute("id"));
				idmenu.setAttribute("hidden", "false");
			} else {
				idmenu.setAttribute("hidden", "true");
			}
			//class selector
			if (node.hasAttribute("class")) {
				classmenu.setAttribute("label", "." + node.getAttribute("class").split(/\s+/).join("."));
				classmenu.setAttribute("hidden", "false");
			} else {
				classmenu.setAttribute("hidden", "true");
			}
		},
		copySelectorToClipboard: function(event) {
			Components.classes["@mozilla.org/widget/clipboardhelper;1"].getService(Components.interfaces.nsIClipboardHelper).copyString(event.target.getAttribute("label"));
		}
	}

	var mnEditPasteMenu = doc.querySelector("#mnEditPasteMenu + menuseparator");

	var m = doc.createElement("menuitem");
	m.setAttribute("id", "copy-selector-id");
	m.setAttribute("hidden", "true");
	m.setAttribute("oncommand", "stylishDomi.copySelectorToClipboard(event);");
	mnEditPasteMenu.parentNode.insertBefore(m, mnEditPasteMenu);

	var m = doc.createElement("menuitem");
	m.setAttribute("id", "copy-selector-class");
	m.setAttribute("hidden", "true");
	m.setAttribute("oncommand", "stylishDomi.copySelectorToClipboard(event);");
	mnEditPasteMenu.parentNode.insertBefore(m, mnEditPasteMenu);

	doc.getElementById('ppDOMContext').addEventListener('popupshowing', win.stylishDomi.generateSelectors, false);
	win.addEventListener('unload', function(event){
		doc.getElementById('ppDOMContext').removeEventListener('popupshowing', win.stylishDomi.generateSelectors, false);
	}, false);
}, 500);
