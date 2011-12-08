if (location == "chrome://mozapps/content/downloads/unknownContentType.xul") {

	var dir = [
		["E:\\", "E:\\Downloads"],
		["F:\\", "F"],
		["G:\\", "G"],
		["C:\\Dokumente und Einstellungen\\Benutzername\\Desktop", "Desktop"]
		];
	var saveTo = document.getAnonymousElementByAttribute(document.querySelector("*"), "dlgtype", "cancel").parentNode.insertBefore(document.createElement("button"), document.getAnonymousElementByAttribute(document.querySelector("*"), "dlgtype", "cancel"));
	var saveToMenu = saveTo.appendChild(document.createElement("menupopup"));
	saveTo.classList.toggle("dialog-button");
	saveTo.label = "Speichern auf";
	saveTo.type = "menu";
	dir.map(function (dir) {
		var converter = Components.classes["@mozilla.org/intl/scriptableunicodeconverter"].createInstance(Components.interfaces.nsIScriptableUnicodeConverter);
		converter.charset = "GBK";
		var name= converter.ConvertToUnicode(dir[1]);
		dir = converter.ConvertToUnicode(dir[0]);
		var item = saveToMenu.appendChild(document.createElement("menuitem"));
		item.setAttribute("label", (name||(dir.match(/[^\\/]+$/) || [dir])[0]));
		item.setAttribute("image", "moz-icon:file:///" + dir + "\\");
		item.setAttribute("class", "menuitem-iconic");
		item.setAttribute("oncommand", 'var file = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);file.initWithPath("' + dir.replace(/\\/g, "\\\\") + "\\\\" + (document.querySelector("#locationtext") ? document.querySelector("#locationtext").value : document.querySelector("#location").value) + '");dialog.mLauncher.saveToDisk(file,1);dialog.onCancel=null;close()');
	})
}