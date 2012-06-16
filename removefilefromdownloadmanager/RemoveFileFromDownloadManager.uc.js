location == "chrome://mozapps/content/downloads/downloads.xul" && document.querySelector("#downloadContextMenu").addEventListener("popupshowing", function () {
	var menuitem_remove = document.querySelector("#downloadContextMenu").appendChild(document.createElement("menuitem"));
	menuitem_remove.setAttribute("label", "Löschen von der Festplatte");
	menuitem_remove.setAttribute("oncommand", 'gDownloadsView.selectedItems.forEach(function(item){var file=Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);file.initWithPath(item.getAttribute("path"));file.exists()&&file.remove(0);performCommand("cmd_removeFromList")})');
}, false)