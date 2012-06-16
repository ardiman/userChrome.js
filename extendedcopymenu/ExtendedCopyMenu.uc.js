location == "chrome://browser/content/browser.xul" && (function () {
	(function (m) {
		m.id = "context-copyplain";
		m.addEventListener("command", function () {
			Components.classes["@mozilla.org/widget/clipboardhelper;1"].getService(Components.interfaces.nsIClipboardHelper).copyString(content.getSelection());
		}, false);
		m.setAttribute("label", "Nur Text kopieren");
	})(document.getElementById("contentAreaContextMenu").insertBefore(document.createElement("menuitem"), document.getElementById("context-paste")));
	(function (m) {
		m.id = "context-copyHTML";
		m.addEventListener("command", function () {
			var div = content.document.createElement('div');
			div.appendChild(content.getSelection().getRangeAt(0).cloneContents());
			Components.classes["@mozilla.org/widget/clipboardhelper;1"].getService(Components.interfaces.nsIClipboardHelper).copyString(div.innerHTML);
		}, false);
		m.setAttribute("label", "Quellcode kopieren");
	})(document.getElementById("contentAreaContextMenu").insertBefore(document.createElement("menuitem"), document.getElementById("context-paste")));
	document.getElementById("contentAreaContextMenu").addEventListener("popupshowing", function () {
		gContextMenu.showItem("context-copyplain", gContextMenu.isTextSelected);
		gContextMenu.showItem("context-copyHTML", gContextMenu.isTextSelected);
	}, false);
})()
