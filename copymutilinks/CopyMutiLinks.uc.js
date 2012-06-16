location == "chrome://browser/content/browser.xul" && (function () {
	(function (m) {
		m.id = "copyMutiLinks";
		m.addEventListener("command", function () {
			Components.classes['@mozilla.org/widget/clipboardhelper;1'].getService(Components.interfaces.nsIClipboardHelper).copyString(Array.filter(content.document.links, function (link) {
				arguments.callee.uniq = arguments.callee.uniq || [];
				if ((!~arguments.callee.uniq.indexOf(link.toString())) && content.getSelection().containsNode(link, 1)) {
					arguments.callee.uniq.push(link.toString());
					return 1;
				}
			}).map(function (link) {
				return link.toString();
			}).join("\r\n"));
		}, false);
		m.setAttribute("label", "Linkauswahl kopieren");
	})(document.getElementById("contentAreaContextMenu").insertBefore(document.createElement("menuitem"), document.getElementById("context-openlinkintab")));
	document.getElementById("contentAreaContextMenu").addEventListener("popupshowing", function () {
		gContextMenu.showItem("copyMutiLinks", Array.some(content.document.links, function (link) {
			return content.getSelection().containsNode(link, 1);
		}));
	}, false);
})()