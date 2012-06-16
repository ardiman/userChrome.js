location == "chrome://browser/content/browser.xul" && (function () {
	(function (m) {
		m.id = "openMutiLinks";
		m.addEventListener("command", function () {
			Array.filter(content.document.links, function (link) {
				arguments.callee.uniq = arguments.callee.uniq || [];
				if ((!~arguments.callee.uniq.indexOf(link.toString())) && content.getSelection().containsNode(link, 1)) {
					arguments.callee.uniq.push(link.toString());
					return 1;
				}
			}).forEach(function (link) {
				gBrowser.addTab(link.toString());
			})
		}, false);
		m.setAttribute("label", "Linkauswahl öffnen");
	})(document.getElementById("contentAreaContextMenu").insertBefore(document.createElement("menuitem"), document.getElementById("context-openlinkintab")));
	document.getElementById("contentAreaContextMenu").addEventListener("popupshowing", function () {
		gContextMenu.showItem("openMutiLinks", Array.some(content.document.links, function (link) {
			return content.getSelection().containsNode(link, 1);
		}));
	}, false);
})()