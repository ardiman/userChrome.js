(function() {
	var menuitem = document.createElement("menuitem");
	menuitem.setAttribute("label", "Open 'chrome' Folder");
	menuitem.setAttribute("accesskey", "h");
	menuitem.setAttribute("oncommand", 'Components.classes["@mozilla.org/file/directory_service;1"].getService(Components.interfaces.nsIProperties).get("UChrm", Components.interfaces.nsILocalFile).launch();');
	
	var optionsitem = document.getElementById("menu_preferences");
	optionsitem.parentNode.insertBefore(menuitem, optionsitem);
})();